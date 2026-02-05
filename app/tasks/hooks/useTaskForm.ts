'use client';

import { useState, useCallback } from 'react';
import { getTranslatedError, useLocale } from '../../context/LocaleContext';
import { createTask } from '../services/tasks.service';
import type { Task } from '../../types/task';

export function useTaskForm(onCreated: (task: Task) => void) {
  const { t } = useLocale();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = title.trim();
      if (!trimmed) return;

      setError(null);
      try {
        setLoading(true);
        const task = await createTask(trimmed);
        onCreated(task);
        setTitle('');
      } catch (e) {
        const message = e instanceof Error ? e.message : '';
        setError(getTranslatedError(message, 'errors.createTask', t));
      } finally {
        setLoading(false);
      }
    },
    [title, onCreated, t]
  );

  return { title, setTitle, loading, error, handleSubmit };
}
