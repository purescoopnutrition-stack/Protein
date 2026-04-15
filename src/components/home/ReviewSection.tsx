'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const REVIEWS = [
  {
    id: 1,
    name: "Sunil Panwar",
    initial: "S",
    rating: 5,
    text: "Visited the new store in Greater Noida and was impressed! The prices are very competitive, and they have a great range of products. Ashish, the owner, was extremely helpful and knowledgeable - he took the time to explain each product in detail, making it easy for me to make an informed decision. Highly recommended!",
    date: "6 months ago"
  },
  {
    id: 2,
    name: "Vansh Rai",
    initial: "V",
    rating: 5,
    text: "I had a great experience with this supplement shop. The products are original, well-packed, and delivered on time. The staff is knowledgeable and helped me choose the right supplement according to my needs. Prices are reasonable compared to other stores. Highly recommended for anyone serious about fitness and health.",
    date: "2 months ago"
  },
  {
    id: 3,
    name: "Prawasini Singh",
    initial: "P",
    rating: 5,
    text: "Most reliable supplement shop in Greater Noida. happy to find it nearby. Owner suggests most suitable product as per my requirement.",
    date: "5 months ago"
  },
  {
    id: 4,
    name: "Ashish Kumar",
    initial: "A",
    rating: 5,
    text: "Best place for authentic supplements in Greater Noida. The owner is very helpful and suggests products based on your goals rather than just selling.",
    date: "1 month ago"
  }
];

export function ReviewSection() {
  const mapLink = "https://www.google.com/maps/place/Pure+Scoop+Nutrition/@28.4579543,77.4995113,17z/data=!4m8!3m7!1s0x390cc18424b8939d:0x2fc39ace541ff74d!8m2!3d28.4579543!4d77.4995113!9m1!1b1!16s%2Fg%2F11y01bslym";
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: true,
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    }
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-24 bg-[#FDFDFD] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
              What Our Customers Say
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm font-medium text-muted-foreground">4.9/5 based on 200+ Google reviews</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="rounded-full hover:bg-primary hover:text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="rounded-full hover:bg-primary hover:text-white transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {REVIEWS.map((review) => (
              <div key={review.id} className="embla__slide flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 first:pl-0">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between group">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/20">
                        {review.initial}
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-lg text-foreground">{review.name}</h4>
                      <p className="text-muted-foreground leading-relaxed italic">
                        "{review.text}"
                      </p>
                    </div>
                  </div>

                  <a 
                    href={mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between hover:opacity-70 transition-opacity"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Google Review</span>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">{review.date}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
            <a href={mapLink} target="_blank" rel="noopener noreferrer">
              <Button variant="link" className="text-primary font-bold hover:no-underline flex items-center gap-2 mx-auto">
                  Write a review <ChevronRight className="w-4 h-4" />
              </Button>
            </a>
        </div>
      </div>
    </section>
  );
}
