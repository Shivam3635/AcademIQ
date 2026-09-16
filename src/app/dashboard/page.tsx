'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, CalendarDays, GraduationCap, Mail, Shield, User } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

const navigationItems = [
  {
    title: 'Notice Board',
    href: '/dashboard/notices',
    description: 'View the latest announcements and updates.',
    icon: <Bell className="size-8 text-primary" />,
  },
  {
    title: 'Academic Calendar',
    href: '/dashboard/calendar',
    description: 'Track important dates, holidays, and events.',
    icon: <CalendarDays className="size-8 text-primary" />,
  },
  {
    title: 'Exam Schedule',
    href: '/dashboard/schedule',
    description: 'Find your exam dates, times, and locations.',
    icon: <GraduationCap className="size-8 text-primary" />,
  },
];

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth();

  const displayName = userProfile?.displayName || user?.displayName || 'Student';
  const email = userProfile?.email || user?.email || 'student@university.edu';
  const role = userProfile?.role || 'student';
  const department = userProfile?.department || 'BCA CSE';
  const semester = userProfile?.semester || '3rd Semester';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const firstName = displayName.split(' ')[0] || displayName;

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome back, {loading ? '...' : firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's your academic overview and quick links.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/30">
              {user?.photoURL && <AvatarImage src={user.photoURL} alt={displayName} />}
              <AvatarFallback className="text-xl font-bold bg-primary/20 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{displayName}</CardTitle>
              </div>
              <Badge variant={role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                {role === 'admin' ? (
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Administrator
                  </span>
                ) : (
                  role
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm pt-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4 shrink-0" />
              <span className="truncate text-foreground">{email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="size-4 shrink-0" />
              <span className="text-foreground">{department}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="size-4 shrink-0" />
              <span className="text-foreground">{semester}</span>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Grid */}
        <div className="grid gap-6 md:col-span-2 md:grid-cols-2">
          {navigationItems.map((item, index) => (
            <Link href={item.href} key={index} className="flex">
              <Card className="flex-1 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-muted">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {item.icon}
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
