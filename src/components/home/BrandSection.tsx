import { motion } from "framer-motion";

const brands = [
    {
        name: "MuscleBlaze",
        logoColor: "bg-black",
        textColor: "text-white",
        description: "Peak Performance"
    },
    {
        name: "bGreen",
        logoColor: "bg-[#9bc791]",
        textColor: "text-[#2d5a27]",
        description: "Plant Based Power"
    },
    {
        name: "Fit Foods",
        logoColor: "bg-[#e5ae67]",
        textColor: "text-[#4a3219]",
        description: "Clean Nutrition"
    },
    {
        name: "Z Verse",
        logoColor: "bg-black",
        textColor: "text-white",
        description: "Future of Fitness"
    }
];

export function BrandSection() {
    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-4 mb-16">
                    <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                    <h2 className="text-4xl font-heading font-black tracking-tight text-foreground">
                        Shop by <span className="text-primary italic">Brand</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {brands.map((brand, idx) => (
                        <motion.div
                            key={brand.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                            className={`group relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ${brand.logoColor}`}
                        >
                            {/* Subtle Texture/Pattern Overlay */}
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id={`pattern-${idx}`} width="40" height="40" patternUnits="userSpaceOnUse">
                                            <path d="M0 40 L40 0 M-10 10 L10 -10 M30 50 L50 30" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill={`url(#pattern-${idx})`} />
                                </svg>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-4 left-4 w-12 h-1 bg-white/20 rounded-full group-hover:w-20 transition-all duration-500" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-black/40 to-transparent">
                                <h3 className={`text-3xl font-heading font-black uppercase tracking-tighter ${brand.textColor} transform group-hover:scale-110 transition-transform duration-500`}>
                                    {brand.name}
                                </h3>
                                <p className={`text-xs font-bold uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ${brand.textColor}`}>
                                    {brand.description}
                                </p>
                            </div>

                            {/* Border Glow on Hover */}
                            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-2xl transition-all duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
