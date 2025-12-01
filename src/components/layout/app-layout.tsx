'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

function ConditionalLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
        return <>{children}</>;
    }
    
    return (
        <SidebarProvider>
            <Sidebar variant='sidebar' collapsible='icon'>
                <AppSidebar />
            </Sidebar>
            <SidebarInset>
                 <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-sm">
                    <SidebarTrigger className="md:hidden" />
                    {/* Header content can go here */}
                </header>
                <main className="flex-1 p-4 sm:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}


export function AppLayout({ children }: { children: ReactNode }) {
  return <ConditionalLayout>{children}</ConditionalLayout>;
}
