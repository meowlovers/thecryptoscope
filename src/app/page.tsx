import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import MarketOverview from "@/components/home/MarketOverview";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import PricingSection from "@/components/home/PricingSection";
import PromiseSection from "@/components/home/PromiseSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <MarketOverview />
        <HowItWorksSection />
        <BenefitsSection />
        <PricingSection />
        <PromiseSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
