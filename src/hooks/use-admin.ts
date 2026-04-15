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

export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(id, url, alt_text, position),
          variants:product_variants(id, name, price, compare_price, stock),
          flavours:product_flavours(id, name),
          sizes:product_sizes(id, name),
          category:categories(id, name),
          brand:brands(id, name)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
  });
}

export function useAdminOrders(status?: string) {
  return useQuery({
    queryKey: ['admin-orders', status],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`*, items:order_items(*)`)
        .order('created_at', { ascending: false });
      if (status && status !== 'all') query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as any[];
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-orders'] }),
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('position');
      if (error) throw error;
      return (data || []) as any[];
    },
  });
}

export function useAdminBrands() {
  return useQuery({
    queryKey: ['admin-brands'],
    queryFn: async () => {
      const { data, error } = await supabase.from('brands').select('*').order('position');
      if (error) throw error;
      return (data || []) as any[];
    },
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
  });
}

export function useAdminReviews() {
  return useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`*, product:products(id, name)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
  });
}

export function useAdminBanners() {
  return useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const { data, error } = await supabase.from('banners').select('*').order('position');
      if (error) throw error;
      return (data || []) as any[];
    },
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
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
      const [products, orders, pendingOrders] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id, total'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      const totalRevenue = ((orders.data || []) as any[]).reduce((s: number, o: any) => s + Number(o.total), 0);

      return {
        totalProducts: products.count || 0,
        totalOrders: (orders.data as any[] | null)?.length || 0,
        pendingOrders: pendingOrders.count || 0,
        totalRevenue,
      };
    },
  });
}
