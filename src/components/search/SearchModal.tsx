import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import type { Product, ProductImage } from '@/lib/supabase-types';

interface SearchResult extends Product {
  images: ProductImage[];
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, images:product_images(id, url, position)')
        .eq('is_active', true)
        .textSearch('fts', q, { type: 'websearch' })
        .limit(8);

      if (!error) setResults((data as unknown as SearchResult[]) || []);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search, open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 h-auto text-lg p-0"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="w-10 h-10 mb-3 opacity-30" />
              <p className="font-medium">No results found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="py-2">
              {results.map((product) => {
                const img = product.images?.sort((a, b) => a.position - b.position)[0];
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                  >
                    <div className="flex items-center gap-4 px-5 py-3 hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {img ? (
                          <img src={img.url} alt={product.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <Search className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                        {product.short_description && (
                          <p className="text-xs text-muted-foreground truncate">{product.short_description}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm">₹{Number(product.price).toLocaleString('en-IN')}</p>
                        {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                          <p className="text-xs text-muted-foreground line-through">
                            ₹{Number(product.compare_price).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {!loading && !query && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">Start typing to search...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
