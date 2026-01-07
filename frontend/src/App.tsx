import { useState, useEffect } from 'react';
import { Trash2, Plus, Check } from 'lucide-react';
import type { TodoType } from './types/todoType';

export default function TodoApp() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // fetchTodos();
    // For demo purposes, load from state
    const stored: TodoType[] = [
      { _id: 1, text: 'Build MERN backend', completed: true },
      { _id: 2, text: 'Connect to MongoDB', completed: false },
      { _id: 3, text: 'Style with Tailwind', completed: false },
    ];
    setTodos(stored);
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTodo.trim()) return;

    const todo = {
      _id: new Date().getHours() + new Date().getMinutes(),
      text: newTodo,
      completed: false,
      createdAt: new Date(),
    };

    // In production: const res = await fetch(API_URL, { method: 'POST', ... });
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = async (id: number) => {
    // In production: await fetch(`${API_URL}/${id}`, { method: 'PATCH', ... });
    setTodos(
      todos.map((todo) => (todo._id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const deleteTodo = async (id: number) => {
    // In production: await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">MERN Todo App</h1>
            <p className="text-blue-100 mt-1">Organize your tasks efficiently</p>
          </div>

          <div className="p-6  ">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo(e)}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addTodo}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          </div>

          <div className="flex border-y border-gray-300 bg-gray-50">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  filter === f
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="divide-y  divide-gray-300 max-h-96 overflow-y-auto">
            {filteredTodos.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <p className="text-lg">No todos yet!</p>
                <p className="text-sm mt-1">Add one above to get started</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo._id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                >
                  <button
                    onClick={() => toggleTodo(todo._id)}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {todo.completed && <Check size={16} className="text-white" />}
                  </button>

                  <span
                    className={`flex-1 transition-all ${
                      todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="shrink-0 p-2 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600">
            <span className="font-medium">{activeCount}</span>{' '}
            {activeCount === 1 ? 'item' : 'items'} left
          </div>
        </div>
      </div>
    </div>
  );
}
