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

// GET /api/admin/stats — dashboard summary statistics
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sb = getAdminSupabase();

    const [productsRes, ordersRes, pendingRes] = await Promise.all([
      sb.from('products').select('id', { count: 'exact', head: true }),
      sb.from('orders').select('id, total'),
      sb.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    const totalRevenue = ((ordersRes.data || []) as { total: number }[]).reduce(
      (sum, o) => sum + Number(o.total),
      0
    );

    return NextResponse.json({
      totalProducts: productsRes.count || 0,
      totalOrders: ordersRes.data?.length || 0,
      pendingOrders: pendingRes.count || 0,
      totalRevenue,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
