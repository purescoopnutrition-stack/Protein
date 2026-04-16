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

// POST /api/admin/images — upload image and create product_images record (optional)
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sb = getAdminSupabase();
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('product_id') as string | null;
    const position = parseInt((formData.get('position') as string) || '0', 10);
    const bucket = (formData.get('bucket') as string) || 'product-images';

    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    // Generate unique path
    const ext = file.name.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const basePath = productId ? `${productId}/` : '';
    const path = `${basePath}${timestamp}-${random}.${ext}`;

    // Upload to storage
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadErr } = await sb.storage
      .from(bucket)
      .upload(path, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true,
      });
    if (uploadErr) throw uploadErr;

    // Get public URL
    const { data: urlData } = sb.storage.from(bucket).getPublicUrl(path);
    const url = urlData.publicUrl;

    // Insert into product_images table only if saving a product image
    if (bucket === 'product-images' && productId) {
      const { error: dbErr } = await sb.from('product_images').insert({
        product_id: productId,
        url,
        position,
      });
      if (dbErr) throw dbErr;
    }

    return NextResponse.json({ url, path, success: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/images — delete image record and storage file
export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sb = getAdminSupabase();
    const { id, url, bucket = 'product-images' } = await req.json();

    // Delete from product_images table if applicable
    if (id && bucket === 'product-images') {
      await sb.from('product_images').delete().eq('id', id);
    }

    // Extract path and delete from storage
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = url.indexOf(marker);
    if (idx !== -1) {
      const path = url.substring(idx + marker.length);
      await sb.storage.from(bucket).remove([path]);
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to delete image' },
      { status: 500 }
    );
  }
}
