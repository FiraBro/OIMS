import React from "react";
import HowItWorks from "@/components/howitworks/HowItWorks";
import HeroSection from "@/components/heroSection/HeroSection";
import TestimonialsCarousel from "@/components/testimonial/TestimonialsSection";
import FAQSection from "../../components/Faq/FAQSection";
import PlansPreview from "@/components/preview/PlanPreview";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <PlansPreview />
      <HowItWorks />
      <TestimonialsCarousel />
      <FAQSection />
    </div>
  );
}
