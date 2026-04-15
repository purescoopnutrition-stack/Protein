import { useState } from 'react';
import type { ProductImage } from '@/lib/supabase-types';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const sorted = [...images].sort((a, b) => a.position - b.position);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeImage = sorted[activeIdx] || sorted[0];

  if (!sorted.length) {
    return (
      <div className="aspect-square rounded-3xl bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No Image</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square rounded-3xl bg-white border border-border/50 overflow-hidden flex items-center justify-center shadow-sm">
        <img
          src={activeImage.url}
          alt={activeImage.alt_text || productName}
          className="w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sorted.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(idx)}
              className={`w-20 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${
                idx === activeIdx
                  ? 'border-primary shadow-md shadow-primary/20'
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt_text || `${productName} ${idx + 1}`}
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
