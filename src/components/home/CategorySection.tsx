import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
    {
        name: "Whey Protein",
        image: "/assets/categories/whey_protein_300x.avif",
        href: "/shop?category=whey-protein",
        bgColor: "bg-gray-100"
    },
    {
        name: "Weight Gainer",
        image: "/assets/categories/mass_gainer_logo.webp",
        href: "/shop?category=gainer",
        bgColor: "bg-gray-100"
    },
    {
        name: "Fat Burner",
        image: "/assets/categories/Fat_Weight_Loss_300x.avif",
        href: "/shop?category=fat-burner",
        bgColor: "bg-gray-100"
    },
    {
        name: "Pre Workout",
        image: "/assets/categories/Pre_Workout_300x.avif",
        href: "/shop?category=pre-workout",
        bgColor: "bg-gray-100"
    },
    {
        name: "Creatine",
        image: "/assets/categories/creatine_300x.avif",
        href: "/shop?category=creatine",
        bgColor: "bg-gray-100"
    },
    {
        name: "Wellness",
        image: "/assets/categories/wellness_logo.webp",
        href: "/shop?category=wellness",
        bgColor: "bg-gray-100"
    },
    {
        name: "Workout Essentials",
        image: "/assets/categories/essentials_logo.webp",
        href: "/shop?category=others",
        bgColor: "bg-gray-100"
    }
];

export function CategorySection() {
    return (
        <section className="py-20 bg-white border-b border-gray-100 overflow-hidden">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-gray-900 mb-16 relative inline-block">
                   Shop By <span className="text-primary italic">Category</span>
                   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-primary/20 rounded-full" />
                </h2>

                <div className="flex flex-wrap justify-center gap-8 md:gap-14">
                    {categories.map((cat, idx) => (
                        <Link key={cat.name} href={cat.href} className="group flex flex-col items-center gap-6 transition-all duration-500">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ 
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: idx * 0.05 
                                }}
                                viewport={{ once: true }}
                                className={`w-36 h-36 md:w-52 md:h-52 rounded-[2.5rem] flex items-center justify-center p-6 transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] group-hover:bg-white group-hover:-rotate-3 ${cat.bgColor} border-2 border-transparent group-hover:border-primary/30`}
                            >
                                <img 
                                    src={cat.image} 
                                    alt={cat.name} 
                                    className="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-125 drop-shadow-2xl"
                                />
                            </motion.div>
                            <span className="text-sm md:text-lg font-black text-gray-800 uppercase tracking-tighter group-hover:text-primary transition-colors group-hover:scale-110">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
