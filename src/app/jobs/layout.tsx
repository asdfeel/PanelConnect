import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import AppHeader from '@/components/app-header';
import { AuthProvider } from '@/context/auth-context';
import { JobProvider } from '@/context/job-context';

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <JobProvider>
        <SidebarProvider>
          <Sidebar>
            <AppSidebar />
          </Sidebar>
          <SidebarInset>
            <AppHeader />
            <main className="p-4 sm:p-6 lg:p-8">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </JobProvider>
    </AuthProvider>
  );
}
