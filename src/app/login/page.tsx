'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setLoading(true);

    // ─── ADMIN DETECTION (hardcoded, no API) ───
    if (
      data.email.trim().toLowerCase() === 'purescoop@admin.com' &&
      data.password === 'purescoop@admin.pass'
    ) {
      localStorage.setItem('ps-admin', 'true');
      toast.success('Admin access granted!');
      router.push('/admin');
      return;
    }

    // ─── NORMAL USER LOGIN via Supabase ───
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Successfully logged in!');
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-2xl font-heading font-bold tracking-tight text-foreground">PureScoop</span>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-gray-100">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  {...form.register('email')}
                  placeholder="name@example.com"
                  className="h-12 pl-12 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-red-500 font-medium">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-foreground">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  {...form.register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="h-12 pl-12 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-500 font-medium">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup">
                <span className="text-primary font-bold hover:underline">Create one now</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
