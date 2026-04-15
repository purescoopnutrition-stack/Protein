import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <Skeleton className="aspect-square rounded-2xl mb-6" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-6 pt-32 pb-20">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-20 rounded-full" />
            <Skeleton className="h-10 w-20 rounded-full" />
            <Skeleton className="h-10 w-20 rounded-full" />
          </div>
          <Skeleton className="h-14 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BrandSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[16/9] rounded-2xl" />
      ))}
    </div>
  );
}
export function SectionSkeleton() {
  return (
    <section className="py-12 border-b border-gray-50 last:border-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-20" />
        </div>
        <ProductGridSkeleton count={4} />
      </div>
    </section>
  );
}
