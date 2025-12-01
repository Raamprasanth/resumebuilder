'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  FileText,
  LayoutDashboard,
  Map,
  Briefcase,
} from 'lucide-react';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ats-analyzer', label: 'ATS Analyzer', icon: FileText },
  { href: '/resume-builder', label: 'Resume Builder', icon: Briefcase },
  { href: '/career-roadmap', label: 'Career Roadmap', icon: Map },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Compass className="size-6 text-primary" />
          <span className="text-lg font-semibold font-headline">
            CareerCompass AI
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          <Avatar>
            <AvatarImage
              src={userAvatar?.imageUrl}
              alt="User"
              data-ai-hint={userAvatar?.imageHint}
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">User</span>
            <span className="text-xs text-muted-foreground">
              user@example.com
            </span>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
