import { Button } from '@/components/ui/button';
import {
  Briefcase,
  MapPin,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';

const popularVacancies = [
  { title: 'Anesthesiologists', openings: 45904, domain: 'Medical' },
  { title: 'Surgeons', openings: 50364, domain: 'Medical' },
  { title: 'Obstetricians-Gynecologists', openings: 4339, domain: 'Medical' },
  { title: 'Orthodontists', openings: 20079, domain: 'Medical' },
  { title: 'Maxillofacial Surgeons', openings: 74875, domain: 'Medical' },
  { title: 'Software Developer', openings: 43359, domain: 'Tech' },
  { title: 'Psychiatrists', openings: 18599, domain: 'Medical' },
  { title: 'Data Scientist', openings: 28200, featured: true, domain: 'Tech' },
  { title: 'Financial Manager', openings: 61391, domain: 'Finance' },
  { title: 'Management Analysis', openings: 93046, domain: 'Business' },
  { title: 'IT Manager', openings: 50963, domain: 'Tech' },
  { title: 'Operations Research Analysis', openings: 16627, domain: 'Business' },
];

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Main Header */}
      <header className="sticky top-0 bg-background/50 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl">
                JobGenie
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Find a job that suits your interests & skills.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Find the perfect job for you, with a personalized search and
                AI-powered recommendations to guide your career.
              </p>
              <div className="mt-10 p-2 bg-card shadow-lg rounded-lg border">
                <form className="grid sm:grid-cols-3 gap-2">
                  <div className="relative sm:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Job title, Keyword..."
                      className="pl-10 h-12 bg-card border-none focus-visible:ring-0"
                    />
                  </div>
                  <div className="relative sm:col-span-1 border-l">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Your Location"
                      className="pl-10 h-12 bg-card border-none focus-visible:ring-0"
                    />
                  </div>
                  <Button size="lg" className="w-full h-12 sm:col-span-1">
                    Find Job
                  </Button>
                </form>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Suggestion:{' '}
                <span className="text-foreground/90">
                  Designer, Programing, Digital Marketing, Video, Animation.
                </span>
              </p>
            </div>
            <div className="hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Illustration of a person planning their career path"
                width={600}
                height={500}
                className="rounded-lg opacity-80"
                data-ai-hint="job search business"
              />
            </div>
          </div>
        </section>
        
        {/* Most Popular Vacancies */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Most Popular Vacancies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
            {popularVacancies.map((vacancy) => (
              <div key={vacancy.title}>
                <h3
                  className={cn(
                    'font-semibold',
                    vacancy.featured && 'text-primary'
                  )}
                >
                  <Link href="#" className="hover:underline">
                    {vacancy.title}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {vacancy.openings.toLocaleString()} Open Positions
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-card/50 border-t mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center gap-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} JobGenie. All rights reserved.</p>
          
          <div className="flex flex-col items-center gap-3 p-6 border rounded-xl bg-background shadow-sm w-full max-w-sm">
            <span className="font-semibold text-foreground uppercase tracking-wider text-xs">Developed by</span>
            <Image 
              src="/qvs-logo.png" 
              alt="Quantum Vision Studios Logo" 
              width={200} 
              height={80} 
              className="object-contain" 
            />
            <span className="text-sm mt-2">
              Support:{' '}
              <a href="mailto:supportqvs@gmail.com" className="hover:underline text-primary font-medium">
                supportqvs@gmail.com
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
