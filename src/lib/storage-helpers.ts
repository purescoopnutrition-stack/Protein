import { supabase } from './supabase';

/* ── Bucket name constants ─────────────────────────────────────── */
export const BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  BRAND_LOGOS: 'brand-logos',
  CATEGORY_IMAGES: 'category-images',
  BANNER_IMAGES: 'banner-images',
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

/* ── Upload a file to a Supabase Storage bucket ─────────────── */
export async function uploadFile(
  bucket: BucketName,
  path: string,
  file: File
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  return getPublicUrl(bucket, path);
}

/* ── Delete a file from a Supabase Storage bucket ────────────── */
export async function deleteFile(
  bucket: BucketName,
  path: string
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

/* ── Get public URL for a file ───────────────────────────────── */
export function getPublicUrl(bucket: BucketName, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/* ── Generate a unique file path ─────────────────────────────── */
export function generateFilePath(file: File, prefix?: string): string {
  const ext = file.name.split('.').pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const base = prefix ? `${prefix}/` : '';
  return `${base}${timestamp}-${random}.${ext}`;
}

/* ── Extract path from a public URL ──────────────────────────── */
export function extractPathFromUrl(url: string, bucket: BucketName): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.substring(idx + marker.length);
}
