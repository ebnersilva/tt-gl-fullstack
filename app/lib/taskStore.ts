import { randomUUID } from 'node:crypto';
import type { Task } from '../types/task';

const tasks: Task[] = [];

export function getAll(): Task[] {
  return tasks;
}

export function add(input: { title: string }): Task {
  const task: Task = {
    id: randomUUID(),
    title: input.title.trim(),
    completed: false,
  };
  tasks.push(task);
  return task;
}

export function update(
  id: string,
  updates: Partial<Pick<Task, 'title' | 'completed'>>
): Task | null {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const current = tasks[index];
  if (updates.title !== undefined) current.title = updates.title.trim();
  if (updates.completed !== undefined) current.completed = updates.completed;
  return current;
}
