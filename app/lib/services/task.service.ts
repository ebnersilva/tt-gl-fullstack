import * as store from '../taskStore';
import type { Task } from '../../types/task';
import type { CreateTaskInput, PatchTaskInput } from '../validator/task.validator';
import { API_ERROR_MESSAGE } from '../../constants/apiErrors';

export function list(): Task[] {
  return store.getAll();
}

export function create(input: CreateTaskInput): Task {
  return store.add(input);
}

export function updateById(
  id: string,
  input: PatchTaskInput
): { task: Task } | { status: 404; error: { message: string } } {
  const updated = store.update(id, input);
  if (!updated) {
    return { status: 404, error: { message: API_ERROR_MESSAGE.TASK_NOT_FOUND } };
  }
  return { task: updated };
}
