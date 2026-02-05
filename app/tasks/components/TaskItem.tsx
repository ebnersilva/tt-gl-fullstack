'use client';

import { useLocale } from '../../context/LocaleContext';
import type { Task } from '../../types/task';

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
};

export function TaskItem({ task, onToggle }: TaskItemProps) {
  const { t } = useLocale();
  const ariaLabel = task.completed
    ? t('task.markIncomplete', { title: task.title })
    : t('task.markComplete', { title: task.title });

  return (
    <li className="flex items-center gap-2 py-2 border-b border-gray-200 last:border-0">
      <input
        type="checkbox"
        id={`task-${task.id}`}
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={ariaLabel}
        className="rounded"
      />
      <label
        htmlFor={`task-${task.id}`}
        className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
      >
        {task.title}
      </label>
    </li>
  );
}
