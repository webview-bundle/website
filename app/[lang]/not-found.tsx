import { NotFound } from '@/components/NotFound';

// Rendered for `notFound()` and unmatched paths under `[lang]`, inside the locale
// layout (so the providers/theme are present). `<NotFound>` infers the locale
// from the pathname to localize its copy and links.
export default function NotFoundPage() {
  return <NotFound />;
}
