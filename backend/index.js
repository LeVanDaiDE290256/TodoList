// ============================================
// IMPORTS - Các thư viện cần thiết
// ============================================
const express = require('express');        // Express: framework web cho Node.js
                                           // Dùng để: tạo server, định nghĩa route, xử lý middleware
const cors = require('cors');              // CORS: cho phép frontend (domain khác) gọi API
                                           // Dùng để: xử lý cross-origin request từ frontend
require('dotenv').config();                // Dotenv: đọc file .env để lấy biến môi trường
                                           // Dùng để: lấy PORT, DATABASE_URL từ .env (bảo mật)

// ============================================
// APP SETUP - Cấu hình ứng dụng Express
// ============================================
const app = express();                     // Tạo instance Express (object app)
                                           // Dùng để: định nghĩa tất cả route và middleware
const PORT = process.env.PORT || 3000;     // Đọc PORT từ .env, nếu không có thì dùng 3000
                                           // Dùng để: xác định port server sẽ chạy

// ============================================
// MIDDLEWARE - Xử lý request trước khi đến route
// ============================================
app.use(cors());                           // Middleware CORS: cho phép frontend gọi API
                                           // Dùng để: cho phép request từ domain khác (ví dụ: localhost:5173)
app.use(express.json());                   // Middleware JSON: parse body request thành object JavaScript
                                           // Dùng để: chuyển JSON body thành dạng dùng được trong code
                                           // Ví dụ: {"title": "Learn"} -> req.body.title = "Learn"

// ============================================
// IMPORT ROUTES - Import routes từ src/
// ============================================
const todoRoutes = require('./src/routes/todoRoutes'); // Import todo routes

// ============================================
// ROUTES - Định nghĩa các endpoint API
// ============================================
app.get('/', (req, res) => {               // Route GET /: endpoint test
  res.send('Todo API is running');         // Trả về text đơn giản
});

// Mount todo routes tại /api/todos
// Tất cả route trong todoRoutes sẽ có prefix /api/todos
// Ví dụ:
//   GET /api/todos -> todoRoutes GET '/'
//   POST /api/todos -> todoRoutes POST '/'
//   PUT /api/todos/:id -> todoRoutes PUT '/:id'
//   DELETE /api/todos/:id -> todoRoutes DELETE '/:id'
app.use('/api/todos', todoRoutes);

// ============================================
// SERVER START - Khởi chạy server
// ============================================
app.listen(PORT, () => {                   // Lắng nghe port và start server
  console.log(`Server running on port ${PORT}`);  // In ra console để xác nhận
                                           // Nếu thấy "Server running on port 3000"
                                           // -> server chạy thành công
});
