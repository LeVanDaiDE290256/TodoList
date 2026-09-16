// ============================================
// TODO MODEL - Tương tác database
// ============================================
// File này chứa tất cả function query database
// Dùng Prisma Client để thao tác bảng Todo
// Exported function được dùng bởi controller

const { PrismaClient } = require('@prisma/client');  // Import Prisma Client
const prisma = new PrismaClient();                   // Tạo instance Prisma

// ============================================
// getAllTodos - Lấy tất cả todo từ database
// ============================================
// Ý nghĩa: Query tất cả record từ bảng Todo
// Tham số: không có
// Trả về: array của todos
// Ví dụ: [
//   { id: 1, title: 'Learn Node.js', completed: false, createdAt: ..., updatedAt: ... },
//   { id: 2, title: 'Learn React', completed: false, createdAt: ..., updatedAt: ... }
// ]
const getAllTodos = async () => {
  return await prisma.todo.findMany();              // findMany(): query tất cả
};

// ============================================
// createTodo - Tạo todo mới
// ============================================
// Ý nghĩa: Thêm 1 record mới vào bảng Todo
// Tham số: title (string) - tiêu đề todo
// Trả về: object todo vừa tạo (có id, createdAt, updatedAt)
// Ví dụ: createTodo('Learn Express') 
//        -> { id: 3, title: 'Learn Express', completed: false, ... }
const createTodo = async (title) => {
  return await prisma.todo.create({                 // create(): tạo record mới
    data: { title }                                  // data: giá trị insert vào
                                                     // completed sẽ auto = false
                                                     // createdAt sẽ auto = now()
  });
};

// ============================================
// updateTodo - Cập nhật todo
// ============================================
// Ý nghĩa: Thay đổi title hoặc completed của 1 todo
// Tham số: 
//   id (number/string) - id của todo
//   data (object) - { title: string, completed: boolean }
// Trả về: object todo sau khi cập nhật
// Ví dụ: updateTodo(1, { completed: true })
//        -> { id: 1, title: 'Learn Node.js', completed: true, ... }
const updateTodo = async (id, data) => {
  return await prisma.todo.update({                 // update(): cập nhật record
    where: { id: parseInt(id) },                    // where: điều kiện tìm (id)
                                                     // parseInt(): chuyển string -> number
    data                                             // data: giá trị cập nhật
                                                     // updatedAt sẽ auto update
  });
};

// ============================================
// deleteTodo - Xóa todo
// ============================================
// Ý nghĩa: Xóa 1 record từ bảng Todo
// Tham số: id (number/string) - id của todo cần xóa
// Trả về: object todo vừa bị xóa
// Ví dụ: deleteTodo(1)
//        -> { id: 1, title: 'Learn Node.js', completed: false, ... }
//        (sau đó todo này không còn trong database)
const deleteTodo = async (id) => {
  return await prisma.todo.delete({                 // delete(): xóa record
    where: { id: parseInt(id) }                     // where: điều kiện tìm (id)
  });
};

// ============================================
// EXPORT - Xuất function để dùng trong controller
// ============================================
module.exports = {
  getAllTodos,                                       // Export hàm lấy tất cả
  createTodo,                                        // Export hàm tạo mới
  updateTodo,                                        // Export hàm cập nhật
  deleteTodo                                         // Export hàm xóa
};
