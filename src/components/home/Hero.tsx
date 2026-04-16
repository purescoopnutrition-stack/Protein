import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
const bgImage = "/assets/homepage-bg.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[110vh] flex items-center pt-24 pb-48 overflow-hidden bg-background">
      {/* Background Image Layer - All Devices */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 1
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50 z-[1]" />
      </div>

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10 w-full h-[110vh]">
        {/* Text Content */}
        <div className="space-y-8 max-w-xl animate-in slide-in-from-bottom-10 fade-in duration-1000 mt-[-10vh]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-white/90">New Formulation 2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold leading-[1.1] text-white drop-shadow-md text-balance">
            Purity is <span className="text-primary italic">Priority</span>.
          </h1>

          <p className="text-lg text-white/90 leading-relaxed max-w-md drop-shadow-sm font-medium">
            Step into a world of pure nutrition. Our clean, science-backed supplements are designed to fuel your peak performance and daily wellness.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="rounded-md px-10 h-14 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105 uppercase tracking-wider">
              <Link href="/shop">
                SHOP THE SALE
              </Link>
            </Button>
          </div>
        </div>

        {/* Right side space reserved to maintain layout on desktop */}
        <div className="hidden md:block" />
      </div>

      {/* Curved Wave Separator */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-20">
        <svg className="relative block w-full h-[80px] md:h-[150px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" className="fill-white"></path>
        </svg>
      </div>
    </section>
  );
}
