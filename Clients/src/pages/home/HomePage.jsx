import React from "react";
import FeaturesSection from "../../components/cardSection/FeaturesSection";
import HeroSection from "../../components/heroSection/HeroSection";
import WhyChooseUs from "../../components/whChooseUs/WhyChooseUs";
import GetStarted from "../../components/getStarted/GetStarted";
import FAQSection from "../../components/Faq/FAQSection";
import PlansPreview from "@/components/preview/PlanPreview";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <PlansPreview />
      <FeaturesSection />
      <WhyChooseUs />
      <GetStarted />
      <FAQSection />
    </div>
  );
}
