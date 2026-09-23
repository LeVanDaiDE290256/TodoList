# Roadmap — Todolist App (Personal Learning Platform)

## Mục tiêu
Mở rộng project Todolist CRUD hiện tại thành một nền tảng hỗ trợ học tập & làm việc cá nhân, học đúng convention/structure chuẩn theo từng bước, đủ hiểu trước khi làm bước tiếp theo.

## Tech stack
- **Backend**: Node.js + Express, Prisma ORM
- **Frontend**: React (Vite)
- **Database**: PostgreSQL
- **Containerization**: Docker (áp dụng sau khi đã quen các API cốt lõi)
- **Deploy**: quyết định sau

## Trạng thái hiện tại
- Đã hoàn thành CRUD Todo cơ bản với cấu trúc phẳng (`controllers/`, `models/`, `routes/` ở backend; `src/` đơn giản ở frontend).
- Chưa có: auth, các module mở rộng, tích hợp bên ngoài.

## Phạm vi mở rộng (Scope)
1. **Pomodoro** — module hẹn giờ học tập theo phương pháp Pomodoro.
2. **Notes** — module ghi chú CRUD.
3. **Chatbot AI** — giao diện chat kiểu Gemini/ChatGPT, backend đóng vai trò proxy gọi workflow n8n có sẵn.
4. **Auth (Login)** — JWT access + refresh token, gắn dữ liệu với user.
5. **Integrations (Plugin)** — mail, thông báo mạng xã hội, báo thức/alarm, API bên ngoài khác.
6. **Docker hoá** — khi đã quen các API.

## Lý do đổi cấu trúc sang "module-based"
Cấu trúc cũ (`controllers/models/routes` dùng chung) phù hợp khi chỉ có 1 tính năng (Todo). Khi số lượng module tăng lên 6-7, gom chung sẽ khiến các file cùng tên chức năng khác nhau lẫn lộn trong 1 thư mục, khó bảo trì. Chuyển sang cấu trúc theo module (mỗi module có controller/service/route riêng trong thư mục của nó) giúp:
- Dễ định vị code liên quan đến 1 tính năng.
- Dễ thêm/bớt module mà không ảnh hưởng module khác.
- Chuẩn bị sẵn cho việc tách microservice sau này nếu cần (không bắt buộc, nhưng convention này phổ biến ở dự án Node vừa và lớn).

---

## Lộ trình thực hiện từng bước

### Bước 1 — Refactor cấu trúc hiện tại sang `modules/`
- Chuyển `todoController.js`, `todoModel.js`, `todoRoutes.js` vào `backend/src/modules/todo/`.
- Tách logic nghiệp vụ ra `todo.service.js` (Controller chỉ nhận request, gọi service, trả response — không viết trực tiếp logic Prisma trong controller).
- Thêm `app.js` để setup Express + mount route, `index.js` chỉ còn nhiệm vụ listen server.
- Thêm middleware `errorHandler.js` xử lý lỗi tập trung.
- Thêm helper `apiResponse.js` để chuẩn hoá format response.
- **Mục tiêu học được**: tách biệt Controller – Service – Route, error handling tập trung, response format nhất quán.

### Bước 2 — Auth module (JWT)
- Thêm model `User` vào Prisma schema, migrate.
- Xây API: đăng ký, đăng nhập, refresh token, middleware xác thực (`authMiddleware.js`).
- Gắn `userId` vào Todo (và các module sau này) để dữ liệu thuộc về từng user.
- Frontend: trang login/register, lưu token (khuyến nghị: access token trong memory/state, refresh token trong httpOnly cookie), `AuthContext` để quản lý trạng thái đăng nhập, route bảo vệ (Protected Route).
- **Mục tiêu học được**: JWT flow, middleware xác thực, bảo vệ route ở cả backend và frontend.

### Bước 3 — Notes module
- CRUD notes, áp dụng lại đúng pattern vừa học (Controller – Service – Route) từ Todo/Auth.
- Model `Note` gắn với `userId`.
- Frontend: trang danh sách note, tạo/sửa/xoá.
- **Mục tiêu học được**: củng cố pattern module, tự tin lặp lại mà không cần hướng dẫn chi tiết từng dòng.

### Bước 4 — Pomodoro module
- Backend: model `PomodoroSession` (lưu lịch sử phiên học — thời lượng, loại focus/break, thời gian bắt đầu/kết thúc).
- Timer countdown chạy chủ yếu ở frontend (state + `setInterval`/`useEffect`); backend chỉ nhận log khi phiên kết thúc.
- **Mục tiêu học được**: xử lý state phức tạp hơn ở frontend (timer, trạng thái chạy/tạm dừng), thiết kế API dạng "ghi log" thay vì CRUD thuần.

### Bước 5 — Chatbot AI module
- Backend: 1 endpoint proxy nhận tin nhắn từ frontend, gọi webhook n8n có sẵn, trả kết quả về.
- Không lưu logic AI trong backend — chỉ forward request/response (giữ đơn giản, dễ bảo trì).
- Frontend: giao diện chat (danh sách tin nhắn, ô nhập, hiệu ứng đang gõ) theo kiểu ChatGPT/Gemini.
- Cân nhắc lưu lịch sử chat vào DB (model `ChatMessage`) nếu muốn giữ lịch sử qua các phiên.
- **Mục tiêu học được**: thiết kế API dạng proxy/gateway, xử lý bất đồng bộ với external service, UI chat thời gian thực (có thể nâng cấp lên streaming/WebSocket sau).

### Bước 6 — Integrations (Plugin: mail, notification, alarm)
- Thiết kế theo pattern **adapter**: mỗi loại tích hợp (mail, social notification, alarm) là 1 "provider" độc lập tuân theo 1 interface chung, dễ thêm bớt.
- Ví dụ cấu trúc: `integrations/mail/`, `integrations/notifications/`, `integrations/alarm/`, mỗi thư mục có `*.provider.js` implement chung 1 interface (`send()`, `schedule()`, v.v.).
- Đây là phần phụ thuộc nhiều vào API/service bên ngoài (SMTP, social API, hệ thống báo thức) — làm sau cùng vì độ phức tạp cao nhất.
- **Mục tiêu học được**: pattern adapter/provider, làm việc với API bên thứ ba, xử lý lỗi/timeout khi gọi service ngoài.

### Bước 7 — Docker hoá
- Viết `Dockerfile` cho backend và frontend riêng.
- `docker-compose.yml` gộp backend, frontend, PostgreSQL.
- **Mục tiêu học được**: containerize ứng dụng multi-service, biến môi trường (`.env`) trong Docker.

### Bước 8 — Deploy
- Quyết định nền tảng deploy sau khi hoàn thiện chức năng (chưa nằm trong scope hiện tại).

---

## Nguyên tắc làm việc xuyên suốt
- Mỗi bước hoàn thành, hiểu rõ rồi mới chuyển bước tiếp theo (theo đúng cách làm việc đã thống nhất — từng bước có giải thích trước khi thực hiện).
- Mỗi module mới nên tuân theo đúng pattern đã thiết lập ở Bước 1 để giữ tính nhất quán toàn dự án.
- Cập nhật `CONVENTION.md` và `ARCHITECTURE.md` nếu có thay đổi lớn về cấu trúc trong quá trình phát triển.
