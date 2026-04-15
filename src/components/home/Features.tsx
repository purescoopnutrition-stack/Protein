import { Leaf, Award, Zap, ShieldCheck } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Leaf className="w-6 h-6 text-primary" />,
      title: "100% Plant-Based",
      desc: "Ethically sourced ingredients from trusted farms."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: "Lab Tested",
      desc: "Triple-tested for purity and potency assurance."
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Fast Absorption",
      desc: "Micronized formulas for instant bioavailability."
    },
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: "Award Winning",
      desc: "Voted #1 Clean Supplement Brand 2024."
    }
  ];

  return (
    <section className="py-20 bg-white" id="science">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
