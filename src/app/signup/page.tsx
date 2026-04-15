'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: SignupFormValues) {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Account created! Please check your email for verification.');
      router.push('/login');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-2xl font-heading font-bold tracking-tight text-foreground">PureScoop</span>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-foreground">Join PureScoop</h1>
          <p className="text-muted-foreground mt-2">Start your journey to pure performance</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-gray-100">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  {...form.register('fullName')}
                  placeholder="John Doe"
                  className="h-12 pl-12 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                />
              </div>
              {form.formState.errors.fullName && (
                <p className="text-xs text-red-500 font-medium">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  {...form.register('email')}
                  type="email"
                  placeholder="name@example.com"
                  className="h-12 pl-12 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-red-500 font-medium">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Password</label>
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
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-muted-foreground italic">
              Already have an account?{' '}
              <Link href="/login" title="Login" icon="lock">
                <span className="text-primary font-bold hover:underline not-italic">Sign in instead</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
