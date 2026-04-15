import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
const vitaminImg = "/assets/vitamin_wellness_bottles_1768913214027.png";

export function FeaturedVitamins() {
    return (
        <section className="py-32 bg-[#F9FAFB] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-full h-full opacity-[0.03]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="leaf-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M25 50c-13.8 0-25-11.2-25-25S11.2 0 25 0s25 11.2 25 25-11.2 25-25 25z" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
                </svg>
            </div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    {/* Visuals */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src={vitaminImg}
                                alt="Daily Wellness Vitamins"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                            />

                            {/* Floating Cards */}
                            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl animate-in fade-in slide-in-from-right duration-1000 delay-300">
                                <span className="text-4xl">🌿</span>
                                <p className="font-bold text-sm mt-2 text-gray-800">100% Vegan</p>
                            </div>

                            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl animate-in fade-in slide-in-from-left duration-1000 delay-500">
                                <span className="text-4xl text-green-500 font-black">A+</span>
                                <p className="font-bold text-sm mt-2 text-gray-800">Quality Rated</p>
                            </div>
                        </div>

                        {/* Abstract Blob behind */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-100 rounded-full blur-3xl opacity-60" />
                    </div>

                    {/* Content */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <h2 className="text-sm font-bold tracking-[0.2em] text-green-600 uppercase">Daily Wellness</h2>
                        <h3 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 leading-tight">
                            Your Daily Dose of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">Natural Vitality</span>
                        </h3>

                        <p className="text-xl text-gray-500 leading-relaxed">
                            Support your immune system and overall health with our clinically backed multivitamin blends. Crafted from nature's finest ingredients.
                        </p>

                        <div className="grid grid-cols-2 gap-8 pt-4">
                            {[
                                { label: "Immunity", val: "100%" },
                                { label: "Energy", val: "Boost" },
                                { label: "Focus", val: "Sharp" },
                                { label: "Stress", val: "Relief" }
                            ].map((stat, i) => (
                                <div key={i} className="border-l-4 border-green-400 pl-4">
                                    <div className="text-2xl font-black text-gray-900">{stat.val}</div>
                                    <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <Button className="mt-8 rounded-full bg-black text-white px-8 h-14 text-lg hover:bg-gray-800">
                            Explore Wellness <ArrowUpRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
