'use client';

import { useAdminAuth } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { isAdmin, loading, signIn } = useAdminAuth();
  const [error, setError] = useState('');
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAdmin) {
    router.replace('/admin');
    return null;
  }

  async function onSubmit(data: LoginForm) {
    setError('');
    try {
      await signIn(data.email, data.password);
      router.push('/admin');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed');
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#222] rounded-3xl p-8 border border-white/10 shadow-2xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-white/50 text-sm mt-1">PureScoop Dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Email address"
              type="email"
              {...register('email')}
              className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Input
              placeholder="Password"
              type="password"
              {...register('password')}
              className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-primary text-white font-bold"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
