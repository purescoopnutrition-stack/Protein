import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ── Auth hooks ───────────────────────────────────────────────── */

export function useAdminAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // ─── HARDCODED ADMIN CREDENTIALS ───
  const ADMIN_EMAIL = "purescoop@admin.com";
  const ADMIN_PASS = "purescoop@admin.pass";

  useEffect(() => {
    // Restore hardcoded admin session from localStorage
    if (localStorage.getItem('ps-admin') === 'true') {
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkAdmin(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkAdmin(session.user.id);
      else if (localStorage.getItem('ps-admin') !== 'true') {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkAdmin(userId: string) {
    if (localStorage.getItem('ps-admin') === 'true') {
      setIsAdmin(true);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    setIsAdmin((data as any)?.is_admin ?? false);
    setLoading(false);
  }

  async function signIn(email: string, password: string) {
    // ─── HARDCODED ADMIN CHECK (no API call) ───
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASS) {
      localStorage.setItem('ps-admin', 'true');
      setIsAdmin(true);
      setLoading(false);
      return; // Done. No Supabase call at all.
    }

    // Normal user auth via Supabase
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    localStorage.removeItem('ps-admin');
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  }

  return { session, isAdmin, loading, signIn, signOut };
}

/* ── Admin CRUD hooks ─────────────────────────────────────────── */

import {
  adminFetchProducts,
  adminFetchOrders,
  adminUpdateOrderStatus,
  adminFetchSettings,
  adminFetchCrud,
} from '@/lib/admin-api';

export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: adminFetchProducts,
  });
}

export function useAdminOrders(status?: string) {
  return useQuery({
    queryKey: ['admin-orders', status],
    queryFn: () => adminFetchOrders(status),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await adminUpdateOrderStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-orders'] }),
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminFetchCrud('categories', { orderBy: 'position', ascending: 'true' }),
  });
}

export function useAdminBrands() {
  return useQuery({
    queryKey: ['admin-brands'],
    queryFn: () => adminFetchCrud('brands', { orderBy: 'position', ascending: 'true' }),
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => adminFetchCrud('coupons', { orderBy: 'created_at', ascending: 'false' }),
  });
}

export function useAdminReviews() {
  return useQuery({
    queryKey: ['admin-reviews'],
    // Using select='*, product:products(id, name)'
    queryFn: () => adminFetchCrud('reviews', { select: '*, product:products(id, name)', orderBy: 'created_at', ascending: 'false' }),
  });
}

export function useAdminBanners() {
  return useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => adminFetchCrud('banners', { orderBy: 'position', ascending: 'true' }),
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const data = await adminFetchSettings();
      const map: Record<string, string> = {};
      ((data || []) as any[]).forEach((s: any) => { map[s.key] = s.value; });
      return map;
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-token': 'ps-admin-authenticated' }
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
  });
}
