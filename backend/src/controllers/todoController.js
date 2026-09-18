// ============================================
// TODO CONTROLLER - Xử lý request và response
// ============================================
// File này là layer giữa routes và model
// Nhận request từ routes, gọi model, trả response về client
// Xử lý try-catch để bắt lỗi

const todoModel = require('../models/todoModel');    // Import hàm query từ model

// ============================================
// getAllTodos - GET /todos
// ============================================
// Ý nghĩa: Xử lý request lấy tất cả todo
// Tham số:
//   req: request object (chứa body, params, query)
//   res: response object (dùng để trả dữ liệu về client)
// Flow:
//   1. Gọi todoModel.getAllTodos() để query database
//   2. Trả về JSON array of todos
//   3. Nếu có lỗi, catch và trả error 500
// HTTP Response:
//   200 OK - [{ id: 1, title: 'Learn', completed: false, ... }, ...]
//   500 Error - { error: 'message' }
const getAllTodos = async (req, res) => {
  try {
    const filter = req.query.filter;
    const todos = await todoModel.getAllTodos(filter);   // Gọi model lấy data
    res.json(todos);                                // Trả về JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Lỗi -> status 500
  }
};

// ============================================
// createTodo - POST /todos
// ============================================
// Ý nghĩa: Xử lý request tạo todo mới
// Tham số:
//   req.body: { title: 'Learn Node.js' }
//   res: response object
// Flow:
//   1. Lấy title từ req.body
//   2. Gọi todoModel.createTodo(title) để insert vào database
//   3. Trả về JSON todo vừa tạo (có id, createdAt, ...)
//   4. Nếu có lỗi, catch và trả error 500
// HTTP Request:
//   POST /todos
//   Body: { "title": "Learn Express" }
// HTTP Response:
//   200 OK - { id: 3, title: 'Learn Express', completed: false, ... }
//   500 Error - { error: 'message' }
const createTodo = async (req, res) => {
  try {
    const { title } = req.body;                      // Lấy title từ body
    const todo = await todoModel.createTodo(title); // Gọi model tạo todo
    res.json(todo);                                  // Trả về todo vừa tạo
  } catch (error) {
    res.status(500).json({ error: error.message }); // Lỗi -> status 500
  }
};

// ============================================
// updateTodo - PUT /todos/:id
// ============================================
// Ý nghĩa: Xử lý request cập nhật todo
// Tham số:
//   req.params: { id: '1' } - id từ URL
//   req.body: { title: 'Learn React', completed: true }
//   res: response object
// Flow:
//   1. Lấy id từ req.params (URL)
//   2. Lấy title, completed từ req.body
//   3. Gọi todoModel.updateTodo(id, { title, completed })
//   4. Trả về JSON todo sau khi cập nhật
//   5. Nếu có lỗi, catch và trả error 500
// HTTP Request:
//   PUT /todos/1
//   Body: { "title": "Learn React", "completed": true }
// HTTP Response:
//   200 OK - { id: 1, title: 'Learn React', completed: true, ... }
//   500 Error - { error: 'message' }
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;                       // Lấy id từ URL
    const { title, completed } = req.body;          // Lấy title, completed từ body
    const todo = await todoModel.updateTodo(id, { title, completed }); // Gọi model update
    res.json(todo);                                  // Trả về todo sau update
  } catch (error) {
    res.status(500).json({ error: error.message }); // Lỗi -> status 500
  }
};

// ============================================
// deleteTodo - DELETE /todos/:id
// ============================================
// Ý nghĩa: Xử lý request xóa todo
// Tham số:
//   req.params: { id: '1' } - id từ URL
//   res: response object
// Flow:
//   1. Lấy id từ req.params (URL)
//   2. Gọi todoModel.deleteTodo(id) để xóa từ database
//   3. Trả về message thành công
//   4. Nếu có lỗi, catch và trả error 500
// HTTP Request:
//   DELETE /todos/1
// HTTP Response:
//   200 OK - { message: 'Deleted successfully' }
//   500 Error - { error: 'message' }
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;                       // Lấy id từ URL
    await todoModel.deleteTodo(id);                  // Gọi model xóa
    res.json({ message: 'Deleted successfully' });  // Trả về message
  } catch (error) {
    res.status(500).json({ error: error.message }); // Lỗi -> status 500
  }
};

// ============================================
// EXPORT - Xuất function để dùng trong routes
// ============================================
module.exports = {
  getAllTodos,    // Export handler GET /todos
  createTodo,     // Export handler POST /todos
  updateTodo,     // Export handler PUT /todos/:id
  deleteTodo      // Export handler DELETE /todos/:id
};
