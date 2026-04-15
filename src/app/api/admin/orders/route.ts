import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return createClient(url, serviceKey);
}

function isAdminRequest(req: NextRequest): boolean {
  return req.headers.get('x-admin-token') === 'ps-admin-authenticated';
}

// GET /api/admin/orders
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const sb = getAdminSupabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = sb
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 });
  }
}

// PATCH /api/admin/orders — update order status
export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const sb = getAdminSupabase();
    const { id, status } = await req.json();
    const { error } = await sb.from('orders').update({ status }).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 });
  }
}
