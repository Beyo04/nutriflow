import React from 'react'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'
import HomePlan from '../components/HomePlan'
import Testimonials from '../components/Testimonials'
import Faq from '../components/Faq'
import ContactUs from './ContactUs'

const Home = ({ setActiveTab }) => {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <HomePlan />
      <Testimonials />
      <ContactUs/>
      <Faq />
      <Footer setActiveTab={setActiveTab} />
    </main>
  )
}

export default Home