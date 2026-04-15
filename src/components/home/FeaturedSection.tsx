import { Button } from '@/components/ui/button';
import { Plus, Star, ArrowRight } from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/use-products';
import { useCartStore } from '@/store/cart-store';
import { ProductGridSkeleton } from '@/components/ui/product-skeleton';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function FeaturedSection() {
  const { data: products, isLoading } = useFeaturedProducts();
  const addItem = useCartStore((s) => s.addItem);

  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <section className="py-24 bg-white" id="featured">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
          <h2 className="text-4xl font-heading font-black tracking-tight text-foreground">
            Featured <span className="text-primary italic">Products</span>
          </h2>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.slice(0, 8).map((product, idx) => {
              const img = product.images?.sort((a, b) => a.position - b.position)[0];
              const discount = product.compare_price && Number(product.compare_price) > Number(product.price)
                ? Math.round(((Number(product.compare_price) - Number(product.price)) / Number(product.compare_price)) * 100)
                : 0;
              const avgRating = product.reviews?.length
                ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
                : 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                >
                  {discount > 0 && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                      {discount}% OFF
                    </div>
                  )}
                  {product.is_bestseller && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                      🔥 Bestseller
                    </div>
                  )}

                  <Link href={`/product/${product.slug}`}>
                    <div className="relative aspect-square mb-6 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 bg-secondary/10 rounded-2xl group-hover:scale-105 transition-transform duration-500" />
                      {img ? (
                        <img src={img.url} alt={product.name} className="w-3/4 h-3/4 object-contain z-10 group-hover:-translate-y-2 transition-transform duration-500 drop-shadow-md" />
                      ) : (
                        <div className="text-muted-foreground z-10">No Image</div>
                      )}
                    </div>
                  </Link>

                  <div className="space-y-2">
                    {product.brand && (
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{product.brand.name}</span>
                    )}
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer truncate">
                        {product.name}
                      </h3>
                    </Link>

                    {avgRating > 0 && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">({product.reviews?.length})</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-foreground">₹{Number(product.price).toLocaleString('en-IN')}</span>
                        {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                          <span className="text-sm text-muted-foreground line-through">₹{Number(product.compare_price).toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <Button
                        size="icon"
                        className="rounded-full bg-black text-white hover:bg-primary transition-colors h-10 w-10"
                        onClick={() => {
                          addItem({
                            productId: product.id,
                            productName: product.name,
                            image: img?.url || '',
                            price: Number(product.price),
                            comparePrice: product.compare_price ? Number(product.compare_price) : undefined,
                          });
                          toast.success(`${product.name} added to cart!`);
                        }}
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/shop">
            <Button variant="outline" size="lg" className="rounded-full px-10 h-14 border-2 text-base font-bold hover:bg-black hover:text-white transition-colors">
              View All Products <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
