/**
 * Admin API helper — attaches the x-admin-token header to all requests.
 * This token is verified server-side without needing a Supabase JWT session.
 */

const ADMIN_TOKEN = 'ps-admin-authenticated';

function adminHeaders(extra?: HeadersInit): HeadersInit {
  return {
    'x-admin-token': ADMIN_TOKEN,
    ...extra,
  };
}

/* ── Products ─────────────────────────────────────────────── */

export async function adminFetchProducts() {
  const res = await fetch('/api/admin/products', {
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch products');
  return res.json();
}

export async function adminSaveProduct(body: Record<string, unknown>) {
  const res = await fetch('/api/admin/products', {
    method: 'POST',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to save product');
  return res.json();
}

export async function adminDeleteProduct(id: string) {
  const res = await fetch('/api/admin/products', {
    method: 'DELETE',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete product');
  return res.json();
}

/* ── Images ───────────────────────────────────────────────── */

export async function adminUploadImage(file: File, productId: string, position: number) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('product_id', productId);
  formData.append('position', String(position));

  const res = await fetch('/api/admin/images', {
    method: 'POST',
    headers: adminHeaders(), // No Content-Type — FormData sets it with boundary
    body: formData,
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to upload image');
  return res.json();
}

export async function adminDeleteImage(id: string, url: string) {
  const res = await fetch('/api/admin/images', {
    method: 'DELETE',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id, url }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete image');
  return res.json();
}

/* ── Settings ─────────────────────────────────────────────── */

export async function adminFetchSettings() {
  const res = await fetch('/api/admin/settings', {
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch settings');
  return res.json();
}

export async function adminSaveSettings(settings: Record<string, string>) {
  const res = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ settings }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to save settings');
  return res.json();
}
