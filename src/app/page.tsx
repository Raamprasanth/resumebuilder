import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Search, ChevronDown, Phone, Globe, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const popularVacancies = [
    { title: 'Anesthesiologists', openings: 45904 },
    { title: 'Surgeons', openings: 50364 },
    { title: 'Obstetricians-Gynecologists', openings: 4339 },
    { title: 'Orthodontists', openings: 20079 },
    { title: 'Maxillofacial Surgeons', openings: 74875 },
    { title: 'Software Developer', openings: 43359 },
    { title: 'Psychiatrists', openings: 18599 },
    { title: 'Data Scientist', openings: 28200, featured: true },
    { title: 'Financial Manager', openings: 61391 },
    { title: 'Management Analysis', openings: 93046 },
    { title: 'IT Manager', openings: 50963 },
    { title: 'Operations Research Analysis', openings: 16627 },
];

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Main Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                <Link href="/" className="flex items-center gap-2">
                    <Briefcase className="h-8 w-8 text-primary" />
                    <span className="font-bold text-2xl text-gray-900">JobGenie</span>
                </Link>
                 <div className="hidden md:flex flex-1 max-w-lg items-center border rounded-md ml-8">
                     <Button variant="ghost" className="flex items-center space-x-1">
                        <Image src="https://picsum.photos/seed/india-flag/20/15" alt="India flag" width={20} height={15} data-ai-hint="country flag" />
                        <span>India</span>
                        <ChevronDown className="w-4 h-4" />
                     </Button>
                     <span className="w-px h-6 bg-gray-200"></span>
                    <Search className="h-5 w-5 text-gray-400 mx-3"/>
                    <input type="text" placeholder="Job tittle, keyword, company" className="flex-1 bg-transparent focus:outline-none text-sm"/>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Post A Jobs</Link>
                    </Button>
                </div>
            </div>
          </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-gray-900">
                Find a job that suits your interest & skills.
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                Aliquam vitae turpis in diam convallis finibus in at risus. Nullam in scelerisque leo, eget sollicitudin velit vestibulum.
              </p>
              <div className="mt-10 p-4 bg-white shadow-lg rounded-lg border">
                <form className="grid sm:grid-cols-3 gap-4">
                  <div className="relative sm:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input type="text" placeholder="Job tittle, Keyword..." className="pl-10 h-12 border-none focus-visible:ring-0"/>
                  </div>
                   <div className="relative sm:col-span-1 border-l">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input type="text" placeholder="Your Location" className="pl-10 h-12 border-none focus-visible:ring-0"/>
                  </div>
                  <Button size="lg" className="w-full h-12 sm:col-span-1">Find Job</Button>
                </form>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Suggestion: <span className="text-gray-800">Designer, Programing, Digital Marketing, Video, Animation.</span>
              </p>
            </div>
            <div className="hidden md:block">
              <Image src="https://picsum.photos/seed/job-illustration/600/400" alt="Illustration of a person working on a laptop" width={600} height={400} className="rounded-lg" data-ai-hint="person working laptop" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <div className="flex justify-center mb-3">
                 <div className="bg-blue-100 p-3 rounded-md">
                    <Briefcase className="h-6 w-6 text-primary" />
                 </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">1,75,324</p>
              <p className="text-sm text-gray-500">Live Job</p>
            </Card>
             <Card className="text-center p-6 border-primary shadow-lg">
              <div className="flex justify-center mb-3">
                 <div className="bg-blue-100 p-3 rounded-md">
                    <Image src="https://picsum.photos/seed/companies-icon/24/24" alt="Companies icon" width={24} height={24} data-ai-hint="office building"/>
                 </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">97,354</p>
              <p className="text-sm text-gray-500">Companies</p>
            </Card>
             <Card className="text-center p-6">
              <div className="flex justify-center mb-3">
                 <div className="bg-blue-100 p-3 rounded-md">
                    <User className="h-6 w-6 text-primary" />
                 </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">38,47,154</p>
              <p className="text-sm text-gray-500">Candidates</p>
            </Card>
             <Card className="text-center p-6">
              <div className="flex justify-center mb-3">
                 <div className="bg-blue-100 p-3 rounded-md">
                    <Briefcase className="h-6 w-6 text-primary" />
                 </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">7,532</p>
              <p className="text-sm text-gray-500">New Jobs</p>
            </Card>
          </div>
        </section>

        {/* Most Popular Vacancies */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Most Popular Vacancies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
            {popularVacancies.map((vacancy) => (
              <div key={vacancy.title}>
                <h3 className={cn('font-semibold', vacancy.featured && 'text-primary')}>
                  <Link href="#" className="hover:underline">{vacancy.title}</Link>
                </h3>
                <p className="text-sm text-gray-500">{vacancy.openings.toLocaleString()} Open Positions</p>
              </div>
            ))}
          </div>
        </section>
      </main>

       <footer className="bg-gray-50 border-t mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} JobGenie. All rights reserved.</p>
            </div>
        </footer>
    </div>
  );
}

function Input({ ...props }) {
  return <input {...props} className={"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 " + (props.className || '')} />;
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}>{children}</div>;
}

function cn(...inputs: any[]) {
    // A simple version of clsx
    return inputs.filter(Boolean).join(' ');
}