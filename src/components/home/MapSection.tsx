import { MapPin, Navigation, Clock, Phone } from "lucide-react";

export function MapSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm">Locate Us</h2>
              <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground leading-tight">
                Visit Our Store in <br />
                <span className="text-primary">Greater Noida</span>
              </h3>
            </div>

            <div className="grid gap-8">
              <div className="flex gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">Our Address</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    India Expo Plaza, <br />
                    Knowledge Park II, Greater Noida, <br />
                    Uttar Pradesh 201310
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">Opening Hours</h4>
                  <p className="text-muted-foreground">Monday - Sunday: 10:00 AM - 9:00 PM</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">Contact Us</h4>
                  <p className="text-muted-foreground">+91 8130297902</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
               <a 
                href="https://www.google.com/maps/dir//Pure+Scoop+Nutrition/@28.4579543,77.4995113,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x390cc18424b8939d:0x2fc39ace541ff74d!2m2!1d77.4995113!2d28.4579543" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
               >
                 <Navigation className="w-5 h-5" />
                 Get Directions
               </a>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] rotate-2" />
            <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl h-[450px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.7165761473966!2d77.49693637519661!3d28.457958991987375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cc18424b8939d%3A0x2fc39ace541ff74d!2sPure%20Scoop%20Nutrition!5e0!3m2!1sen!2sin!4v1776245451568!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
