import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
const gainerImg = "/assets/mass_gainer_bag_1768913244480.png";

export function MassGainerSection() {
    return (
        <section className="py-24 bg-red-600 relative overflow-hidden text-white">
            {/* Dynamic Background Stripes */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-20 bg-black -skew-y-3 transform origin-top-left" />
                <div className="absolute bottom-0 right-0 w-full h-40 bg-black -skew-y-3 transform origin-bottom-right" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 bg-black px-6 py-2 rounded-full border border-white/20">
                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold tracking-widest uppercase text-sm">High Impact Formula</span>
                    </div>

                    <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">
                        Massive <br />
                        <span className="text-black text-stroke-white">Gains</span>
                    </h2>

                    <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto text-white/90">
                        Stop compromising. Pack on serious size with our calorie-dense, protein-rich mass gainer matrix.
                    </p>

                    <div className="relative w-full max-w-[500px] aspect-square mx-auto my-12">
                        <div className="absolute inset-0 bg-black/30 rounded-full blur-[100px] -z-10" />
                        <img
                            src={gainerImg}
                            alt="Mass Gainer"
                            className="w-full h-full object-contain hover:scale-110 transition-transform duration-300 drop-shadow-[0_50px_50px_rgba(0,0,0,0.5)]"
                        />
                    </div>

                    <Button size="lg" className="bg-white text-red-600 hover:bg-black hover:text-white px-12 h-16 text-xl font-black uppercase tracking-widest rounded-none transform skew-x-[-10deg]">
                        <span className="skew-x-[10deg]">Shop Gainer</span>
                    </Button>
                </div>
            </div>
        </section>
    );
}
