import { createFileRoute } from '@tanstack/react-router';
import { HomeLayout } from '../layouts/home';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <HomeLayout>
      <h1 className="prose">Hello World</h1>
    </HomeLayout>
  );
}
