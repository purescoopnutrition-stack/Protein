import { ArrowRight } from "lucide-react";
import Link from "next/link";
const proteinImg = "/assets/protein_tub_gold_1768913186005.png";
const vitaminImg = "/assets/vitamin_wellness_bottles_1768913214027.png";
const gainerImg = "/assets/mass_gainer_bag_1768913244480.png";
const accessoriesImg = "/assets/gym_accessories_gear_1768914209920.png";

export function CategoryGrid() {
    const categories = [
        {
            id: "protein",
            name: "Proteins",
            image: proteinImg,
            desc: "Premium Wheys & Isolates",
            colSpan: "col-span-1 md:col-span-2 row-span-2",
            theme: "dark",
            href: "/shop?category=whey-protein"
        },
        {
            id: "vitamins",
            name: "Vitamins",
            image: vitaminImg,
            desc: "Daily Wellness Essentials",
            colSpan: "col-span-1",
            theme: "light",
            href: "/shop?category=multivitamin"
        },
        {
            id: "gainer",
            name: "Mass Gainers",
            image: gainerImg,
            desc: "High Calorie Formulas",
            colSpan: "col-span-1",
            theme: "dark",
            href: "/shop?category=gainer"
        },
        {
            id: "accessories",
            name: "Accessories",
            image: accessoriesImg,
            desc: "Gear Up for Success",
            colSpan: "col-span-1 md:col-span-2",
            theme: "light",
            href: "/shop?category=others"
        }
    ];

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-heading font-black mb-12 text-center">Shop by Category</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
                    {categories.map((cat) => (
                        <Link
                            href={cat.href}
                            key={cat.id}
                            className={`group relative rounded-3xl overflow-hidden cursor-pointer ${cat.colSpan}`}
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${cat.image})` }}
                            />

                            {/* Overlay Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${cat.theme === 'dark' ? 'from-black/90 via-black/20' : 'from-white/90 via-white/20'} to-transparent`} />

                            {/* Content */}
                            <div className={`absolute bottom-0 left-0 p-8 w-full ${cat.theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                <h3 className="text-3xl font-heading font-bold mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    {cat.name}
                                </h3>
                                <p className={`font-medium mb-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 ${cat.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {cat.desc}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    Shop Now <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
