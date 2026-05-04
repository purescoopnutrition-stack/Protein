'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { ProductSection } from "@/components/home/ProductSection";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/home/AboutSection";
import { ReviewSection } from "@/components/home/ReviewSection";
import { MapSection } from "@/components/home/MapSection";
import { SectionSkeleton } from '@/components/ui/product-skeleton';

export default function HomePage() {
  const { data: homeSections, isLoading } = useQuery({
    queryKey: ['home-sections-display'],
    queryFn: async () => {
      const { data } = await supabase
        .from('home_sections')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-primary/30">
      <Navbar />
      <main>
        <Hero />
        <CategorySection />
        
        <div className="space-y-4">
          {isLoading ? (
            <>
              <SectionSkeleton />
              <SectionSkeleton />
              <SectionSkeleton />
            </>
          ) : homeSections && homeSections.length > 0 ? (
            homeSections.map((section: any) => (
              <ProductSection 
                key={section.id}
                title={section.title}
                categoryId={section.category_id}
                showTabs={section.type === 'tabs'}
                viewAllLink={section.view_all_link}
              />
            ))
          ) : (
            <>
              {/* Fallback/Default sections if no DB configuration exists yet */}
              {/* "All" hot selling with category tabs */}
              <ProductSection
                title="Hot Selling Products"
                isHotSelling={true}
                showTabs={true}
                viewAllLink="/shop"
              />
              {/* Pre-Workout hot selling only */}
              <ProductSection
                title="Hot Selling Pre-Workouts"
                categorySlug="pre-workout"
                isHotSelling={true}
                viewAllLink="/shop?category=pre-workout"
              />
              {/* Gainer products */}
              <ProductSection
                title="Gaining-Zone"
                categorySlug="gainer"
                viewAllLink="/shop?category=gainer"
              />
            </>
          )}
        </div>
      </main>
      <MapSection />
      <AboutSection />
      <ReviewSection />
      <Footer />
    </div>
  );
}
