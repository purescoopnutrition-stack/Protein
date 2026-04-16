import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import { useRelatedProducts } from '@/hooks/use-products';
import { ProductCardSkeleton } from '@/components/ui/product-skeleton';

interface RelatedProductsProps {
  categoryId: string | null;
  excludeId: string;
}

export function RelatedProducts({ categoryId, excludeId }: RelatedProductsProps) {
  const { data: products, isLoading } = useRelatedProducts(categoryId, excludeId);
  const addItem = useCartStore((s) => s.addItem);

  if (!categoryId || (!isLoading && !products?.length)) return null;

  return (
    <section className="py-16">
      <h3 className="text-2xl font-heading font-bold mb-8">You May Also Like</h3>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((product) => {
            const img = (product as { images?: { url: string; position: number }[] }).images
              ?.sort((a, b) => a.position - b.position)[0];
            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-square mb-6 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden cursor-pointer">
                    {img ? (
                      <img
                        src={img.url}
                        alt={product.name}
                        className="w-3/4 h-3/4 object-contain z-10 group-hover:-translate-y-2 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-muted-foreground text-sm">No Image</div>
                    )}
                  </div>
                </Link>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-bold">₹{Number(product.price).toLocaleString('en-IN')}</span>
                    <Button
                      asChild
                      size="icon"
                      className="rounded-full bg-black text-white hover:bg-primary h-10 w-10"
                    >
                      <Link href={`/product/${product.slug}`}>
                        <Plus className="w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
