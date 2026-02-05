export type Todo = {
  id: string;
  title: string;
  completed: boolean;
}

// TODO: move this to a config file
const BASE_URL = "http://localhost:3000/api/todos";

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`Error fetching todos: ${response.statusText}`);
  }
  return response.json();
}

export async function createTodo(title: string): Promise<Todo> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error(`Error creating todo: ${response.statusText}`);
  }
  return response.json();
}

export async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error(`Error updating todo: ${response.statusText}`);
  }
  return response.json();
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error deleting todo: ${response.statusText}`);
  }
}