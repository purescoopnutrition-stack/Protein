'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/ui/product-skeleton';
import Link from 'next/link';
import { useState } from 'react';

interface ProductSectionProps {
  title: string;
  categoryId?: string;
  isBestseller?: boolean;
  isFeatured?: boolean;
  limit?: number;
  viewAllLink?: string;
  showTabs?: boolean;
}

export function ProductSection({ 
  title, 
  categoryId, 
  isBestseller, 
  isFeatured, 
  limit = 4,
  viewAllLink = "/shop",
  showTabs = false
}: ProductSectionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(categoryId);

  const { data: categories } = useQuery({
    queryKey: ['categories-tabs'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*').limit(4);
      return data;
    },
    enabled: showTabs
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['section-products', title, activeCategoryId, isBestseller, isFeatured],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          brand:brands(*),
          images:product_images(*),
          reviews:product_reviews(*)
        `)
        .eq('is_active', true);

      if (activeCategoryId) {
        query = query.eq('category_id', activeCategoryId);
      }
      if (isBestseller) {
        query = query.eq('is_bestseller', true);
      }
      if (isFeatured) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query.limit(limit).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <section className="py-12 border-b border-gray-50 last:border-0">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Link 
            href={viewAllLink}
            className="flex items-center text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Categories Tabs (Optional) */}
        {showTabs && categories && (
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
            {categories.map((cat) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {products?.length === 0 && !isLoading && (
          <div className="py-20 text-center text-gray-400">
            No products found in this section.
          </div>
        )}
      </div>
    </section>
  );
}
