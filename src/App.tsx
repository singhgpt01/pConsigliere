import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useScrollProgress } from './hooks/useScrollProgress';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { FeaturedCommodity } from './components/home/FeaturedCommodity';
import { Commodities } from './components/home/Commodities';
import { TransactionFramework } from './components/home/TransactionFramework';
import { CommercialApproach } from './components/home/CommercialApproach';
import { GlobalPerspective } from './components/home/GlobalPerspective';
import { Contact } from './components/home/Contact';
import { TechnologiesModal } from './components/modals/TechnologiesModal';
import { EnquiryConfirmationModal, type FormSubmissionData } from './components/modals/EnquiryConfirmationModal';
import AdminDashboard from './pages/AdminDashboard';

// Scroll Restoration & Hash Anchor Handler
const ScrollHandler: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

// Main Public Portal Component
const MainSite: React.FC = () => {
  const { isScrolled, activeSection } = useScrollProgress([
    'commodities',
    'framework',
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

        {/* Section — Transaction Framework */}
        <TransactionFramework />

        {/* Section D — Commercial Approach (4 Clear Stages) */}
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

// Admin Portal Page Container
const AdminPage: React.FC = () => {
  return <AdminDashboard />;
};

// 404 Not Found Page
const NotFoundPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAF8F3',
      color: '#30231D',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: '#FFFFFF',
        border: '2px solid #30231D',
        boxShadow: '8px 8px 0px #30231D',
        padding: '2.5rem',
        textAlign: 'center'
      }}>
        <div style={{
          background: '#30231D',
          color: '#FAF8F3',
          display: 'inline-block',
          padding: '0.2rem 0.6rem',
          fontWeight: 900,
          fontSize: '0.9rem',
          letterSpacing: '0.1em',
          marginBottom: '1rem'
        }}>
          404 NOT FOUND
        </div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 600, margin: '0 0 1rem 0' }}>
          Document or Portal Not Located
        </h2>
        <p style={{ color: '#736557', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          The requested path does not exist on the Consigliere Holdings commercial domain.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/"
            style={{
              background: '#B99A62',
              color: 'white',
              padding: '0.65rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid #30231D',
              boxShadow: '3px 3px 0px #30231D'
            }}
          >
            ← Return to Public Site
          </a>
          <a
            href="/admin"
            style={{
              background: '#FFFFFF',
              color: '#30231D',
              padding: '0.65rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid #30231D',
              boxShadow: '3px 3px 0px #30231D'
            }}
          >
            Admin Desk →
          </a>
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollHandler />
      <Routes>
        {/* Main Consigliere Holdings Commercial Portal */}
        <Route path="/" element={<MainSite />} />

        {/* Admin Dashboard Protected Portal */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
