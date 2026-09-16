'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Loader2, ShieldCheck, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function AuthForm() {
  const router = useRouter();
  const { signIn, signUp, isFirebaseConfigured } = useAuth();

  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('BCA CSE');
  const [semester, setSemester] = useState('3rd Semester');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name.');
          setLoading(false);
          return;
        }
        await signUp(email, password, name, role, department, semester);
      } else {
        await signIn(email, password);
      }
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Authentication error:', err);
      let message = 'An error occurred during authentication.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email. Would you like to sign up?';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please provide a valid email address.';
      } else if (err.message) {
        message = err.message;
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col items-center text-center mb-4 md:hidden">
        <GraduationCap className="mb-2 h-10 w-10 text-primary" />
        <h1 className="text-2xl font-bold font-headline">AcademIQ</h1>
      </div>

      <div className="flex justify-between items-center px-1">
        <span className="text-xs text-muted-foreground">Auth Provider:</span>
        <Badge variant={isFirebaseConfigured ? 'default' : 'secondary'} className="text-xs">
          {isFirebaseConfigured ? (
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Live Firebase
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <UserCheck className="h-3 w-3" /> Demo / Offline Mode
            </span>
          )}
        </Badge>
      </div>

      <Tabs
        value={role}
        onValueChange={(val) => {
          setRole(val as 'student' | 'admin');
          setErrorMessage(null);
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value={role}>
          <Card>
            <CardHeader>
              <CardTitle>
                {role === 'student' ? 'Student Portal' : 'Admin Portal'} &mdash;{' '}
                {isSignUp ? 'Create Account' : 'Sign In'}
              </CardTitle>
              <CardDescription>
                {isSignUp
                  ? `Register a new ${role} account for AcademIQ.`
                  : `Access your ${role === 'student' ? 'academic dashboard' : 'administration panel'}.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g. Shivam Singh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      role === 'student'
                        ? 'student@university.edu'
                        : 'admin@university.edu'
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {isSignUp && role === 'student' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="dept">Department</Label>
                      <Input
                        id="dept"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sem">Semester</Label>
                      <Input
                        id="sem"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                    {errorMessage}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setErrorMessage(null);
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    {isSignUp
                      ? 'Already have an account? Sign In'
                      : "Don't have an account? Create one"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
