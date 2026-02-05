'use client';

import { useLocale } from '../../context/LocaleContext';
import { useTaskForm } from '../hooks/useTaskForm';
import type { Task } from '../../types/task';

type TaskFormProps = {
  onCreated: (task: Task) => void;
};

export function TaskForm({ onCreated }: TaskFormProps) {
  const { t } = useLocale();
  const { title, setTitle, loading, error, handleSubmit } = useTaskForm(onCreated);

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
      <div className="flex">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('form.placeholder')}
          className="flex-grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          aria-label={t('form.taskTitle')}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? t('form.adding') : t('form.add')}
        </button>
      </div>
      {error && (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
