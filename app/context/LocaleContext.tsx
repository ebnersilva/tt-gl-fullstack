'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import en from '../locales/en.json';
import pt from '../locales/pt.json';

export type Locale = 'en' | 'pt';

const messages: Record<Locale, Record<string, unknown>> = { en, pt };

function getByPath(obj: Record<string, unknown>, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((acc, part) => {
    if (acc !== null && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : undefined;
}

function interpolate(text: string, params: Record<string, string>): string {
  return Object.entries(params).reduce(
    (acc, [key, val]) => acc.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val),
    text
  );
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = 'task-manager-locale';

type LocaleProviderProps = {
  children: ReactNode;
  initialLocale?: Locale;
};

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? 'en');

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string>) => {
      const text = getByPath(messages[locale] as Record<string, unknown>, key);
      const str = text ?? key;
      return params ? interpolate(str, params) : str;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

export const API_MESSAGE_TO_KEY: Record<string, string> = {
  'Task not found': 'api.TASK_NOT_FOUND',
  'Validation failed': 'api.VALIDATION_FAILED',
  'Internal server error': 'api.INTERNAL_SERVER_ERROR',
};

export function useTranslatedApiError(message: string): string {
  const { t } = useLocale();
  const key = API_MESSAGE_TO_KEY[message];
  return key ? t(key) : message;
}

export function getTranslatedError(
  message: string,
  fallbackKey: string,
  t: (key: string) => string
): string {
  const key = API_MESSAGE_TO_KEY[message];
  return key ? t(key) : t(fallbackKey);
}
