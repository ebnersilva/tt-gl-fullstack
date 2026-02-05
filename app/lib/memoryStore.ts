export type Todo = {
  id: string;
  title: string;
}

const todos: Todo[] = [];

export function getRequestTodos(): Todo[] {
  return todos;
}

export function addRequestTodo(request: { method: string; body: Omit<Todo, 'id'>; }): void {
  const newTodo: Todo = {
    id: (todos.length + 1).toString(),
    title: request.body.title,
  };
  todos.push(newTodo);
}

export function updateRequestTodo(index: number, request: { method: string; body: Omit<Todo, 'id'>; }): void {
  if (index >= 0 && index < todos.length) {
    todos[index].title = request.body.title;
  }
}

export function deleteRequestTodo(index: number): void {
  if (index >= 0 && index < todos.length) {
    todos.splice(index, 1);
  }
}