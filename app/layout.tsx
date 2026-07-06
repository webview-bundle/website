import './global.css';
import type { ReactNode } from 'react';

// The real document (`<html>`/`<body>` + providers) lives in `app/[lang]/layout.tsx`,
// which every request reaches via the i18n middleware. This root only exists to
// satisfy Next's "a root layout is required" rule and to load global styles.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
