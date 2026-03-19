import Hero from "@/components/sections/Hero";
import KritviaInAction from "@/components/sections/KritviaInAction";
import DashboardPreview from "@/components/sections/DashboardPreview";
import Features from "@/components/sections/Features";
import Architecture from "@/components/sections/Architecture";
import AIDemo from "@/components/sections/AIDemo";
import SocialProof from "@/components/sections/SocialProof";
import PricingSection from "@/components/sections/Pricing";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* 1. Hero Section */}
      <Hero />
      
      {/* 2. Kritvia In Action - See it in action */}
      <KritviaInAction />
      
      {/* 3. Dashboard Preview - Product UI */}
      <DashboardPreview />
      
      {/* 4. Features - What it does */}
      <Features />
      
      {/* 5. Architecture - How it works */}
      <Architecture />
      
      {/* 6. AI Demo - Try it */}
      <AIDemo />
      
      {/* 7. Social Proof - Trust */}
      <SocialProof />
      
      {/* 8. Pricing */}
      <PricingSection />
      
      {/* 9. CTA */}
      <CTA />
    </div>
  );
}
