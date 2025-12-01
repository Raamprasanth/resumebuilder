'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  LayoutDashboard,
  Map,
  Briefcase,
  LogOut,
  ChevronDown,
  User,
  Sun,
  Moon,
  Laptop,
  TrendingUp
} from 'lucide-react';
import { useTheme } from 'next-themes';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
  SidebarInput,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { useFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ats-analyzer', label: 'ATS Analyzer', icon: FileText },
  { href: '/resume-builder', label: 'Resume Builder', icon: Briefcase },
  { href: '/career-roadmap', label: 'Career Roadmap', icon: Map },
  { href: '/job-popularity-index', label: 'Job Popularity', icon: TrendingUp },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { auth, user } = useFirebase();
  const router = useRouter();
  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };


  return (
    <>
      <SidebarHeader>
        <SidebarInput placeholder="Find or start a conversation" />
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
      <SidebarSeparator />
      <SidebarFooter>
        {user ? (
        <div className="flex items-center justify-between p-2">
            <div className='flex items-center gap-3'>
                <Avatar className='size-9'>
                <AvatarImage
                    src={user.photoURL || userAvatar?.imageUrl}
                    alt={user.displayName || "User"}
                    data-ai-hint={userAvatar?.imageHint}
                />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                <span className="font-semibold text-sm text-foreground">{user.displayName || user.email}</span>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground" onClick={handleSignOut}>
                    Log Out
                </Button>
                </div>
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        <Laptop className="mr-2 h-4 w-4" />
                        <span>System</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        ) : null}
      </SidebarFooter>
    </>
  );
}
