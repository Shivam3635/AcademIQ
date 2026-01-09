import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { AuthForm } from '@/components/auth-form';
import { GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const loginImage = getPlaceholderImage('login-hero');

  return (
    <div className="w-full max-w-4xl rounded-xl shadow-2xl bg-card/80 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative hidden h-full min-h-[480px] flex-col justify-between rounded-l-xl bg-primary/80 p-10 text-primary-foreground md:flex">
          <Image
            src={loginImage?.imageUrl || ''}
            alt={loginImage?.description || ''}
            data-ai-hint={loginImage?.imageHint}
            fill
            className="absolute inset-0 object-cover opacity-20 rounded-l-xl"
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <GraduationCap className="mr-2 h-8 w-8" />
            AcademIQ
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;The unified platform for academic excellence and
                information.&rdquo;
              </p>
              <footer className="text-sm">AcademIQ Portal</footer>
            </blockquote>
          </div>
        </div>
        <div className="p-8 flex items-center">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
