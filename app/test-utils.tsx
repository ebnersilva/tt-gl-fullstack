import { type ReactElement, type ReactNode } from 'react';
import { LocaleProvider } from './context/LocaleContext';

export function AllTheProviders({ children }: { children: ReactNode }): ReactElement {
  return <LocaleProvider initialLocale="en">{children}</LocaleProvider>;
}
