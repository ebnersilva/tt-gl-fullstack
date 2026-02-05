'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTranslatedError, useLocale } from '../../context/LocaleContext';
import { fetchTasks, updateTask } from '../services/tasks.service';
import type { Task } from '../../types/task';

export function useTasks() {
  const { t } = useLocale();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '';
      setError(getTranslatedError(message, 'errors.loadTasks', t));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreated = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const handleToggle = useCallback(async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextCompleted = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );
    try {
      await updateTask(id, { completed: nextCompleted });
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: task.completed } : t))
      );
      setError(t('errors.updateTask'));
    }
  }, [tasks, t]);

  return { tasks, loading, error, loadTasks, handleCreated, handleToggle };
}
