// ============================================
// TODO ROUTES - Định nghĩa các endpoint API
// ============================================
// File này định nghĩa tất cả route cho Todo
// Mỗi route gọi controller tương ứng

const express = require('express');                  // Import Express
const router = express.Router();                     // Tạo router object
const todoController = require('../controllers/todoController'); // Import controller

// ============================================
// GET /api/todos - Lấy tất cả todo
// ============================================
// Ý nghĩa: Khi client gọi GET /api/todos, thực thi getAllTodos
// Route: GET /api/todos (vì route này sẽ được mount tại /api)
// Handler: todoController.getAllTodos
// Trả về: [{ id, title, completed, ... }, ...]
router.get('/', todoController.getAllTodos);

// ============================================
// POST /api/todos - Tạo todo mới
// ============================================
// Ý nghĩa: Khi client gọi POST /api/todos với body { title }, tạo todo
// Route: POST /api/todos
// Body: { "title": "Learn Node.js" }
// Handler: todoController.createTodo
// Trả về: { id, title, completed: false, ... }
router.post('/', todoController.createTodo);

// ============================================
// PUT /api/todos/:id - Cập nhật todo
// ============================================
// Ý nghĩa: Khi client gọi PUT /api/todos/1 với body, cập nhật todo id=1
// Route: PUT /api/todos/:id (:id = id từ URL)
// Body: { "title": "Learn React", "completed": true }
// Handler: todoController.updateTodo
// Trả về: { id: 1, title: 'Learn React', completed: true, ... }
router.put('/:id', todoController.updateTodo);

// ============================================
// DELETE /api/todos/:id - Xóa todo
// ============================================
// Ý nghĩa: Khi client gọi DELETE /api/todos/1, xóa todo id=1
// Route: DELETE /api/todos/:id
// Handler: todoController.deleteTodo
// Trả về: { message: 'Deleted successfully' }
router.delete('/:id', todoController.deleteTodo);

// ============================================
// EXPORT - Xuất router để dùng trong index.js
// ============================================
// Sẽ được import vào index.js như:
// app.use('/api/todos', todoRoutes);
// -> Tất cả route sẽ có prefix /api/todos
module.exports = router;
