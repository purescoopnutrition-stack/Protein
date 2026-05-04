'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ProductCard } from './ProductCard';
import { ChevronRight } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/ui/product-skeleton';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ProductSectionProps {
  title: string;
  categoryId?: string;
  isBestseller?: boolean;
  isFeatured?: boolean;
  isHotSelling?: boolean;
  limit?: number;
  viewAllLink?: string;
  showTabs?: boolean;
}

export function ProductSection({
  title,
  categoryId,
  isBestseller,
  isFeatured,
  isHotSelling,
  limit = 8,
  viewAllLink = '/shop',
  showTabs = false,
}: ProductSectionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(categoryId);

  // Build base "hot selling" condition — used for both products query AND tab categories
  const hotSellingFilter = isHotSelling || isBestseller;

  // Fetch categories that have at least one hot-selling product (for smart tabs)
  const { data: tabCategories } = useQuery({
    queryKey: ['categories-with-hot', hotSellingFilter],
    queryFn: async () => {
      if (!hotSellingFilter) {
        // Return all categories (limited) for non-hot sections
        const { data } = await supabase.from('categories').select('*').limit(6);
        return data || [];
      }
      // Only show categories that actually have hot selling products
      const { data: hotProducts } = await supabase
        .from('products')
        .select('category_id, category:categories(id, name, slug)')
        .eq('is_active', true)
        .eq('is_bestseller', true)
        .not('category_id', 'is', null);

      if (!hotProducts || hotProducts.length === 0) return [];

      // Deduplicate by category id
      const seen = new Set<string>();
      const uniqueCats: { id: string; name: string; slug: string }[] = [];
      for (const p of hotProducts) {
        const cat = p.category as any;
        if (cat && !seen.has(cat.id)) {
          seen.add(cat.id);
          uniqueCats.push({ id: cat.id, name: cat.name, slug: cat.slug });
        }
      }
      return uniqueCats;
    },
    enabled: showTabs,
  });

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['section-products', title, activeCategoryId, isBestseller, isFeatured, isHotSelling],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug),
          brand:brands(id, name, slug, logo_url),
          images:product_images(id, url, alt_text, position),
          flavours:product_flavours(id, name),
          sizes:product_sizes(id, name)
        `)
        .eq('is_active', true);

      if (activeCategoryId) {
        query = query.eq('category_id', activeCategoryId);
      }
      if (isHotSelling || isBestseller) {
        query = query.eq('is_bestseller', true);
      }
      if (isFeatured) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query
        .limit(limit)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[ProductSection] query error:', error);
        throw error;
      }
      return data || [];
    },
  });

  return (
    <section className="py-12 border-b border-gray-50 last:border-0">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Link
            href={viewAllLink}
            className="flex items-center text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Category Tabs (smart — only shown when showTabs=true and categories exist) */}
        {showTabs && tabCategories && tabCategories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setActiveCategoryId(undefined)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                !activeCategoryId
                  ? 'bg-[#1A232E] text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              All
            </button>
            {tabCategories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeCategoryId === cat.id
                    ? 'bg-[#1A232E] text-white shadow-lg'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-400 text-sm">
            No products found in this section.
          </div>
        )}
      </div>
    </section>
  );
}
