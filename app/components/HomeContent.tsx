'use client';

import Link from 'next/link';
import { useLocale } from '../context/LocaleContext';

export function HomeContent() {
  const { t, locale, setLocale } = useLocale();

  return (
    <main className="flex flex-col items-center gap-6 p-8">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          {t('taskManager')}
        </h1>
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
      <Link
        href="/tasks"
        className="rounded-full bg-foreground px-5 py-3 text-background transition-colors hover:opacity-90"
      >
        {t('goToTasks')}
      </Link>
    </main>
  );
}
