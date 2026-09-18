// ============================================
// API - Gọi Backend API
// ============================================
// File này chứa tất cả function gọi API backend
// Dùng Axios để fetch data từ http://localhost:3000
// Các component import từ file này để gọi API

import axios from 'axios';

// ============================================
// API_URL - Base URL của backend
// ============================================
// Nơi backend server chạy
// Format: http://HOST:PORT/ENDPOINT
const API_URL = 'http://localhost:3000/api/todos';

// ============================================
// getTodos - Lấy tất cả todo
// ============================================
// Gọi API GET /api/todos để lấy danh sách todo
// Tham số: filter (string) - 'all', 'active', hoặc 'completed'
// Trả về: array của todos
export const getTodos = async (filter = 'all') => {
  const url = filter === 'all' ? API_URL : `${API_URL}?filter=${filter}`;
  const response = await axios.get(url);
  return response.data;
};

// ============================================
// createTodo - Tạo todo mới
// ============================================
// Gọi API POST /api/todos để tạo todo mới
// Tham số: title (string) - tiêu đề todo
// Trả về: object todo vừa tạo
export const createTodo = async (title) => {
  const response = await axios.post(API_URL, { title });
  return response.data;
};

// ============================================
// updateTodo - Cập nhật todo
// ============================================
// Gọi API PUT /api/todos/:id để cập nhật todo
// Tham số: id, data { title, completed }
// Trả về: object todo sau khi cập nhật
export const updateTodo = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// ============================================
// deleteTodo - Xóa todo
// ============================================
// Gọi API DELETE /api/todos/:id để xóa todo
// Tham số: id (number/string) - id của todo cần xóa
// Trả về: response từ backend
export const deleteTodo = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
