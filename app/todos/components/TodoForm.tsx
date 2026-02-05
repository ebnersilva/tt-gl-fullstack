'use client';

import { useState } from 'react';
import { createTodo } from '../services/todos.service';

export function TodoForm({ onCreated, }: { onCreated: (todo: { id: string; title: string; completed: boolean }) => void; }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Refact it to a hook
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (title.trim() === '') return;
    
    try {
      setLoading(true);

      await createTodo(title).then((newTodo) => {
        onCreated(newTodo);
        setTitle('');
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo"
        className="flex-grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add'}
      </button>
    </form>
  )
}

