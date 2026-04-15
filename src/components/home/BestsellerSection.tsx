import { Button } from '@/components/ui/button';
import { Plus, Star, Flame } from 'lucide-react';
import { useBestsellerProducts } from '@/hooks/use-products';
import { useCartStore } from '@/store/cart-store';
import { ProductGridSkeleton } from '@/components/ui/product-skeleton';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function BestsellerSection() {
  const { data: products, isLoading } = useBestsellerProducts();
  const addItem = useCartStore((s) => s.addItem);

  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <section className="py-24 bg-gradient-to-b from-[#1A1A1A] to-[#0d0d0d] text-white overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-4xl font-heading font-black tracking-tight">
            Best <span className="text-primary italic">Sellers</span>
          </h2>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.slice(0, 8).map((product, idx) => {
              const img = product.images?.sort((a, b) => a.position - b.position)[0];
              const avgRating = product.reviews?.length
                ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
                : 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative aspect-square mb-6 flex items-center justify-center bg-white/5 rounded-2xl overflow-hidden cursor-pointer">
                      {img ? (
                        <img src={img.url} alt={product.name} className="w-3/4 h-3/4 object-contain z-10 group-hover:-translate-y-2 group-hover:scale-105 transition-transform duration-500 drop-shadow-lg" />
                      ) : (
                        <div className="text-white/30">No Image</div>
                      )}
                    </div>
                  </Link>

                  <div className="space-y-2">
                    {product.brand && (
                      <span className="text-xs text-white/50 font-medium uppercase tracking-wider">{product.brand.name}</span>
                    )}
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors cursor-pointer truncate">
                        {product.name}
                      </h3>
                    </Link>

                    {avgRating > 0 && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold">₹{Number(product.price).toLocaleString('en-IN')}</span>
                        {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                          <span className="text-sm text-white/40 line-through">₹{Number(product.compare_price).toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <Button
                        size="icon"
                        className="rounded-full bg-primary text-black hover:bg-white transition-colors h-10 w-10"
                        onClick={() => {
                          addItem({
                            productId: product.id,
                            productName: product.name,
                            image: img?.url || '',
                            price: Number(product.price),
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
      </div>
    </section>
  );
}
