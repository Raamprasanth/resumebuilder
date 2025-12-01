'use client';

import { useFirebase } from '@/firebase';
import { SmartDashboard } from '@/components/dashboard/smart-dashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className='mb-6'>
          <h1 className="text-3xl font-bold tracking-tight">Find Your Next Job</h1>
          <p className="text-muted-foreground">
            Search for jobs or use our AI smart scan to get personalized recommendations.
          </p>
      </div>
      <SmartDashboard />
    </div>
  );
}
