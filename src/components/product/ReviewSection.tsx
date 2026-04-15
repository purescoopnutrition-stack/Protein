import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useState } from 'react';
import type { Review } from '@/lib/supabase-types';

const reviewSchema = z.object({
  customer_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  rating: z.number().min(1, 'Select a rating').max(5),
  comment: z.string().min(5, 'Write at least 5 characters'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
}

export function ReviewSection({ productId, reviews }: ReviewSectionProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const approvedReviews = reviews.filter((r) => r.is_approved);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { customer_name: '', email: '', rating: 0, comment: '' },
  });

  const ratingValue = watch('rating');

  async function onSubmit(data: ReviewFormData) {
    try {
      const { error } = await supabase.from('reviews').insert({
        product_id: productId,
        customer_name: data.customer_name,
        email: data.email || null,
        rating: data.rating,
        comment: data.comment,
        is_approved: false,
      });
      if (error) throw error;
      toast.success('Review submitted! It will appear after moderation.');
      reset();
      setHoveredStar(0);
    } catch {
      toast.error('Failed to submit review.');
    }
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-heading font-bold">Customer Reviews</h3>

      {/* Existing Reviews */}
      {approvedReviews.length > 0 ? (
        <div className="space-y-4">
          {approvedReviews.map((review) => (
            <div key={review.id} className="p-5 bg-white rounded-2xl border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {review.customer_name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No reviews yet. Be the first to review!</p>
      )}

      {/* Submit Review Form */}
      <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
        <h4 className="font-bold text-lg mb-4">Write a Review</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Star Rating */}
          <div>
            <p className="text-sm font-medium mb-2">Rating *</p>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHoveredStar(i + 1)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setValue('rating', i + 1, { shouldValidate: true })}
                >
                  <Star
                    className={`w-7 h-7 cursor-pointer transition-colors ${
                      i < (hoveredStar || ratingValue)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 hover:text-amber-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Input placeholder="Your Name *" {...register('customer_name')} className="rounded-xl h-11" />
              {errors.customer_name && <p className="text-xs text-red-500 mt-1">{errors.customer_name.message}</p>}
            </div>
            <div>
              <Input placeholder="Email (optional)" {...register('email')} className="rounded-xl h-11" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <Textarea placeholder="Your review *" {...register('comment')} className="rounded-xl min-h-[100px]" />
            {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="rounded-full bg-primary text-white px-8 h-11">
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </div>
    </div>
  );
}
