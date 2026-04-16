import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ProductWithRelations } from '@/lib/supabase-types';

interface ProductFilters {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popularity';
  featured?: boolean;
  bestseller?: boolean;
  limit?: number;
  offset?: number;
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          images:product_images(id, url, alt_text, position),
          variants:product_variants(id, name, price, compare_price, stock),
          flavours:product_flavours(id, name),
          sizes:product_sizes(id, name),
          category:categories(id, name, slug),
          brand:brands(id, name, slug, logo_url)
        `)
        .eq('is_active', true);

      if (filters.categoryId) query = query.eq('category_id', filters.categoryId);
      if (filters.brandId) query = query.eq('brand_id', filters.brandId);
      if (filters.minPrice) query = query.gte('price', filters.minPrice);
      if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
      if (filters.inStock) query = query.gt('stock', 0);
      if (filters.featured) query = query.eq('is_featured', true);
      if (filters.bestseller) query = query.eq('is_bestseller', true);
      if (filters.search) query = query.textSearch('fts', filters.search, { type: 'websearch' });

      // Sort
      switch (filters.sort) {
        case 'price_asc': query = query.order('price', { ascending: true }); break;
        case 'price_desc': query = query.order('price', { ascending: false }); break;
        case 'newest': query = query.order('created_at', { ascending: false }); break;
        case 'popularity': query = query.order('is_bestseller', { ascending: false }); break;
        default: query = query.order('created_at', { ascending: false });
      }

      if (filters.limit) query = query.limit(filters.limit);
      if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 12) - 1);

      const { data, error } = await query;
      if (error) throw error;

      return (data || []) as unknown as ProductWithRelations[];
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(id, url, alt_text, position),
          variants:product_variants(id, name, price, compare_price, stock),
          flavours:product_flavours(id, name),
          sizes:product_sizes(id, name),
          category:categories(id, name, slug),
          brand:brands(id, name, slug, logo_url)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as unknown as ProductWithRelations;
    },
    enabled: !!slug,
  });
}

export function useFeaturedProducts() {
  return useProducts({ featured: true, limit: 8 });
}

export function useBestsellerProducts() {
  return useProducts({ bestseller: true, limit: 8 });
}

export function useRelatedProducts(categoryId?: string | null, excludeId?: string) {
  return useQuery({
    queryKey: ['related-products', categoryId, excludeId],
    queryFn: async () => {
      if (!categoryId) return [];
      let query = supabase
        .from('products')
        .select(`
          *,
          images:product_images(id, url, alt_text, position)
        `)
        .eq('is_active', true)
        .eq('category_id', categoryId)
        .limit(4);

      if (excludeId) query = query.neq('id', excludeId);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!categoryId,
  });
}
