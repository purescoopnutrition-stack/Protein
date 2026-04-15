import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Minus, Plus, Star } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import type { ProductWithRelations } from '@/lib/supabase-types';

interface ProductInfoProps {
  product: ProductWithRelations;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]?.name || '');
  const [selectedFlavour, setSelectedFlavour] = useState(product.flavours?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.name || '');
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const variant = product.variants?.find((v) => v.name === selectedVariant);
  const displayPrice = variant?.price ? Number(variant.price) : Number(product.price);
  const comparePrice = variant?.compare_price ? Number(variant.compare_price) : product.compare_price ? Number(product.compare_price) : null;
  const discount = comparePrice && comparePrice > displayPrice
    ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100)
    : 0;

  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  const mainImage = product.images?.sort((a, b) => a.position - b.position)[0];

  function handleAddToCart() {
    addItem({
      productId: product.id,
      productName: product.name,
      image: mainImage?.url || '',
      price: displayPrice,
      comparePrice: comparePrice ?? undefined,
      quantity: qty,
      variant: selectedVariant || undefined,
      flavour: selectedFlavour || undefined,
      size: selectedSize || undefined,
    });
    toast.success(`${product.name} added to cart!`);
  }

  return (
    <div className="space-y-6">
      {/* Brand & Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {product.brand && (
          <Badge variant="secondary" className="text-xs font-bold uppercase tracking-wider">
            {product.brand.name}
          </Badge>
        )}
        {product.is_bestseller && (
          <Badge className="bg-amber-100 text-amber-800 text-xs">🔥 Bestseller</Badge>
        )}
        {product.is_featured && (
          <Badge className="bg-purple-100 text-purple-800 text-xs">⭐ Featured</Badge>
        )}
        {discount > 0 && (
          <Badge className="bg-red-100 text-red-700 text-xs">{discount}% OFF</Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      {avgRating && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {avgRating} ({product.reviews?.length} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-foreground">₹{displayPrice.toLocaleString('en-IN')}</span>
        {comparePrice && comparePrice > displayPrice && (
          <span className="text-lg text-muted-foreground line-through">₹{comparePrice.toLocaleString('en-IN')}</span>
        )}
      </div>

      {/* Description */}
      {product.short_description && (
        <p className="text-muted-foreground leading-relaxed">{product.short_description}</p>
      )}

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-2">
          <Label>Variant</Label>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                  selectedVariant === v.name
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 text-foreground'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Flavours */}
      {product.flavours && product.flavours.length > 0 && (
        <div className="space-y-2">
          <Label>Flavour</Label>
          <div className="flex flex-wrap gap-2">
            {product.flavours.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFlavour(f.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                  selectedFlavour === f.name
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 text-foreground'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-2">
          <Label>Size</Label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSize(s.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                  selectedSize === s.name
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 text-foreground'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Qty + Add to Cart */}
      <div className="flex items-center gap-4 pt-4">
        <div className="flex items-center border-2 border-border rounded-full overflow-hidden">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-none" onClick={() => setQty(Math.max(1, qty - 1))}>
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center font-bold text-lg">{qty}</span>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-none" onClick={() => setQty(qty + 1)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="flex-1 h-14 rounded-full bg-primary text-white text-base font-bold shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>

      {/* Stock Status */}
      <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </p>

      {/* Description */}
      {product.description && (
        <div className="pt-6 border-t">
          <h3 className="text-lg font-bold mb-3">Description</h3>
          <div className="text-muted-foreground prose prose-sm max-w-none whitespace-pre-line">
            {product.description}
          </div>
        </div>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{children}</p>;
}
