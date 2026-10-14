import React, { useState } from 'react';
import { useScrollProgress } from './hooks/useScrollProgress';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { FeaturedCommodity } from './components/home/FeaturedCommodity';
import { Commodities } from './components/home/Commodities';
import { CommercialApproach } from './components/home/CommercialApproach';
import { GlobalPerspective } from './components/home/GlobalPerspective';
import { Contact } from './components/home/Contact';
import { TechnologiesModal } from './components/modals/TechnologiesModal';
import { EnquiryConfirmationModal, FormSubmissionData } from './components/modals/EnquiryConfirmationModal';

export const App: React.FC = () => {
  const { isScrolled, activeSection } = useScrollProgress([
    'commodities',
    'approach',
    'reach',
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

      {/* Main Ordered Content Sections */}
      <main>
        {/* Section A — Hero */}
        <Hero />

        {/* Section B — Featured Commodity (EN590 10 PPM Diesel) */}
        <FeaturedCommodity onEnquire={handleCommoditySelect} />

        {/* Section C — Commodity Portfolio */}
        <Commodities onSelectCommodity={handleCommoditySelect} />

        {/* Section D — Our Approach (4 Clear Stages) */}
        <CommercialApproach />

        {/* Section E — International Reach */}
        <GlobalPerspective />

        {/* Section F — Commercial Enquiry */}
        <Contact
          prefilledCommodity={prefilledCommodity}
          onSubmitSuccess={handleFormSubmitSuccess}
        />
      </main>

      {/* Section G — Site Footer */}
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
