// src/pages/LandingPage.tsx

import { Navbar } from "../components/Navbar" 
import { MainContent } from "../components/MainContent";
import { PricingSection } from "../components/PricingSection"; 
import { ContactSection } from "../components/ContactSection"; 
import { Footer } from "../components/Footer"; 

export const LandingPage = () => {
  return (
    <>
      <Navbar />
      <MainContent />
      <PricingSection />
      <ContactSection />
      <Footer />
    </>
  );
};
