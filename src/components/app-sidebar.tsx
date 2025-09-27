'use client';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Home, Briefcase, User, PenSquare, PlusSquare, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from './ui/button';
import { SidebarFooter } from './ui/sidebar';

const navItems = [
  { href: '/jobs', label: '홈', icon: Home },
  { href: '/jobs/applications', label: '내 지원', icon: Briefcase },
  { href: '/jobs/profile', label: '마이페이지', icon: User },
  { href: '/jobs/new', label: '채용공고 등록', icon: PlusSquare },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center">
        <div className="flex items-center gap-2 p-2">
          <PenSquare className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-xl font-bold">PanelConnect</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <SidebarMenu className="flex-1">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarFooter className="mt-auto">
            {user ? (
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={logout} className="w-full">
                            <LogOut className="h-5 w-5" />
                            <span>로그아웃</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            ) : (
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="w-full">
                            <Link href="/login">
                                <LogIn className="h-5 w-5" />
                                <span>로그인</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            )}
        </SidebarFooter>
      </SidebarContent>
    </>
  );
}
