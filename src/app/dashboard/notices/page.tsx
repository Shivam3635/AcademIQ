import { BellRing } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { notices } from '@/lib/academic-data';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

export default function NoticesPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Notice Board</h1>
        <p className="text-muted-foreground">Latest updates and announcements.</p>
      </div>
      <div className="space-y-6">
        {notices.map((notice, index) => (
          <Card 
            key={notice.id} 
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BellRing className="text-primary" />
                    {notice.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Posted by {notice.author} on {format(parseISO(notice.date), 'MMMM d, yyyy')}
                  </CardDescription>
                </div>
                <Badge variant="secondary">New</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">{notice.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
