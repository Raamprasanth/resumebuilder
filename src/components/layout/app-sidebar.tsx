
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Search,
  Map,
  Briefcase,
  LogOut,
  ChevronDown,
  User,
  Sun,
  Moon,
  Laptop,
  TrendingUp,
  Shield,
  Code2,
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
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { useFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Logo } from '../ui/logo';

const primaryMenuItems = [
  { href: '/dashboard', label: 'Find Job', icon: Search },
  { href: '/ats-analyzer', label: 'ATS Analyzer', icon: FileText },
  { href: '/resume-builder', label: 'Resume Builder', icon: Briefcase },
  { href: '/career-roadmap', label: 'Career Roadmap', icon: Map },
  { href: '/job-popularity-index', label: 'Job Popularity', icon: TrendingUp },
];

const secondaryMenuItems = [
    { href: '/privacy-policy', label: 'Privacy & Policy', icon: Shield },
]

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
        <div className="flex items-center justify-center gap-2 p-2 w-full">
            <Logo className="h-12 w-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
            {primaryMenuItems.map((item) => (
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
        </SidebarGroup>
        <SidebarGroup>
            <SidebarGroupLabel>General</SidebarGroupLabel>
            <SidebarMenu>
            {secondaryMenuItems.map((item) => (
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        {user ? (
        <div className="flex items-center justify-between p-3">
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
                </div>
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronDown className="size-4 text-muted-foreground"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                        <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
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
                     <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        ) : null}
      </SidebarFooter>
    </>
  );
}
