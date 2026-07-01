import { createFileRoute } from '@tanstack/react-router';
import { Landing } from '../layouts/home';
import { LocaleProvider } from '../lib/locale';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <LocaleProvider locale="en">
      <Landing />
    </LocaleProvider>
  );
}
