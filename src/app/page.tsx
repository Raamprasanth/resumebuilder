import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative flex flex-col min-h-screen">
       <div
        className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
      ></div>
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">JobGenie</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/#about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up Free</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
              Your AI-Powered Career Co-Pilot
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              JobGenie helps you build the perfect resume, generate a personalized career roadmap, and find job recommendations tailored to you.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} JobGenie. All rights reserved.</p>
      </footer>
    </div>
  );
}
