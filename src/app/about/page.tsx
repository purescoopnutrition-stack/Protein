'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/home/AboutSection";
import { Features } from "@/components/home/Features";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32">
        <AboutSection />
        <Features />
      </div>
      <Footer />
    </div>
  );
}
