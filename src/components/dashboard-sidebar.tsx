'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  User,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Notice Board',
    href: '/dashboard/notices',
    icon: Bell,
  },
  {
    title: 'Academic Calendar',
    href: '/dashboard/calendar',
    icon: CalendarDays,
  },
  {
    title: 'Exam Schedule',
    href: '/dashboard/schedule',
    icon: GraduationCap,
  },
  {
    title: 'Admin Panel',
    href: '/dashboard/admin',
    icon: ShieldCheck,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { userProfile } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const role = userProfile?.role || 'student';
  const displayName = userProfile?.displayName || 'Student User';

  return (
    <Sidebar collapsible="icon" className="border-r border-border transition-all duration-300">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-border/50 p-3">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <GraduationCap className="size-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-lg font-bold font-headline tracking-tight text-foreground">
                AcademIQ
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                Academic Portal
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {/* Main Navigation Menu */}
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className={`transition-colors duration-150 ${
                    isActive
                      ? 'bg-primary/15 text-primary font-medium shadow-xs'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <Icon
                      className={`size-4 shrink-0 ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <span>{item.title}</span>
                    {item.href === '/dashboard/admin' && !isCollapsed && (
                      <Badge
                        variant="secondary"
                        className="ml-auto text-[10px] px-1.5 py-0 capitalize"
                      >
                        Admin
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer Profile Preview */}
      <SidebarFooter className="border-t border-border/50 p-2">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 p-1.5 rounded-md bg-muted/30">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold">
              <User className="size-3.5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium text-foreground truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize">
                {role} Mode
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1 text-primary">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
        )}
      </SidebarFooter>

      {/* Expand/Collapse Interactive Rail */}
      <SidebarRail />
    </Sidebar>
  );
}
