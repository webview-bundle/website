import { Landing } from '@/components/home';
import { i18n } from '@/lib/i18n';

// Landing page. Locale comes from the `[lang]` segment and is provided to the
// tree by `LocaleProvider` in the layout, so `<Landing>` reads it via `useLocale`.
export default function Home() {
  return <Landing />;
}

export function generateStaticParams() {
  return i18n.languages.map(lang => ({ lang }));
}
