import Hero from "./components/sections/Hero";
<<<<<<< HEAD
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
=======
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
>>>>>>> 8c88b573be037840ce560e58b824b8cff510d717
