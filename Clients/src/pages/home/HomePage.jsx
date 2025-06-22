import React from 'react'
import Footer from '../../components/footer/Footer'
import FeaturesSection from '../../components/cardSection/FeaturesSection'
import HeroSection from '../../components/heroSection/HeroSection'
import WhyChooseUs from '../../components/whChooseUs/WhyChooseUs'
import GetStarted from '../../components/getStarted/GetStarted'

export default function HomePage() {
  return (
    <div>
        <HeroSection />
        <FeaturesSection />
        <WhyChooseUs />
        <GetStarted />
    </div>
  )
}
