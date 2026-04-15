'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner';
import { CartDrawer } from '@/components/cart/CartDrawer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '1rem',
              fontFamily: 'DM Sans, sans-serif',
            },
          }}
        />
        {children}
        <CartDrawer />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
