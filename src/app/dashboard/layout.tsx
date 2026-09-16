import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { UserNavClient } from '@/components/user-nav-client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* Dynamic Collapsible Sidebar */}
      <DashboardSidebar />

      {/* Main App Inset */}
      <SidebarInset className="flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-md px-4 lg:h-[60px] lg:px-6">
          {/* Universal Sidebar Toggle for Mobile & Desktop */}
          <div className="flex items-center gap-3">
            <SidebarTrigger className="h-8 w-8 rounded-md hover:bg-muted transition-colors" />
          </div>

          <div className="flex-1" />

          {/* User Profile Navigation */}
          <UserNavClient />
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
