import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setTodos(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      <ul className="list-disc pl-5">
        {todos.map((todo) => (
          <li key={todo.id} className="mb-2">
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
