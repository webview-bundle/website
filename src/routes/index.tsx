import { createFileRoute } from '@tanstack/react-router';
import { LandingC } from '../layouts/home/LandingC';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return <LandingC />;
}
