import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey);
}

export async function POST(req: NextRequest) {
  try {
    const sb = getAdminSupabase();
    const body = await req.json();
    
    const { orderData, orderItems, couponCode } = body;
    
    // Save order
    const { data: order, error: orderError } = await sb
      .from('orders')
      .insert({ ...orderData, coupon_code: couponCode || null })
      .select()
      .single();

    if (orderError) throw orderError;

    // Attach order ID to items
    const itemsToInsert = orderItems.map((item: any) => ({
      ...item,
      order_id: order.id
    }));

    // Save items
    const { error: itemsError } = await sb.from('order_items').insert(itemsToInsert);
    if (itemsError) throw itemsError;

    // Increment coupon
    if (couponCode) {
      try { await sb.rpc('increment_coupon_usage', { coupon_code: couponCode }); } catch (_) {}
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (e: any) {
    console.error('Checkout error:', e);
    return NextResponse.json({ error: e.message || 'Failed to place order' }, { status: 500 });
  }
}
