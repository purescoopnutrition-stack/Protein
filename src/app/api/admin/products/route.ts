import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Service-role client bypasses RLS
function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  return createClient(url, serviceKey);
}

// Simple admin check using hardcoded credentials
function isAdminRequest(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token');
  return token === 'ps-admin-authenticated';
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// GET /api/admin/products — list all products with relations
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sb = getAdminSupabase();
    const { data, error } = await sb
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
    return NextResponse.json(data || []);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products — create or update a product
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sb = getAdminSupabase();
    const body = await req.json();
    const {
      editId,
      name, slug, description, price, compare_price, stock,
      is_featured, is_bestseller, is_active,
      weight, servings, protein_per_serving, carbs_per_serving,
      fat_per_serving, energy_per_serving, ingredients, usage_instructions,
      category_name, brand_name,
      flavourList, sizeList,
    } = body;

    // Resolve Category
    let finalCategoryId = null;
    if (category_name?.trim()) {
      const { data: existingCat } = await sb
        .from('categories')
        .select('id')
        .ilike('name', category_name.trim())
        .maybeSingle();

      if (existingCat) {
        finalCategoryId = existingCat.id;
      } else {
        const { data: newCat, error: catErr } = await sb
          .from('categories')
          .insert({ name: category_name.trim(), slug: slugify(category_name.trim()) })
          .select('id')
          .single();
        if (catErr) throw catErr;
        finalCategoryId = newCat.id;
      }
    }

    // Resolve Brand
    let finalBrandId = null;
    if (brand_name?.trim()) {
      const { data: existingBrand } = await sb
        .from('brands')
        .select('id')
        .ilike('name', brand_name.trim())
        .maybeSingle();

      if (existingBrand) {
        finalBrandId = existingBrand.id;
      } else {
        const { data: newBrand, error: brandErr } = await sb
          .from('brands')
          .insert({ name: brand_name.trim(), slug: slugify(brand_name.trim()) })
          .select('id')
          .single();
        if (brandErr) throw brandErr;
        finalBrandId = newBrand.id;
      }
    }

    const payload = {
      name,
      slug,
      description: description || null,
      price,
      compare_price: compare_price || null,
      stock: stock || 0,
      is_featured: is_featured || false,
      is_bestseller: is_bestseller || false,
      is_active: is_active !== false,
      weight: weight || null,
      servings: servings || null,
      protein_per_serving: protein_per_serving || null,
      carbs_per_serving: carbs_per_serving || null,
      fat_per_serving: fat_per_serving || null,
      energy_per_serving: energy_per_serving || null,
      ingredients: ingredients || null,
      usage_instructions: usage_instructions || null,
      category_id: finalCategoryId,
      brand_id: finalBrandId,
    };

    let productId = editId;

    if (editId) {
      const { error } = await sb.from('products').update(payload).eq('id', editId);
      if (error) throw error;
    } else {
      const { data: newProd, error } = await sb.from('products').insert(payload).select().single();
      if (error) throw error;
      productId = newProd.id;
    }

    // Sync flavours
    if (productId) {
      await sb.from('product_flavours').delete().eq('product_id', productId);
      if (flavourList?.length) {
        await sb.from('product_flavours').insert(
          flavourList.map((fname: string) => ({ product_id: productId, name: fname }))
        );
      }

      // Sync sizes
      await sb.from('product_sizes').delete().eq('product_id', productId);
      if (sizeList?.length) {
        await sb.from('product_sizes').insert(
          sizeList.map((sname: string) => ({ product_id: productId, name: sname }))
        );
      }
    }

    return NextResponse.json({ id: productId, success: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to save product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products — delete a product
export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sb = getAdminSupabase();
    const { id } = await req.json();
    const { error } = await sb.from('products').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to delete product' },
      { status: 500 }
    );
  }
}
