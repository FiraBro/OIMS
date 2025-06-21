import React from 'react'
import Navbar from '../../components/navigation/Navbar'
import Footer from '../../components/footer/Footer'
import FeaturesSection from '../../components/cardSection/FeaturesSection'

export default function HomePage() {
  return (
    <div>
        <Navbar />
        <FeaturesSection />
        <Footer />
    </div>
  )
}
