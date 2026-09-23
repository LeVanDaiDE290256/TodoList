# Coding Convention — Todolist App

Tài liệu này quy định convention áp dụng thống nhất cho toàn bộ project, từ module hiện tại (Todo) đến các module mở rộng sau này (Pomodoro, Notes, Chatbot, Auth, Integrations).

## 1. Naming file (Backend)
Mỗi module trong `backend/src/modules/<tên-module>/` gồm tối đa các file sau, đặt tên thống nhất:

| File | Vai trò |
|---|---|
| `<module>.routes.js` | Định nghĩa endpoint, gắn middleware, gọi controller |
| `<module>.controller.js` | Nhận request, validate cơ bản, gọi service, trả response |
| `<module>.service.js` | Chứa logic nghiệp vụ, gọi Prisma/DB |

Ví dụ: `todo.routes.js`, `todo.controller.js`, `todo.service.js`.

**Không** viết logic Prisma trực tiếp trong controller — luôn đi qua service. Điều này giúp:
- Controller dễ đọc, chỉ lo việc HTTP (nhận/trả dữ liệu).
- Service có thể tái sử dụng hoặc test độc lập không cần mock request/response.

## 2. Cấu trúc response API chuẩn
Toàn bộ API trả về theo 1 trong 2 format sau:

**Thành công:**
```json
{
  "success": true,
  "data": { },
  "message": ""
}
```

**Thất bại:**
```json
{
  "success": false,
  "error": {
    "code": "TODO_NOT_FOUND",
    "message": "Không tìm thấy công việc này"
  }
}
```

Dùng 1 helper dùng chung, ví dụ `utils/apiResponse.js`:
```js
export const success = (res, data, message = "") =>
  res.json({ success: true, data, message });

export const fail = (res, status, code, message) =>
  res.status(status).json({ success: false, error: { code, message } });
```

## 3. Error handling tập trung
- Controller không tự viết `try/catch` lặp lại nhiều lần cho từng lỗi cụ thể — throw lỗi (hoặc gọi `next(err)`), để middleware `errorHandler.js` xử lý tập trung.
- Định nghĩa 1 class `AppError` (hoặc tương tự) có `statusCode`, `code`, `message` để throw lỗi có cấu trúc rõ ràng.

## 4. Route versioning & naming
- Toàn bộ route bắt đầu bằng `/api/v1/`.
- Đặt tên resource theo danh từ số nhiều: `/api/v1/todos`, `/api/v1/notes`, `/api/v1/pomodoro-sessions`.
- Method chuẩn REST:
  - `GET /api/v1/todos` — danh sách
  - `GET /api/v1/todos/:id` — chi tiết
  - `POST /api/v1/todos` — tạo mới
  - `PUT /api/v1/todos/:id` — cập nhật toàn bộ
  - `PATCH /api/v1/todos/:id` — cập nhật một phần
  - `DELETE /api/v1/todos/:id` — xoá

## 5. Environment variables
- Có file `.env.example` liệt kê tất cả biến cần thiết (không chứa giá trị thật).
- `.env` thật **không** commit (đảm bảo có trong `.gitignore`).
- Biến đặt tên UPPER_SNAKE_CASE: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `N8N_WEBHOOK_URL`.

## 6. Naming convention chung (Backend + Frontend)
- Biến, hàm: `camelCase`.
- Class, Component React: `PascalCase`.
- File component React: `PascalCase.jsx` (ví dụ `TodoList.jsx`).
- File thường (service, util, hook không phải component): `camelCase.js` (ví dụ `useAuth.js`, `todoApi.js`).
- Hằng số cấu hình: `UPPER_SNAKE_CASE`.
- Tên bảng/model Prisma: `PascalCase` số ít (`User`, `Todo`, `Note`) — Prisma tự map ra bảng.

## 7. Frontend structure convention
- Mỗi feature nằm trong `src/features/<tên-feature>/`, gồm component, hook, và style riêng của feature đó nếu cần.
- Gọi API tập trung qua `src/api/<module>.api.js` — component không gọi `fetch`/`axios` trực tiếp.
- State toàn cục (auth, theme...) dùng Context API trong `src/context/`; state cục bộ của từng feature giữ trong chính feature đó.

## 8. Git convention
- Nhánh: `feature/<tên-module>` (ví dụ `feature/pomodoro`), `fix/<mô-tả-ngắn>`.
- Commit theo Conventional Commits:
  - `feat: thêm module notes`
  - `fix: sửa lỗi validate todo`
  - `refactor: tách controller/service cho todo`
  - `chore: cập nhật docs`
- Mỗi commit nên gói gọn 1 thay đổi rõ ràng, dễ review.

## 9. Validate dữ liệu đầu vào
- Dùng 1 thư viện validate (khuyến nghị `zod` hoặc `express-validator`) áp dụng nhất quán cho toàn bộ module, đặt schema validate cùng thư mục module (`<module>.validation.js`).
- Không validate rải rác bằng `if` thủ công trong controller khi số lượng field tăng lên.

## 10. Database (Prisma) convention
- Mọi migration đặt tên mô tả rõ thay đổi: `add_user_model`, `add_note_userId_relation`.
- Model có `userId` khi thuộc sở hữu của user (Todo, Note, PomodoroSession...).
- Luôn có `createdAt` (và `updatedAt` nếu có thể sửa) cho các model chính.
