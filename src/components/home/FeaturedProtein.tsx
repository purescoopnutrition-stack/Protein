import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
const proteinImg = "/assets/protein_tub_gold_1768913186005.png";

export function FeaturedProtein() {
    return (
        <section className="py-24 bg-black text-white overflow-hidden relative">
            {/* Background radial glow */}
            <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Image Side */}
                    <div className="relative order-2 lg:order-1 flex justify-center">
                        <div className="relative z-10 w-full max-w-[600px]">
                            <img
                                src={proteinImg}
                                alt="Premium Gold Standard Whey"
                                className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Decorative Circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square rounded-full border border-white/10 z-0 scale-90" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full border border-primary/20 z-0" />
                    </div>

                    {/* Content Side */}
                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase mb-4">
                            Best Seller
                        </div>

                        <h2 className="text-5xl md:text-7xl font-heading font-black leading-[1.1]">
                            GOLD STANDARD <br />
                            <span className="text-primary">ISOLATE WHEY</span>
                        </h2>

                        <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                            Unlock your full potential with our purest protein formula. Engineered for rapid absorption and maximum muscle recovery.
                            Zero filters, just pure performance.
                        </p>

                        <div className="space-y-4 pt-4">
                            {[
                                "25g Protein Per Serving",
                                "5.5g BCAAs for Recovery",
                                "Zero Added Sugar",
                                "Hydrolyzed & Ultra-Filtered"
                            ].map((feature) => (
                                <div key={feature} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                                    <span className="text-lg font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 flex flex-wrap gap-4">
                            <Button size="lg" className="bg-primary text-black hover:bg-white text-base font-bold px-10 h-14 rounded-full">
                                Buy Now - $59.99
                            </Button>
                            <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 text-base font-bold px-10 h-14 rounded-full">
                                View Details <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
