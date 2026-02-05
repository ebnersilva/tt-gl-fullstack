'use client';

import { useLocale } from '../context/LocaleContext';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { useTasks } from './hooks/useTasks';

export default function TasksPage() {
  const { t, locale, setLocale } = useLocale();
  const { tasks, loading, error, loadTasks, handleCreated, handleToggle } = useTasks();

  if (loading) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <p className="text-gray-500" data-testid="loading-state">{t('tasks.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <p className="text-red-600" data-testid="error-state" role="alert">
          {error}
        </p>
        <button
          type="button"
          onClick={loadTasks}
          className="mt-2 text-blue-600 underline"
        >
          {t('tasks.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{t('taskManager')}</h1>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as 'en' | 'pt')}
          className="text-sm border rounded px-2 py-1"
          aria-label="Language"
        >
          <option value="en">EN</option>
          <option value="pt">PT</option>
        </select>
      </div>
      <TaskForm onCreated={handleCreated} />
      <TaskList tasks={tasks} onToggle={handleToggle} />
    </div>
  );
}
