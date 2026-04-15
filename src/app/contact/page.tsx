'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-40 pb-20 container mx-auto px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-12 shadow-xl shadow-primary/5">
          <h1 className="text-4xl font-heading font-bold mb-6 text-center">Get in Touch</h1>
          <p className="text-muted-foreground text-center mb-10">Have questions about our purity standards? We&apos;re here to help.</p>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input placeholder="First Name" className="rounded-full h-12" />
              <Input placeholder="Last Name" className="rounded-full h-12" />
            </div>
            <Input placeholder="Email Address" type="email" className="rounded-full h-12" />
            <Textarea placeholder="How can we help?" className="rounded-[1.5rem] min-h-[150px]" />
            <Button className="w-full rounded-full h-14 bg-primary text-white text-lg font-bold">Send Message</Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
