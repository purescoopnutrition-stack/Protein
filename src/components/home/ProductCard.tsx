'use client';

import { Star, ShoppingCart, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  
  const mainImage = product.images?.sort((a: any, b: any) => a.position - b.position)[0]?.url || '/assets/placeholder.png';
  const price = Number(product.price);
  const comparePrice = product.compare_price ? Number(product.compare_price) : null;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  
  // Simulated premium price (usually -5% or -10%)
  const premiumPrice = Math.floor(price * 0.95);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      productName: product.name,
      image: mainImage,
      price: price,
      quantity: 1
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      productName: product.name,
      image: mainImage,
      price: price,
      quantity: 1
    });
    openCart();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full group p-4"
    >
      <Link href={`/product/${product.slug}`} className="relative block flex-1">
        {/* Wishlist Button */}
        <button className="absolute top-0 right-0 p-2 z-10 text-gray-400 hover:text-red-500 transition-colors">
          <Heart className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="aspect-square mb-4 flex items-center justify-center relative overflow-hidden bg-gray-50 rounded-lg">
          <img 
            src={mainImage} 
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Rating & Veg Icon */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 bg-teal-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
            {4.5} <Star className="w-2.5 h-2.5 fill-current" />
          </div>
          <div className="border border-green-500 p-0.5 rounded-sm">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          </div>
        </div>

        {/* Product Details */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 h-10 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="space-y-1 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">₹{price.toLocaleString('en-IN')}</span>
            {comparePrice && (
              <>
                <span className="text-xs text-gray-400 line-through">₹{comparePrice.toLocaleString('en-IN')}</span>
                <span className="text-xs text-teal-500 font-bold">{discount}% off</span>
              </>
            )}
          </div>
          
          {/* Premium Price Tag */}
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
            </div>
            <span className="text-[11px] font-medium text-gray-600">
              ₹{premiumPrice.toLocaleString('en-IN')} for Premium Member
            </span>
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button 
          variant="outline" 
          onClick={handleAddToCart}
          className="w-full h-11 border-orange-400 text-orange-400 hover:bg-orange-50 rounded-lg font-bold"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
        <Button 
          onClick={handleBuyNow}
          className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold shadow-lg shadow-orange-500/20"
        >
          Buy Now
        </Button>
      </div>
    </motion.div>
  );
}
