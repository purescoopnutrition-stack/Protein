'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Plus, Star, SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { useBrands } from '@/hooks/use-brands';
import { useCartStore } from '@/store/cart-store';
import { ProductGridSkeleton } from '@/components/ui/product-skeleton';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { useSearchParams } from 'next/navigation';


export default function Shop() {
  const searchParams = useSearchParams();
  const initialCategorySlug = searchParams.get('category');
  
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [brandId, setBrandId] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<'price_asc' | 'price_desc' | 'newest' | 'popularity'>('newest');

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: products, isLoading } = useProducts({
    categoryId,
    brandId,
    minPrice: priceRange[0] || undefined,
    maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
    inStock: inStock || undefined,
    sort,
  });

  // Handle URL category slug
  useEffect(() => {
    if (initialCategorySlug && categories) {
      const cat = categories.find(c => c.slug === initialCategorySlug);
      if (cat) {
        setCategoryId(cat.id);
      }
    }
  }, [initialCategorySlug, categories]);

  const addItem = useCartStore((s) => s.addItem);

  const hasFilters = categoryId || brandId || inStock || priceRange[0] > 0 || priceRange[1] < 10000;

  function clearFilters() {
    setCategoryId(undefined);
    setBrandId(undefined);
    setPriceRange([0, 10000]);
    setInStock(false);
  }

  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Category</h4>
        <div className="space-y-2">
          <button
            onClick={() => setCategoryId(undefined)}
            className={`block w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${!categoryId ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted'}`}
          >
            All Categories
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryId(cat.id)}
              className={`block w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${categoryId === cat.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Brand</h4>
        <div className="space-y-2">
          <button
            onClick={() => setBrandId(undefined)}
            className={`block w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${!brandId ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted'}`}
          >
            All Brands
          </button>
          {brands?.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setBrandId(brand.id)}
              className={`block w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${brandId === brand.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted'}`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={10000}
          step={100}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1] >= 10000 ? '10,000+' : priceRange[1].toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* In Stock */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">In Stock Only</label>
        <Switch checked={inStock} onCheckedChange={setInStock} />
      </div>

      {hasFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full rounded-full">
          <X className="w-4 h-4 mr-2" /> Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20 container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold">Shop</h1>
            <p className="text-muted-foreground mt-1">
              {isLoading ? 'Loading...' : `${products?.length || 0} products`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden rounded-full">
                  <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 p-6 bg-white rounded-2xl border border-border/50 shadow-sm">
              <h3 className="font-bold text-lg mb-6">Filters</h3>
              <FiltersContent />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : products && products.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, idx) => {
                  const img = product.images?.sort((a, b) => a.position - b.position)[0];
                  const discount = product.compare_price && Number(product.compare_price) > Number(product.price)
                    ? Math.round(((Number(product.compare_price) - Number(product.price)) / Number(product.compare_price)) * 100) : 0;
                  const avgRating = product.reviews?.length
                    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length : 0;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.4), duration: 0.4 }}
                      className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                    >
                      {discount > 0 && (
                        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                          {discount}% OFF
                        </div>
                      )}

                      <Link href={`/product/${product.slug}`}>
                        <div className="relative aspect-square mb-6 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden cursor-pointer">
                          <div className="absolute inset-0 bg-secondary/10 rounded-2xl group-hover:scale-105 transition-transform duration-500" />
                          {img ? (
                            <img src={img.url} alt={product.name} className="w-3/4 h-3/4 object-contain z-10 group-hover:-translate-y-2 transition-transform duration-500 drop-shadow-md" />
                          ) : (
                            <div className="text-muted-foreground z-10 text-sm">No Image</div>
                          )}
                        </div>
                      </Link>

                      <div className="space-y-2">
                        {product.brand && (
                          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{product.brand.name}</span>
                        )}
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer truncate">{product.name}</h3>
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
                            <span className="text-xl font-bold">₹{Number(product.price).toLocaleString('en-IN')}</span>
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
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                  <SlidersHorizontal className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
                {hasFilters && (
                  <Button variant="outline" onClick={clearFilters} className="rounded-full">
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
