import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
const greenTub = "/assets/green_superfood_tub_mockup.png";
const pinkPouch = "/assets/pink_berry_protein_pouch.png";
const whiteTub = "/assets/premium_vanilla_protein_tub_mockup.png";

export function ProductGrid() {
  const [activeTab, setActiveTab] = ["Popular Product", () => { }]; // simplified for now

  const categories = [
    "Popular Product",
    "Recent Product",
    "Upcoming Product",
    "Best Sellers"
  ];

  const products = [
    {
      id: 1,
      name: "Pure Whey Isolate",
      flavor: "Vanilla Bean",
      price: "$49.99",
      image: whiteTub,
      tag: "Best Seller"
    },
    {
      id: 2,
      name: "Organic Supergreens",
      flavor: "Mint & Lime",
      price: "$39.99",
      image: greenTub,
      tag: "New Arrival"
    },
    {
      id: 3,
      name: "Berry Recovery",
      flavor: "Wild Strawberry",
      price: "$44.99",
      image: pinkPouch,
      tag: "Limited Edition"
    },
    {
      id: 4,
      name: "Plant Protein",
      flavor: "Chocolate Fudge",
      price: "$54.99",
      image: whiteTub,
      tag: null
    }
  ];

  return (
    <section className="py-24 bg-white" id="shop">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-heading font-black mb-8 text-foreground">Our Product</h2>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12 border-b border-muted overflow-x-auto pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`text-base md:text-lg font-bold transition-all relative pb-2 whitespace-nowrap ${cat === categories[0] ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {cat}
                {cat === categories[0] && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">

              {/* Tag */}
              {product.tag && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider">
                  {product.tag}
                </div>
              )}

              {/* Image Area */}
              <div className="relative aspect-square mb-6 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-secondary/10 rounded-2xl group-hover:scale-105 transition-transform duration-500" />
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-3/4 h-3/4 object-contain z-10 group-hover:-translate-y-2 transition-transform duration-500 drop-shadow-md"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground font-medium">{product.flavor}</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{product.name}</h3>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-xl font-bold text-foreground">{product.price}</span>
                  <Button size="icon" className="rounded-full bg-black text-white hover:bg-primary transition-colors h-10 w-10">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button variant="outline" size="lg" className="rounded-full px-10 h-14 border-2 text-base font-bold hover:bg-black hover:text-white transition-colors">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
