'use client';

import { use } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ImageGallery } from '@/components/product/ImageGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ReviewSection } from '@/components/product/ReviewSection';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { ProductDetailSkeleton } from '@/components/ui/product-skeleton';
import { useProduct } from '@/hooks/use-products';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: product, isLoading, error } = useProduct(slug || '');

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />

      {isLoading && <ProductDetailSkeleton />}

      {error && (
        <div className="container mx-auto px-6 pt-40 pb-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground">This product may have been removed or doesn&apos;t exist.</p>
        </div>
      )}

      {product && (
        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <ImageGallery images={product.images || []} productName={product.name} />
            <ProductInfo product={product} />
          </div>

          {/* Reviews */}
          <div className="mt-20">
            <ReviewSection productId={product.id} reviews={product.reviews || []} />
          </div>

          {/* Related Products */}
          <RelatedProducts categoryId={product.category_id} excludeId={product.id} />
        </div>
      )}

      <Footer />
    </div>
  );
}
