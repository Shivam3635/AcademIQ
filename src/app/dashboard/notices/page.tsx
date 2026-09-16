'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { subscribeToNotices, type NoticeItem } from '@/lib/notices';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BellRing, Flame, Loader2, Shield, Sparkles } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function NoticesPage() {
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.role === 'admin';

  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const unsubscribe = subscribeToNotices((items) => {
      setNotices(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredNotices = notices.filter((n) => {
    if (selectedCategory === 'all') return true;
    return n.category === selectedCategory;
  });

  const formatDateString = (dateStr: string) => {
    try {
      if (!dateStr) return 'Recent';
      return format(parseISO(dateStr), 'MMMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Notice Board
          </h1>
          <p className="text-muted-foreground">
            Official real-time college announcements, deadlines, and circulars.
          </p>
        </div>

        {isAdmin && (
          <Button asChild size="sm" className="shadow-sm">
            <Link href="/dashboard/admin">
              <Shield className="w-4 h-4 mr-1.5" /> Manage Notices (Admin)
            </Link>
          </Button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pt-1 pb-2">
        {['all', 'general', 'academic', 'exam', 'event', 'urgent'].map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="capitalize text-xs rounded-full h-8 px-3.5"
          >
            {cat === 'all' ? 'All Notices' : cat}
          </Button>
        ))}
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="flex justify-center items-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading live announcements...
        </div>
      ) : filteredNotices.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-3">
            <BellRing className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
            <p className="text-muted-foreground">No notices found in this category.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice, index) => {
            const isUrgent = notice.priority === 'urgent' || notice.category === 'urgent';

            return (
              <Card
                key={notice.id}
                className={`animate-in fade-in-0 slide-in-from-bottom-3 duration-300 transition-all hover:shadow-md ${
                  isUrgent
                    ? 'border-destructive/40 bg-destructive/5'
                    : 'hover:border-primary/40'
                }`}
                style={{
                  animationDelay: `${index * 60}ms`,
                  animationFillMode: 'backwards',
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <CardTitle className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                        <BellRing
                          className={`size-5 shrink-0 ${
                            isUrgent ? 'text-destructive' : 'text-primary'
                          }`}
                        />
                        <span>{notice.title}</span>
                      </CardTitle>
                      <CardDescription>
                        Posted by <strong className="text-foreground/80">{notice.author}</strong> on{' '}
                        {formatDateString(notice.date)}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isUrgent && (
                        <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                          <Flame className="w-3 h-3" /> Urgent
                        </Badge>
                      )}
                      <Badge
                        variant={notice.category === 'exam' ? 'outline' : 'secondary'}
                        className="capitalize text-xs"
                      >
                        {notice.category || 'general'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 whitespace-pre-line leading-relaxed text-sm">
                    {notice.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
