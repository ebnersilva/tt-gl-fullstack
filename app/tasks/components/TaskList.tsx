'use client';

import { useLocale } from '../../context/LocaleContext';
import { TaskItem } from './TaskItem';
import type { Task } from '../../types/task';

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
};

export function TaskList({ tasks, onToggle }: TaskListProps) {
  const { t } = useLocale();

  if (tasks.length === 0) {
    return (
      <p className="text-gray-500 py-4" data-testid="empty-state">
        {t('tasks.empty')}
      </p>
    );
  }

  return (
    <ul className="list-none p-0" aria-label="Task list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} />
      ))}
    </ul>
  );
}
