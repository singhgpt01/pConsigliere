import React, { useState } from 'react';
import { useScrollProgress } from './hooks/useScrollProgress';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { About } from './components/home/About';
import { Commodities } from './components/home/Commodities';
import { CommercialApproach } from './components/home/CommercialApproach';
import { WhyConsigliere } from './components/home/WhyConsigliere';
import { GlobalPerspective } from './components/home/GlobalPerspective';
import { Divisions } from './components/home/Divisions';
import { Contact } from './components/home/Contact';
import { TechnologiesModal } from './components/modals/TechnologiesModal';
import { EnquiryConfirmationModal, FormSubmissionData } from './components/modals/EnquiryConfirmationModal';

export const App: React.FC = () => {
  const { isScrolled, activeSection } = useScrollProgress([
    'about',
    'commodities',
    'approach',
    'principles',
    'global',
    'divisions',
    'contact'
  ]);

  // Modal States
  const [technologiesModalOpen, setTechnologiesModalOpen] = useState(false);
  const [submissionModalData, setSubmissionModalData] = useState<FormSubmissionData | null>(null);

  // Pre-selected commodity for Contact Form
  const [prefilledCommodity, setPrefilledCommodity] = useState<string>('');

  const handleCommoditySelect = (commodityName: string) => {
    setPrefilledCommodity(commodityName);
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmitSuccess = (data: FormSubmissionData) => {
    setSubmissionModalData(data);
  };

  return (
    <div className="consigliere-site-root">
      {/* Navigation Header */}
      <Header
        isScrolled={isScrolled}
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main>
        <Hero />
        <About />
        <Commodities onSelectCommodity={handleCommoditySelect} />
        <CommercialApproach />
        <WhyConsigliere />
        <GlobalPerspective />
        <Divisions onOpenTechnologies={() => setTechnologiesModalOpen(true)} />
        <Contact
          prefilledCommodity={prefilledCommodity}
          onSubmitSuccess={handleFormSubmitSuccess}
        />
      </main>

      {/* Site Footer */}
      <Footer onOpenTechnologies={() => setTechnologiesModalOpen(true)} />

      {/* Modals */}
      <TechnologiesModal
        isOpen={technologiesModalOpen}
        onClose={() => setTechnologiesModalOpen(false)}
      />

      <EnquiryConfirmationModal
        isOpen={submissionModalData !== null}
        data={submissionModalData}
        onClose={() => setSubmissionModalData(null)}
      />
    </div>
  );
};

export default App;
