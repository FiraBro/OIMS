import React from 'react'
import Navbar from '../../components/navigation/Navbar'
import Footer from '../../components/footer/Footer'
import FeaturesSection from '../../components/cardSection/FeaturesSection'
import HeroSection from '../../components/heroSection/HeroSection'

export default function HomePage() {
  return (
    <div>
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <Footer />
    </div>
  )
}
