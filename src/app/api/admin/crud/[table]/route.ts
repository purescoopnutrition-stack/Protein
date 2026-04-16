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

export async function GET(req: NextRequest, { params }: { params: { table: string } }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const sb = getAdminSupabase();
    // For sorting, allow passing order field and asc/desc
    const { searchParams } = new URL(req.url);
    const orderBy = searchParams.get('orderBy') || 'created_at';
    const ascending = searchParams.get('ascending') !== 'false'; // default true
    
    // For select, e.g. select=*, product:products(id,name)
    const select = searchParams.get('select') || '*';
    const matchField = searchParams.get('matchField');
    const matchValue = searchParams.get('matchValue');

    let query = sb.from(params.table).select(select);
    
    if (matchField && matchValue !== null) {
      query = query.eq(matchField, matchValue);
    }
    
    // Fallback: If ordering column doesnt exist, it may throw, but assuming it exists
    query = query.order(orderBy, { ascending });
    
    const { data, error } = await query;
    if (error) throw error;
    
    return NextResponse.json(data || []);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { table: string } }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const sb = getAdminSupabase();
    const body = await req.json();
    const { error } = await sb.from(params.table).insert(body);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { table: string } }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const sb = getAdminSupabase();
    const { id, ...data } = await req.json();
    const { error } = await sb.from(params.table).update(data).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { table: string } }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const sb = getAdminSupabase();
    const { id } = await req.json();
    const { error } = await sb.from(params.table).delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 });
  }
}
