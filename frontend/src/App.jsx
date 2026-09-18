// ============================================
// APP - Component chính của Todo App
// ============================================
// File này là component cha
// Chứa state todos, hàm add/update/delete todo
// Render giao diện Todo App

import { useState, useEffect } from 'react'
import { getTodos, createTodo, updateTodo, deleteTodo } from './api'
import './App.css'

function App() {
  // ============================================
  // STATE - Quản lý dữ liệu
  // ============================================
  // todos: danh sách todo từ backend
  // newTitle: input value của input field
  // loading: trạng thái đang fetch API
  // filter: filter hiện tại (all, active, completed)
  const [todos, setTodos] = useState([])          // State todos
  const [newTitle, setNewTitle] = useState('')    // State input value
  const [loading, setLoading] = useState(true)    // State loading
  const [filter, setFilter] = useState('all')     // State filter
  const [editingId, setEditingId] = useState(null)     // Todo đang edit (id)
  const [editTitle, setEditTitle] = useState('')       // Tiêu đề khi edit
  const [searchTerm, setSearchTerm] = useState('')

  // ============================================
  // useEffect - Gọi API khi component mount hoặc filter thay đổi
  // ============================================
  // Ý nghĩa: Khi App component render lần đầu hoặc filter thay đổi, gọi getTodos()
  // [filter] - dependency array chứa filter = chạy khi filter thay đổi
  useEffect(() => {
    loadTodos()
  }, [filter])

  // ============================================
  // loadTodos - Lấy danh sách todo từ backend
  // ============================================
  // Gọi API getTodos(filter), lưu kết quả vào state todos
  const loadTodos = async () => {
    try {
      setLoading(true)
      console.log('Filter:', filter)  // ← Thêm dòng này
      const data = await getTodos(filter)
      console.log('Data:', data)      // ← Và dòng này
      setTodos(data)
    } catch (error) {
      console.error('Error loading todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  )


  const handleEditStart = (todo) => {
    setEditingId(todo.id)
    setEditTitle(todo.title)
  }

  const handleEditSave = async (id) => {
    if (!editTitle.trim()) return

    try {
      await updateTodo(id, { title: editTitle })
      setTodos(todos.map(t => t.id === id ? { ...t, title: editTitle } : t))
      setEditingId(null)
      setEditTitle('')
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }
  const handleEditCancel = () => {
    setEditingId(null)
    setEditTitle('')
  }
  // ============================================
  // handleAddTodo - Thêm todo mới
  // ============================================
  // Khi click nút "Add", gọi API createTodo()
  const handleAddTodo = async () => {
    if (!newTitle.trim()) return                  // Nếu input rỗng, return

    try {
      const newTodo = await createTodo(newTitle)  // Gọi API tạo
      setTodos([...todos, newTodo])               // Thêm vào state
      setNewTitle('')                             // Reset input
    } catch (error) {
      console.error('Error creating todo:', error)
    }
  }

  // ============================================
  // handleToggleTodo - Cập nhật completed status
  // ============================================
  // Khi click checkbox, toggle completed = true/false
  const handleToggleTodo = async (todo) => {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed })
      setTodos(todos.map(t => t.id === todo.id ? updated : t))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  // ============================================
  // handleDeleteTodo - Xóa todo
  // ============================================
  // Khi click nút "Delete", xóa todo khỏi database
  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id)                        // Gọi API xóa
      setTodos(todos.filter(t => t.id !== id))   // Xóa khỏi state
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  // ============================================
  // handleClearCompleted - Xóa tất cả todo hoàn thành
  // ============================================
  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed)
    if (completedTodos.length === 0) return

    try {
      for (const todo of completedTodos) {
        await deleteTodo(todo.id)
      }
      setTodos(todos.filter(t => !t.completed))
    } catch (error) {
      console.error('Error clearing completed:', error)
    }
  }

  // ============================================
  // handleFilterChange - Thay đổi filter
  // ============================================
  // Khi user click nút filter, thay đổi state filter
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  // ============================================
  // RENDER - Hiển thị giao diện
  // ============================================
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>Todo App</h1>
        <p>Quản lý công việc hàng ngày</p>
      </header>

      {/* Main content */}
      <main className="container">
        {/* Input section */}
        <div className="input-section">
          <input
            type="text"
            placeholder="Nhập công việc mới..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <button onClick={handleAddTodo}> Thêm </button>
        </div>

        {/* Search section */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filter section */}
        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            Tất cả
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => handleFilterChange('active')}
          >
            Đang làm
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => handleFilterChange('completed')}
          >
            Hoàn thành
          </button>
        </div>

        {/* Loading indicator */}
        {loading && <p className="loading">Đang tải...</p>}

        {/* Todo list */}
        {!loading && (
          <div className="todo-list">
            {todos.length === 0 ? (
              <p className="empty">Không có công việc nào</p>
            ) : (
              <>
                {filteredTodos.map((todo) => (
                  <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo)}
                    />
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        className="edit-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEditSave(todo.id)}
                        onBlur={handleEditCancel}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleEditStart(todo)}>{todo.title}</span>
                    )}
                    <button
                      className="close-btn"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <p className="todo-counter">Còn lại: {todos.filter(t => !t.completed).length}</p>
                {todos.some(t => t.completed) && (
                  <button className="clear-btn" onClick={handleClearCompleted}>
                    Xóa hoàn thành
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
