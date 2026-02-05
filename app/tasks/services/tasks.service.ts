import { clientConfig } from '../../config/client';
import type { Task } from '../../types/task';

const base = clientConfig.tasksApiPath;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message =
      (data?.error?.message as string) || response.statusText;
    throw new Error(message);
  }
  return response.json();
}

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(base);
  return handleResponse<Task[]>(response);
}

export async function createTask(title: string): Promise<Task> {
  const response = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.trim() }),
  });
  return handleResponse<Task>(response);
}

export async function updateTask(
  id: string,
  updates: Partial<Pick<Task, 'title' | 'completed'>>
): Promise<Task> {
  const response = await fetch(`${base}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse<Task>(response);
}
