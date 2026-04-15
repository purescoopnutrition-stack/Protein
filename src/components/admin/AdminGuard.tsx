'use client';

import { useAdminAuth } from '@/hooks/use-admin';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/admin/login');
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
