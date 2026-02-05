import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
});

export const patchTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').optional(),
  completed: z.boolean().optional(),
}).refine(
  (data) => data.title !== undefined || data.completed !== undefined,
  { message: 'At least one of title or completed must be provided' }
);

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type PatchTaskInput = z.infer<typeof patchTaskSchema>;
