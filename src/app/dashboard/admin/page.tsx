'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import {
  subscribeToNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  seedInitialNotices,
  type NoticeItem,
} from '@/lib/notices';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  CheckCircle2,
  Database,
  Edit,
  Flame,
  Loader2,
  Plus,
  Search,
  Shield,
  Trash2,
} from 'lucide-react';

export default function AdminNoticesPage() {
  const { userProfile, demoSignIn } = useAuth();
  const isAdmin = userProfile?.role === 'admin';

  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Create / Edit modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoticeItem['category']>('general');
  const [priority, setPriority] = useState<NoticeItem['priority']>('normal');
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [noticeToDelete, setNoticeToDelete] = useState<NoticeItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Seed notification
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToNotices((items) => {
      setNotices(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openCreateDialog = () => {
    setEditingNotice(null);
    setTitle('');
    setAuthor(userProfile?.displayName || 'Admin Office');
    setContent('');
    setCategory('general');
    setPriority('normal');
    setDate(new Date().toISOString().split('T')[0]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (notice: NoticeItem) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setAuthor(notice.author);
    setContent(notice.content);
    setCategory(notice.category || 'general');
    setPriority(notice.priority || 'normal');
    setDate(notice.date || new Date().toISOString().split('T')[0]);
    setIsDialogOpen(true);
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      if (editingNotice) {
        await updateNotice(editingNotice.id, {
          title,
          author,
          content,
          category,
          priority,
          date,
        });
      } else {
        await createNotice({
          title,
          author,
          content,
          category,
          priority,
          date,
        });
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Failed to save notice:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async () => {
    if (!noticeToDelete) return;
    setIsDeleting(true);
    try {
      await deleteNotice(noticeToDelete.id);
      setNoticeToDelete(null);
    } catch (err) {
      console.error('Failed to delete notice:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSeedSamples = async () => {
    try {
      const count = await seedInitialNotices();
      setSeedMessage(
        count > 0
          ? `Successfully seeded ${count} sample notices!`
          : 'Notice collection already has records.'
      );
      setTimeout(() => setSeedMessage(null), 4000);
    } catch (err) {
      console.error('Failed to seed notices:', err);
    }
  };

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const urgentCount = notices.filter((n) => n.priority === 'urgent').length;

  return (
    <div className="container mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Admin Panel
            </h1>
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              <Shield className="w-3 h-3 mr-1 text-primary" /> Notice CRUD
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Create, update, and manage official college notices published to Firestore.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedSamples}
            className="flex items-center gap-1.5"
            title="Populate initial sample notices if database is empty"
          >
            <Database className="w-4 h-4" /> Seed Samples
          </Button>
          <Button
            onClick={openCreateDialog}
            className="flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Notice
          </Button>
        </div>
      </div>

      {/* Role Notice if not Admin */}
      {!isAdmin && (
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500 shrink-0" />
              <div className="text-sm">
                <span className="font-semibold text-foreground">
                  Logged in as Student:
                </span>{' '}
                <span className="text-muted-foreground">
                  You have view access. Switch to Administrator to publish new campus announcements.
                </span>
              </div>
            </div>
            <Button
              size="sm"
              variant="default"
              onClick={() => demoSignIn('admin')}
              className="whitespace-nowrap"
            >
              Switch to Admin View
            </Button>
          </CardContent>
        </Card>
      )}

      {seedMessage && (
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-sm text-primary flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {seedMessage}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Notices</CardDescription>
            <CardTitle className="text-3xl font-bold">{notices.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Stored in Cloud Firestore
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Announcements</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              {notices.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Visible on Student Feed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Urgent Alerts</CardDescription>
            <CardTitle className="text-3xl font-bold text-destructive flex items-center gap-2">
              {urgentCount} <Flame className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              High priority broadcasts
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notices by title, content, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['all', 'general', 'academic', 'exam', 'event', 'urgent'].map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="capitalize text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notices Table / List */}
      <Card>
        <CardHeader>
          <CardTitle>Published Notices</CardTitle>
          <CardDescription>
            Manage and update notices in real-time. Changes propagate instantly to all student dashboards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading notices...
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Bell className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
              <p className="text-muted-foreground">No notices found.</p>
              <Button onClick={openCreateDialog} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" /> Create the first notice
              </Button>
            </div>
          ) : (
            <div className="divide-y border rounded-md">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-base text-foreground">
                        {notice.title}
                      </h3>
                      <Badge
                        variant={notice.priority === 'urgent' ? 'destructive' : 'secondary'}
                        className="text-[11px] capitalize"
                      >
                        {notice.category || 'general'}
                      </Badge>
                      {notice.priority === 'urgent' && (
                        <Badge variant="destructive" className="text-[10px]">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notice.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span>Posted by <strong>{notice.author}</strong></span>
                      <span>•</span>
                      <span>Date: {notice.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(notice)}
                      className="h-8 px-2.5 text-xs flex items-center gap-1"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNoticeToDelete(notice)}
                      className="h-8 px-2.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSaveNotice}>
            <DialogHeader>
              <DialogTitle>
                {editingNotice ? 'Edit Notice' : 'Publish New Notice'}
              </DialogTitle>
              <DialogDescription>
                {editingNotice
                  ? 'Update announcement details in Cloud Firestore.'
                  : 'Broadcast a new official notice to students across campus.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="notice-title">Notice Title *</Label>
                <Input
                  id="notice-title"
                  placeholder="e.g., Mid-Term Examination Schedule Announced"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="notice-author">Author / Dept *</Label>
                  <Input
                    id="notice-author"
                    placeholder="e.g. Examination Cell"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notice-date">Date *</Label>
                  <Input
                    id="notice-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="notice-category">Category</Label>
                  <select
                    id="notice-category"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as NoticeItem['category'])
                    }
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="general">General</option>
                    <option value="academic">Academic</option>
                    <option value="exam">Examinations</option>
                    <option value="event">Campus Event</option>
                    <option value="urgent">Urgent Notice</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notice-priority">Priority</Label>
                  <select
                    id="notice-priority"
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as NoticeItem['priority'])
                    }
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="urgent">Urgent Priority (Red Banner)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notice-content">Notice Content *</Label>
                <Textarea
                  id="notice-content"
                  placeholder="Provide complete details, instructions, links, or dates for students..."
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingNotice ? 'Save Changes' : 'Publish Notice'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(noticeToDelete)}
        onOpenChange={(open) => !open && setNoticeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notice?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong className="text-foreground">
                "{noticeToDelete?.title}"
              </strong>
              ? This action will remove the announcement immediately from Firestore.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNotice}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete Notice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
