import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-20 pb-10 rounded-t-[3rem] mt-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-heading font-bold">PureScoop</span>
            </div>
            <p className="text-white/60 max-w-sm">
              Empowering your wellness journey with the purest, most effective nutrition on the planet. Purity is our priority.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-lg">Shop</h4>
            <ul className="space-y-2 text-white/60">
              <li><a href="#" className="hover:text-primary transition-colors">Proteins</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Greens & Superfoods</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pre-Workout</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Vitamins</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-lg">Contact Us</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li className="flex items-center gap-2">
                <span className="shrink-0 text-primary">📍</span>
                <span>Greater Noida, India Expo Plaza</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="shrink-0 text-primary">📞</span>
                <a href="tel:+918130297902" className="hover:text-primary transition-colors">+91 8130297902</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="shrink-0 text-primary">✉️</span>
                <a href="mailto:purescoopnutrition@gmail.com" className="hover:text-primary transition-colors">purescoopnutrition@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm">
            © 2026 Pure Scoop Nutrition. All rights reserved.
          </p>
          
          <div className="flex w-full md:w-auto max-w-sm gap-2">
             <Input 
               placeholder="Subscribe for updates" 
               className="bg-white/5 border-white/10 text-white rounded-full h-12 focus:ring-primary focus:border-primary" 
             />
             <Button className="rounded-full bg-primary hover:bg-primary/90 text-white h-12 px-6">
               Join
             </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
