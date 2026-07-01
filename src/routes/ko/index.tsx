import { createFileRoute } from '@tanstack/react-router';
import { Landing } from '../../layouts/home';
import { LocaleProvider } from '../../lib/locale';

export const Route = createFileRoute('/ko/')({
  component: Home,
});

function Home() {
  return (
    <LocaleProvider locale="ko">
      <Landing />
    </LocaleProvider>
  );
}
