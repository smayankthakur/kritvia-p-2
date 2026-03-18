'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/sections/HeroSection';
import { SocialProofStrip } from '@/components/sections/SocialProofStrip';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { SolutionSection } from '@/components/sections/SolutionSection';
import { AIDemoSection } from '@/components/sections/AIDemoSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { UseCasesSection } from '@/components/sections/UseCasesSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { FinalCTASection } from '@/components/sections/FinalCTASection';

export default function Home() {
  return (
    <div className="bg-[#0B0F19] text-white min-h-screen">
      <HeroSection />
      <SocialProofStrip />
      <ProblemSection />
      <SolutionSection />
      <AIDemoSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <PricingSection />
      <FinalCTASection />
    </div>
  );
}
