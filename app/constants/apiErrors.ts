export const API_ERROR_MESSAGE = {
  TASK_NOT_FOUND: 'Task not found',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_SERVER_ERROR: 'Internal server error',
} as const;

export type ApiErrorCode = keyof typeof API_ERROR_MESSAGE;
