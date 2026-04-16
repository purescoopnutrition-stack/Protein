/**
 * Admin API helper — attaches the x-admin-token header to all requests.
 * All admin operations go through Next.js API routes which use the
 * Supabase service-role key server-side. Nothing hits Supabase directly
 * from the browser for admin writes.
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

export async function adminUploadImage(file: File, productId: string | null = null, position: number = 0, bucket?: string) {
  const formData = new FormData();
  formData.append('file', file);
  if (productId) formData.append('product_id', productId);
  formData.append('position', String(position));
  if (bucket) formData.append('bucket', bucket);

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

/* ── Orders ───────────────────────────────────────────────── */

export async function adminFetchOrders(status?: string) {
  const url =
    status && status !== 'all'
      ? `/api/admin/orders?status=${encodeURIComponent(status)}`
      : '/api/admin/orders';
  const res = await fetch(url, { headers: adminHeaders() });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch orders');
  return res.json();
}

export async function adminUpdateOrderStatus(id: string, status: string) {
  const res = await fetch('/api/admin/orders', {
    method: 'PATCH',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id, status }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to update order status');
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

/* ── Generic CRUD ─────────────────────────────────────────── */

export async function adminFetchCrud(table: string, params?: Record<string, string>) {
  const urlParams = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`/api/admin/crud/${table}${urlParams}`, { headers: adminHeaders() });
  if (!res.ok) throw new Error((await res.json()).error || `Failed to fetch ${table}`);
  return res.json();
}

export async function adminInsertCrud(table: string, payload: any) {
  const res = await fetch(`/api/admin/crud/${table}`, {
    method: 'POST',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).error || `Failed to insert ${table}`);
  return res.json();
}

export async function adminUpdateCrud(table: string, id: string, payload: any) {
  const res = await fetch(`/api/admin/crud/${table}`, {
    method: 'PUT',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id, ...payload }),
  });
  if (!res.ok) throw new Error((await res.json()).error || `Failed to update ${table}`);
  return res.json();
}

export async function adminDeleteCrud(table: string, id: string) {
  const res = await fetch(`/api/admin/crud/${table}`, {
    method: 'DELETE',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error((await res.json()).error || `Failed to delete ${table}`);
  return res.json();
}

