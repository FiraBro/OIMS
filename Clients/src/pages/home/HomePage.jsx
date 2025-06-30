import React from "react";
import Footer from "../../components/footer/Footer";
import FeaturesSection from "../../components/cardSection/FeaturesSection";
import HeroSection from "../../components/heroSection/HeroSection";
import WhyChooseUs from "../../components/whChooseUs/WhyChooseUs";
import GetStarted from "../../components/getStarted/GetStarted";
import AboutSection from "../../components/About/AboutSection";
import FAQSection from "../../components/Faq/FAQSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <WhyChooseUs />
      <GetStarted />
      <FAQSection />
    </div>
  );
}
