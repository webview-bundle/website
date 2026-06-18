import { CallToAction } from './components/CallToAction';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Platforms } from './components/Platforms';
import { Showcase } from './components/Showcase';

export function Landing() {
  return (
    <div className="min-h-dvh bg-white font-sans text-zinc-900 antialiased dark:bg-[#09090a] dark:text-zinc-100">
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <Features />
        <Platforms />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
