import Hero from "./components/sections/Hero";
import Problem from "./components/sections/Problem";
import Solution from "./components/sections/Solution";
import HowItWorks from "./components/sections/HowItWorks";
import Features from "./components/sections/Features";
import UseCases from "./components/sections/UseCases";
import AIDemo from "./components/sections/AIDemo";
import SocialProof from "./components/sections/SocialProof";
import CTA from "./components/sections/CTA";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <UseCases />
      <AIDemo />
      <SocialProof />
      <CTA />
      <Footer />
    </div>
  );
}
