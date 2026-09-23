# Architecture — Todolist App

## 1. Tổng quan
Ứng dụng gồm 2 phần tách biệt, giao tiếp qua REST API:
- **Backend**: Node.js + Express + Prisma, kiến trúc theo module (feature-based).
- **Frontend**: React (Vite), tổ chức theo feature, tương ứng với các module backend.
- **Database**: PostgreSQL.
- **AI Chatbot**: backend đóng vai trò proxy, forward request đến workflow n8n có sẵn (n8n xử lý logic AI, backend không tự gọi AI trực tiếp).

## 2. Sơ đồ thư mục đầy đủ

```
Todolist/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js                 # đọc & export biến môi trường
│   │   │
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js      # verify JWT, gắn req.user
│   │   │   └── errorHandler.js        # xử lý lỗi tập trung
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── auth.controller.js
│   │   │   │   └── auth.service.js
│   │   │   │
│   │   │   ├── todo/
│   │   │   │   ├── todo.routes.js
│   │   │   │   ├── todo.controller.js
│   │   │   │   └── todo.service.js
│   │   │   │
│   │   │   ├── notes/
│   │   │   │   ├── notes.routes.js
│   │   │   │   ├── notes.controller.js
│   │   │   │   └── notes.service.js
│   │   │   │
│   │   │   ├── pomodoro/
│   │   │   │   ├── pomodoro.routes.js
│   │   │   │   ├── pomodoro.controller.js
│   │   │   │   └── pomodoro.service.js
│   │   │   │
│   │   │   ├── chatbot/
│   │   │   │   ├── chatbot.routes.js
│   │   │   │   ├── chatbot.controller.js  # gọi n8n webhook
│   │   │   │   └── chatbot.service.js
│   │   │   │
│   │   │   └── integrations/
│   │   │       ├── mail/
│   │   │       │   └── mail.provider.js
│   │   │       ├── notifications/
│   │   │       │   └── notifications.provider.js
│   │   │       └── alarm/
│   │   │           └── alarm.provider.js
│   │   │
│   │   ├── utils/
│   │   │   └── apiResponse.js
│   │   │
│   │   └── app.js                     # setup express, mount tất cả route
│   │
│   ├── index.js                       # entry point, chỉ listen server
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.api.js
│   │   │   ├── todo.api.js
│   │   │   ├── notes.api.js
│   │   │   ├── pomodoro.api.js
│   │   │   └── chatbot.api.js
│   │   │
│   │   ├── components/                # component dùng chung
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Layout.jsx
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── todo/
│   │   │   ├── notes/
│   │   │   ├── pomodoro/
│   │   │   └── chatbot/
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useFetch.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── router/
│   │   │   └── index.jsx              # react-router config, protected routes
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── docs/
│   ├── ROADMAP.md
│   ├── CONVENTION.md
│   └── ARCHITECTURE.md
│
├── docker-compose.yml                 # thêm ở Bước 7
└── README.md
```

## 3. Database Schema (Prisma) — mở rộng

```prisma
model User {
  id            Int               @id @default(autoincrement())
  email         String            @unique
  password      String
  name          String?
  todos         Todo[]
  notes         Note[]
  pomodoros     PomodoroSession[]
  createdAt     DateTime          @default(now())
}

model Todo {
  id          Int      @id @default(autoincrement())
  title       String
  isCompleted Boolean  @default(false)
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Note {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PomodoroSession {
  id        Int       @id @default(autoincrement())
  userId    Int
  user      User      @relation(fields: [userId], references: [id])
  duration  Int        // tính bằng phút
  type      String     // "focus" | "break"
  startedAt DateTime
  endedAt   DateTime?
}

// Tuỳ chọn — nếu muốn lưu lịch sử chat với AI
model ChatMessage {
  id        Int      @id @default(autoincrement())
  userId    Int
  role      String   // "user" | "assistant"
  content   String
  createdAt DateTime @default(now())
}
```

> Lưu ý: `Todo` hiện tại chưa có `userId` — sẽ cần migration thêm cột này + gán giá trị mặc định (hoặc xoá dữ liệu test cũ) khi triển khai Bước 2 (Auth).

## 4. Luồng dữ liệu Chatbot AI

```
Frontend (Chat UI)
      │  POST /api/v1/chatbot/message
      ▼
Backend (chatbot.controller.js)
      │  forward message + userId
      ▼
n8n Webhook (workflow AI có sẵn)
      │  xử lý, trả kết quả
      ▼
Backend nhận response
      │  (tuỳ chọn: lưu vào ChatMessage)
      ▼
Frontend hiển thị câu trả lời
```

Backend không xử lý logic AI — chỉ đóng vai trò forward + (tuỳ chọn) lưu lịch sử. Toàn bộ logic AI/automation nằm ở workflow n8n bên ngoài.

## 5. Luồng Integrations (Plugin: mail, notification, alarm)

Mỗi provider trong `integrations/` implement chung 1 interface tối thiểu:

```js
// interface tham khảo, không bắt buộc dùng TypeScript
interface IntegrationProvider {
  send(payload): Promise<void>      // gửi mail / gửi notification
  schedule?(payload): Promise<void> // đặt báo thức / lịch hẹn (nếu có)
}
```

Nhờ vậy, khi thêm 1 loại tích hợp mới (ví dụ Telegram, Zalo notification), chỉ cần tạo thêm 1 provider mới tuân theo interface này, không cần sửa code ở các module khác gọi đến nó.

## 6. Nguyên tắc phân tách trách nhiệm (Separation of Concerns)

| Layer | Trách nhiệm | Không nên làm |
|---|---|---|
| Route | Định nghĩa endpoint, method, middleware | Chứa logic xử lý |
| Controller | Nhận req, validate, gọi service, format response | Gọi Prisma trực tiếp |
| Service | Logic nghiệp vụ, thao tác Prisma/DB, gọi external API | Biết về `req`/`res` |
| Middleware | Xử lý chung nhiều route (auth, error, validate) | Chứa logic riêng của 1 module |
