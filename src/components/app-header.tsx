'use client';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
    { href: '/jobs', label: '홈' },
    { href: '/jobs/applications', label: '내 지원' },
    { href: '/jobs/profile', label: '마이페이지' },
];

export default function AppHeader() {
  const pathname = usePathname();
  const pageTitle = navItems.find(item => item.href === pathname)?.label ?? 'PanelConnect';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="hidden text-xl font-semibold md:block">{pageTitle}</h1>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
    </header>
  );
}
