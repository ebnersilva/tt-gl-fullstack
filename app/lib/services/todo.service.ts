import {
  addRequestTodo,
  deleteRequestTodo,
  getRequestTodos,
  updateRequestTodo
} from '../memoryStore';

import {
  CreateTodoInput,
  UpdateTodoInput
} from '../validator/todo.validator';

export function create(input: CreateTodoInput) {
  addRequestTodo({ method: 'POST', body: input });
}

export function update(input: UpdateTodoInput) {
  const todos = getRequestTodos();
  const index = todos.findIndex((todo) => todo.id === input.id);

  console.log(todos)

  console.log('Updating todo with ID:', input.id, 'at index:', index);

  if (index === -1) {
    return {
      status: 404,
      errorCode: 'TODO_NOT_FOUND',
      error: 'Todo not found'
    }
  }
  

  updateRequestTodo(index, { method: 'PUT', body: input });
}

export function remove(id: string) {
  const todos = getRequestTodos();
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return {
      status: 404,
      errorCode: 'TODO_NOT_FOUND',
      error: 'Todo not found'
    }
  }

  deleteRequestTodo(index);
}

export function list() {
  return getRequestTodos();
}