import { createFileRoute } from '@tanstack/react-router';
import { Landing } from '../layouts/home';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return <Landing />;
}
