import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">JobGenie</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium hover:text-primary">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
          <Link href="/#about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Your AI-Powered Career Co-Pilot
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            JobGenie helps you build the perfect resume, generate a personalized career roadmap, and find job recommendations tailored to you.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
                <Link href="/signup">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} JobGenie. All rights reserved.</p>
      </footer>
    </div>
  );
}

    