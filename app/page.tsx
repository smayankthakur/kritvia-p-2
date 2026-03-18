import Hero from "./components/sections/Hero";
import SocialProof from "./components/sections/SocialProof";
import Problem from "./components/sections/Problem";
import Solution from "./components/sections/Solution";
import AIDemo from "./components/sections/AIDemo";
import Features from "./components/sections/Features";
import HowItWorks from "./components/sections/HowItWorks";
import UseCases from "./components/sections/UseCases";
import Pricing from "./components/sections/Pricing";
import CTA from "./components/sections/CTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <SocialProof />
      <Problem />
      <Solution />
      <AIDemo />
      <Features />
      <HowItWorks />
      <UseCases />
      <Pricing />
      <CTA />
    </div>
  );
}