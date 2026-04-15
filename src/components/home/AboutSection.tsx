import { Shield, Zap, Heart, Award } from "lucide-react";

export function AboutSection() {
  const highlights = [
    {
      icon: Shield,
      title: "100% Purity",
      description: "No fillers, no artificial sweeteners, just pure pharmaceutical-grade nutrition."
    },
    {
      icon: Zap,
      title: "Performance Driven",
      description: "Scientifically formulated to maximize your gains and speed up recovery."
    },
    {
      icon: Heart,
      title: "Health First",
      description: "Clean ingredients that support your long-term health and vitality."
    },
    {
      icon: Award,
      title: "Lab Tested",
      description: "Every batch is third-party tested for safety, potency, and label accuracy."
    }
  ];

  return (
    <section className="py-24 px-4 md:px-10">
      <div className="container mx-auto bg-primary rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/20">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch">
          <div className="p-10 md:p-16 lg:p-20 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-4">
              <h2 className="text-white/80 font-bold tracking-widest uppercase text-sm">Authentic Online Supplement Store</h2>
              <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-white leading-tight">
                Your Trusted Hub for <span className="text-black">100% Genuine Nutrition</span>
              </h3>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-white font-medium leading-relaxed">
                PureScoop is India&apos;s fastest growing nutrition and online supplement store. Based in <span className="underline decoration-black/30 underline-offset-4">Greater Noida, India Expo Plaza</span>, we provide a wide range of products for health, wellness, fitness & bodybuilding.
              </p>
              
              <p className="text-white/80 leading-relaxed max-w-xl">
                We bridge the gap between global brands and your doorstep, making premium nutrition accessible all over India. Our mission is to help India become a fitter and stronger nation by providing quality products you can trust.
              </p>
            </div>

            <div className="grid gap-6 pt-4">
              {[
                {
                  title: "Direct & Authentic",
                  desc: "Products delivered directly from us, certified by brands or official Indian importers."
                },
                {
                  title: "Multi-Brand Excellence",
                  desc: "A vast collection of top International and Indian brands under one roof."
                },
                {
                  title: "Customer First",
                  desc: "Fast delivery and a seamless user experience are our number 1 priorities."
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 items-start">
                  <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{item.title}</h4>
                    <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative bg-black/5 backdrop-blur-md p-10 md:p-16 lg:p-20 flex flex-col justify-center animate-in fade-in slide-in-from-right duration-1000 border-l border-white/10">
            <div className="space-y-10">
              <div className="inline-block px-6 py-2 rounded-full bg-white text-primary text-sm font-bold uppercase tracking-wider shadow-xl">
                Authenticity Guarantee
              </div>
              
              <div className="space-y-6">
                <p className="text-2xl font-heading font-bold text-white leading-snug">
                  PureScoop is the online supplement store that truly <span className="text-black italic">guarantees authenticity</span>.
                </p>
                <p className="text-white/80 text-lg leading-relaxed">
                  When purchasing from our website, you never have to worry about receiving harmful substances. We ensure the entire supply chain is controlled, so you can be 100% confident in what you get.
                </p>
              </div>
              
              <div className="pt-6 grid grid-cols-2 gap-4">
                <div className="p-6 rounded-[2rem] bg-white/10 border border-white/10 text-center">
                  <p className="text-3xl font-black text-white">100%</p>
                  <p className="text-xs uppercase font-bold text-white/60 tracking-widest mt-1">Genuine</p>
                </div>
                <div className="p-6 rounded-[2rem] bg-white/10 border border-white/10 text-center">
                  <p className="text-3xl font-black text-white">FAST</p>
                  <p className="text-xs uppercase font-bold text-white/60 tracking-widest mt-1">Shipping</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
}
