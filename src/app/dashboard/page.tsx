import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, CalendarDays, GraduationCap, User } from 'lucide-react';

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
  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome back, Shivam!
        </h1>
        <p className="text-muted-foreground">
          Here's your academic overview and quick links.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://picsum.photos/seed/user-avatar/128/128" alt="Student Avatar" />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Shivam Singh</CardTitle>
              <CardDescription>Student</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <span>BCA CSE</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 text-muted-foreground" />
              <span>3rd Semester</span>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Grid */}
        <div className="grid gap-6 md:col-span-2 md:grid-cols-2">
          {navigationItems.map((item, index) => (
             <Link href={item.href} key={index} className="flex">
              <Card className="flex-1 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
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
