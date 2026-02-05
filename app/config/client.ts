const DEFAULT_API_BASE_URL = 'http://localhost:3000';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export const clientConfig = {
  apiBaseUrl,
  get tasksApiPath() {
    return `${apiBaseUrl}/api/tasks`;
  },
} as const;
