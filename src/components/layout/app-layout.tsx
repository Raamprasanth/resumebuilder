'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

function ConditionalLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    if (pathname === '/login' || pathname === '/signup') {
        return <>{children}</>;
    }
    
    return (
        <SidebarProvider>
            <Sidebar variant='sidebar' collapsible='icon'>
                <AppSidebar />
            </Sidebar>
            <SidebarInset>
                 <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
                    <SidebarTrigger className="md:hidden" />
                    <h1 className="text-xl font-semibold tracking-tight font-headline md:text-2xl">
                        JobGenie
                    </h1>
                </header>
                <main className="flex-1 p-4 sm:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}


export function AppLayout({ children }: { children: ReactNode }) {
  return <ConditionalLayout>{children}</ConditionalLayout>;
}

    