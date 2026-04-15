import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  return createClient(url, serviceKey);
}

function isAdminRequest(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token');
  return token === 'ps-admin-authenticated';
}

// GET /api/admin/settings
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const sb = getAdminSupabase();
    const { data, error } = await sb.from('settings').select('*');
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings — upsert settings
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const sb = getAdminSupabase();
    const { settings } = await req.json(); // { key: value, ... }
    for (const [key, value] of Object.entries(settings)) {
      const { error } = await sb
        .from('settings')
        .upsert({ key, value: value as string }, { onConflict: 'key' });
      if (error) throw error;
    }
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to save settings' },
      { status: 500 }
    );
  }
}
