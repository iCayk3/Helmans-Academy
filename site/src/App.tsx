import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { About } from './components/About';
import { StructureGallery } from './components/StructureGallery';
import { Modalities } from './components/Modalities';
import { BmiCalculator } from './components/BmiCalculator';
import { PricingPlans } from './components/PricingPlans';
import { ScheduleSection } from './components/ScheduleSection';
import { Testimonials } from './components/Testimonials';
import { LocationContact } from './components/LocationContact';
import { Footer } from './components/Footer';
import { FreeTrialModal } from './components/FreeTrialModal';
import { StudentAreaModal } from './components/StudentAreaModal';
import { WhatsAppFloating } from './components/WhatsAppFloating';

export const App: React.FC = () => {
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark text-zinc-100 flex flex-col relative selection:bg-brand-gold selection:text-black">
      {/* Navbar with blur and navigation */}
      <Navbar
        onOpenTrialModal={() => setTrialModalOpen(true)}
        onOpenStudentModal={() => setStudentModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero onOpenTrialModal={() => setTrialModalOpen(true)} />
        <Stats />
        <About onOpenTrialModal={() => setTrialModalOpen(true)} />
        <StructureGallery onOpenTrialModal={() => setTrialModalOpen(true)} />
        <Modalities onOpenTrialModal={() => setTrialModalOpen(true)} />
        <BmiCalculator onOpenTrialModal={() => setTrialModalOpen(true)} />
        <PricingPlans onOpenTrialModal={() => setTrialModalOpen(true)} />
        <ScheduleSection />
        <Testimonials />
        <LocationContact />
      </main>

      {/* Institutional Footer */}
      <Footer
        onOpenTrialModal={() => setTrialModalOpen(true)}
        onOpenStudentModal={() => setStudentModalOpen(true)}
      />

      {/* Interactive Modals & Conversions */}
      <FreeTrialModal
        isOpen={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
      />

      <StudentAreaModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
      />

      {/* Floating Conversion WhatsApp Button */}
      <WhatsAppFloating />
    </div>
  );
};

export default App;
