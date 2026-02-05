import { z } from 'zod';

export const createTodoScheme = z.object({
  title: z.string().min(1, 'Title is required'),
});

export const updateTodoScheme = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoScheme>;
export type UpdateTodoInput = z.infer<typeof updateTodoScheme>;