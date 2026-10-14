/**
 * CONSIGLIERE HOLDINGS - CORE REACT APPLICATION
 * Production-quality, accessible, and responsive static website
 * Refined Visual Layout, 52/48 Editorial About, Spotlight Commodities & Clean Imagery
 */

const { useState, useEffect, useMemo, useRef } = React;

function ConsigliereApp() {
  const data = window.CONSIGLIERE_DATA;

  // Navigation & Scroll State
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Commodity Portfolio State
  const [activeCategory, setActiveCategory] = useState('all');

  // Contact Form State (with pre-selection capability)
  const [formFields, setFormFields] = useState({
    fullName: '',
    companyName: '',
    businessEmail: '',
    country: '',
    commodity: '',
    quantity: '',
    destination: '',
    deliveryTerms: 'CIF',
    description: '',
    contactMethod: 'email'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [lastSubmissionData, setLastSubmissionData] = useState(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Division Modal State (Consigliere Technologies)
  const [technologiesModalOpen, setTechnologiesModalOpen] = useState(false);

  // Parallax Ref for Hero Backdrop
  const heroBackdropRef = useRef(null);

  // Scroll Observer and Parallax Effect
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 40);

          // Subtle hero parallax (smooth, restrained, non-jarring)
          if (heroBackdropRef.current && scrollY < window.innerHeight) {
            heroBackdropRef.current.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
          }

          // Active Section Tracker
          const sections = ['about', 'commodities', 'approach', 'divisions', 'contact'];
          const scrollPos = scrollY + 200;

          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i]);
            if (el && el.offsetTop <= scrollPos) {
              setActiveSection(sections[i]);
              ticking = false;
              return;
            }
          }
          if (scrollY < 260) {
            setActiveSection('hero');
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Scroll Reveals
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    const revealElements = document.querySelectorAll('.reveal-fade-up');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [activeCategory]);

  // Filtered Commodities & Spotlight Feature
  const { spotlightCommodity, secondaryCommodities } = useMemo(() => {
    const list = activeCategory === 'all' 
      ? data.commodities 
      : data.commodities.filter(item => item.category === activeCategory);

    const featured = list.find(item => item.featured) || list[0];
    const secondary = list.filter(item => item.id !== featured?.id);

    return {
      spotlightCommodity: featured,
      secondaryCommodities: secondary
    };
  }, [activeCategory, data.commodities]);

  // Handle "Enquire About This Commodity" click
  const handleCommodityEnquiry = (commodityName) => {
    setFormFields(prev => ({
      ...prev,
      commodity: commodityName
    }));

    // Smoothly scroll to contact form
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Form Field Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  // Form Submit Handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLastSubmissionData({ ...formFields });
    setFormSubmitted(true);
    setCopiedToClipboard(false);
  };

  // Copy structured terms to clipboard
  const handleCopyTerms = () => {
    if (!lastSubmissionData) return;
    const textToCopy = `COMMERCIAL REQUIREMENT SPECIFICATION\nEntity: ${lastSubmissionData.companyName} (${lastSubmissionData.country})\nContact: ${lastSubmissionData.fullName} <${lastSubmissionData.businessEmail}>\nCommodity: ${lastSubmissionData.commodity}\nVolume: ${lastSubmissionData.quantity}\nDestination: ${lastSubmissionData.destination} (${lastSubmissionData.deliveryTerms})\nNotes: ${lastSubmissionData.description}\nPreferred Channel: ${lastSubmissionData.contactMethod}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 3000);
    });
  };

  return (
    <div className="consigliere-site-root">

      {/* =================================================================
          1. REFINED NAVIGATION BAR
          Reduced vertical footprint (74px/64px), aligned wordmark & nav
          ================================================================= */}
      <header className={`site-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container-wide nav-inner">
          {/* Wordmark and Monogram */}
          <a href="#" className="brand-identity" aria-label="Consigliere Holdings Home">
            <div className="brand-monogram">C</div>
            <div className="brand-title-wrap">
              <span className="brand-wordmark">CONSIGLIERE HOLDINGS</span>
              <span className="brand-sub">Commercial Facilitation</span>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="nav-links" aria-label="Primary Navigation">
            <a 
              href="#about" 
              className={`nav-item ${activeSection === 'about' ? 'active' : ''}`}
            >
              About
            </a>
            <a 
              href="#commodities" 
              className={`nav-item ${activeSection === 'commodities' ? 'active' : ''}`}
            >
              Commodities
            </a>
            <a 
              href="#approach" 
              className={`nav-item ${activeSection === 'approach' ? 'active' : ''}`}
            >
              Our Approach
            </a>
            <a 
              href="#divisions" 
              className={`nav-item ${activeSection === 'divisions' ? 'active' : ''}`}
            >
              Divisions
            </a>
            <a 
              href="#contact" 
              className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`}
            >
              Contact
            </a>
          </nav>

          {/* Action CTA & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <a href="#contact" className="btn btn-secondary nav-cta nav-cta-desktop">
              Discuss a Requirement
            </a>

            <button 
              className="nav-toggle-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <a href="#about" className="nav-item" style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#commodities" className="nav-item" style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>Commodities</a>
            <a href="#approach" className="nav-item" style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>Our Approach</a>
            <a href="#divisions" className="nav-item" style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>Divisions</a>
            <a href="#contact" className="nav-item" style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </div>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.75rem' }}>
            <a href="#contact" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setMobileMenuOpen(false)}>
              Discuss a Requirement
            </a>
          </div>
        </div>
      )}

      {/* =================================================================
          2. HERO SECTION
          Clean Maritime Deepwater Port Imagery (NO signage/logos),
          Controlled Width, Editorial Line Breaks, Balanced Contrast
          ================================================================= */}
      <section className="hero-wrap" id="hero">
        <div 
          ref={heroBackdropRef}
          className="hero-backdrop"
          style={{ backgroundImage: `url('assets/images/hero-port.jpg')` }}
        />
        <div className="hero-overlay-gradient" />
        <div className="hero-overlay-vignette" />

        <div className="container">
          <div className="hero-content">
            <span className="hero-eyebrow">
              GLOBAL COMMODITIES | COMMERCIAL FACILITATION
            </span>

            <h1 className="hero-title">
              Facilitating the Flow<br />
              of Global Commerce.
            </h1>

            <p className="hero-lead">
              Connecting commercial counterparties across energy, industrial, and agricultural commodity markets.
            </p>

            <div className="hero-actions">
              <a href="#commodities" className="btn btn-primary">
                Explore Our Commodities
              </a>
              <a href="#contact" className="btn btn-secondary">
                Discuss a Requirement
              </a>
            </div>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="hero-scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-track-line" />
        </div>
      </section>

      {/* =================================================================
          3. ABOUT SECTION (WHO WE ARE)
          Exact 52/48 Desktop Editorial Split, Concise Content (NO large quote),
          Authentic Maritime Photography with Outside HTML Caption
          ================================================================= */}
      <section className="section-padding" id="about">
        <div className="container">
          <div className="about-split-layout reveal-fade-up">
            {/* Left Column (52% Content Width) */}
            <div className="about-text-column">
              <span className="section-eyebrow">WHO WE ARE</span>
              <h2 className="section-heading">
                Built Around Commercial Connections.
              </h2>

              <p className="about-body-paragraph">
                Consigliere Holdings facilitates commercial engagement across international commodity markets, connecting qualified buyers, suppliers, and relevant commercial partners.
              </p>

              <p className="about-body-paragraph">
                Our approach emphasizes clear requirements, professional communication, counterparty alignment, and coordinated commercial engagement.
              </p>

              <div className="about-supporting-statement">
                “Independent facilitation. International perspective. Structured commercial engagement.”
              </div>

              <div>
                <a href="#approach" className="link-editorial">
                  <span>Understand Our Commercial Approach</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Right Column (48% Content Width) */}
            <div className="about-image-column">
              <img 
                src="assets/images/about-vessels.jpg" 
                alt="International bulk commercial carriers navigating global maritime trade channels" 
                loading="lazy"
              />
              <div className="about-image-caption-bar">
                <span>COMMERCIAL INTERMEDIATION</span>
                <span>GLOBAL CORRIDORS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          4. COMMODITIES PORTFOLIO
          Wide Editorial Feature Panel + Restrained Grid, Clean Typography,
          Pre-Selected Commodity Enquiry Routing
          ================================================================= */}
      <section className="section-padding commodities-section" id="commodities">
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <span className="section-eyebrow">OUR COMMODITIES</span>
            <h2 className="section-heading">
              Connecting Supply with Global Demand.
            </h2>
            <p className="section-lead">
              We facilitate commercial engagement across selected energy, industrial, and agricultural commodity markets, subject to product availability, counterparty qualification, and agreed transaction requirements.
            </p>
          </div>

          {/* Category Filter Navigation */}
          <div className="commodities-nav-bar">
            {[
              { id: 'all', label: 'All Commodities' },
              { id: 'energy', label: 'Energy' },
              { id: 'industrial', label: 'Industrial Commodities' },
              { id: 'agriculture', label: 'Agricultural Commodities' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`category-tab-btn ${activeCategory === tab.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Wide Editorial Feature Spotlight Panel */}
          {spotlightCommodity && (
            <div className="spotlight-panel reveal-fade-up">
              <div>
                <span className="spotlight-badge">Featured Facilitation • {spotlightCommodity.categoryLabel}</span>
                <h3 className="spotlight-title">{spotlightCommodity.name}</h3>
                <div className="spotlight-tagline">{spotlightCommodity.tagline}</div>
                <p className="spotlight-desc">{spotlightCommodity.overview}</p>

                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleCommodityEnquiry(spotlightCommodity.name)}
                  >
                    Enquire About This Commodity
                  </button>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    {spotlightCommodity.availabilityNote}
                  </span>
                </div>
              </div>

              <div className="spotlight-specs-container">
                {spotlightCommodity.specs.map((spec, idx) => (
                  <div key={idx} className="spec-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '3px' }}>
                    <span className="label" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>{spec.label}</span>
                    <span className="value" style={{ fontSize: '0.86rem' }}>{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Editorial Commodities Grid */}
          <div className="commodities-grid">
            {secondaryCommodities.map(item => (
              <div key={item.id} className="commodity-card reveal-fade-up">
                <span className="commodity-meta-tag">{item.categoryLabel}</span>
                <h3 className="commodity-title">{item.name}</h3>
                <div className="commodity-tagline">{item.tagline}</div>

                <p className="commodity-desc">{item.overview}</p>

                <div className="commodity-specs-list">
                  {item.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="spec-item">
                      <span className="label">{spec.label}</span>
                      <span className="value">{spec.val}</span>
                    </div>
                  ))}
                </div>

                <div className="commodity-disclaimer-note">
                  {item.availabilityNote}
                </div>

                <div className="commodity-card-footer">
                  <button 
                    className="link-editorial"
                    onClick={() => handleCommodityEnquiry(item.name)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <span>Enquire About This Commodity</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2.75rem', padding: '1.35rem 1.85rem', background: 'var(--color-bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Looking for a specific petroleum fraction, fertilizer compound, or agricultural requirement not listed above?
            </div>
            <a href="#contact" className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.76rem' }}>
              Submit Specific Specification
            </a>
          </div>
        </div>
      </section>

      {/* =================================================================
          5. OUR COMMERCIAL APPROACH
          4 Exact Facilitation Stages (Phase 7 Framework)
          ================================================================= */}
      <section className="section-padding" id="approach">
        <div className="container">
          <div style={{ maxWidth: '780px' }}>
            <span className="section-eyebrow">HOW WE WORK</span>
            <h2 className="section-heading">
              Structured Engagement. Clear Commercial Intent.
            </h2>
            <p className="section-lead">
              Our facilitation framework guides participants through an orderly commercial trajectory, reducing uncertainty and ensuring mutual accountability at every phase.
            </p>
          </div>

          <div className="approach-timeline reveal-fade-up">
            {data.approachSteps.map(step => (
              <div key={step.number} className="timeline-card">
                <div className="step-marker">{step.number}</div>
                <h3 className="timeline-step-title">{step.title}</h3>
                <p className="timeline-step-desc">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="approach-notice-box">
            <svg className="notice-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <div className="notice-text">
              <strong>Facilitation Scope Disclosure:</strong> The stages above describe our general facilitation approach and structured methodology. They do not constitute an unconditional guarantee of product availability, counterparty legitimacy, commercial delivery, banking release, or transaction completion, which remain the contractual and legal responsibilities of the respective transacting principals.
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          6. WHY CONSIGLIERE HOLDINGS (4 Editorial Pillars)
          ================================================================= */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <span className="section-eyebrow">OUR PRINCIPLES</span>
            <h2 className="section-heading">
              Commercial Relationships Deserve a Disciplined Approach.
            </h2>
          </div>

          <div className="pillars-grid reveal-fade-up">
            {data.pillars.map((pillar, idx) => (
              <div key={idx} className="pillar-card">
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-desc">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          7. GLOBAL PERSPECTIVE
          International Commercial Connectivity
          ================================================================= */}
      <section className="section-padding global-section">
        <div className="container">
          <div className="global-layout reveal-fade-up">
            <div>
              <span className="section-eyebrow">GLOBAL PERSPECTIVE</span>
              <h2 className="section-heading">
                Local Requirements. International Markets.
              </h2>
              <p className="section-lead" style={{ marginBottom: '1.5rem' }}>
                Commodity flows require cross-border coordination across distinct regulatory jurisdictions, commercial banking practices, and logistical hubs.
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: '1.75rem' }}>
                Consigliere Holdings supports commercial connections linking producers, established traders, and industrial buyers across the primary international trading corridors of Europe, the Middle East, the Americas, and the Asia-Pacific region.
              </p>

              <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.35rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--color-accent-gold)', fontWeight: '600' }}>Energy & Petrochemicals</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>ARA, US Gulf Coast & Middle East Corridors</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--color-accent-gold)', fontWeight: '600' }}>Agricultural Staples</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>South American & South Asian Origins</div>
                </div>
              </div>
            </div>

            <div className="global-graphic-box">
              <svg className="corridor-lines-svg" viewBox="0 0 500 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="500" height="260" rx="4" fill="#0A0C0F"/>
                <line x1="40" y1="65" x2="460" y2="65" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4"/>
                <line x1="40" y1="130" x2="460" y2="130" stroke="rgba(255,255,255,0.08)"/>
                <line x1="40" y1="195" x2="460" y2="195" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4"/>
                <line x1="125" y1="30" x2="125" y2="230" stroke="rgba(255,255,255,0.04)"/>
                <line x1="250" y1="30" x2="250" y2="230" stroke="rgba(255,255,255,0.06)"/>
                <line x1="375" y1="30" x2="375" y2="230" stroke="rgba(255,255,255,0.04)"/>

                <path d="M 120 115 Q 185 60 250 100" stroke="#C6A66B" strokeWidth="1.5" strokeOpacity="0.8" fill="none"/>
                <path d="M 250 100 Q 315 75 390 120" stroke="#C6A66B" strokeWidth="1.5" strokeOpacity="0.8" fill="none"/>
                <path d="M 140 160 Q 230 190 320 135" stroke="rgba(198,166,107,0.4)" strokeWidth="1.2" strokeDasharray="5 5" fill="none"/>

                <circle cx="120" cy="115" r="4" fill="#C6A66B"/>
                <circle cx="250" cy="100" r="4" fill="#C6A66B"/>
                <circle cx="390" cy="120" r="4" fill="#C6A66B"/>
                <circle cx="320" cy="135" r="3" fill="#A2A8B0"/>
                <circle cx="140" cy="160" r="3" fill="#A2A8B0"/>

                <text x="120" y="135" fill="#A2A8B0" fontSize="9" fontFamily="monospace" textAnchor="middle">Americas</text>
                <text x="250" y="88" fill="#F3F0E8" fontSize="9" fontFamily="monospace" textAnchor="middle">Europe / MidEast</text>
                <text x="390" y="140" fill="#A2A8B0" fontSize="9" fontFamily="monospace" textAnchor="middle">Asia-Pacific</text>
              </svg>

              <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ILLUSTRATIVE SCHEMATIC OF INTERNATIONAL COMMODITY FACILITATION CHANNELS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          8. BUSINESS DIVISIONS
          Consigliere Commodities & Consigliere Technologies
          ================================================================= */}
      <section className="section-padding" id="divisions">
        <div className="container">
          <div style={{ maxWidth: '780px' }}>
            <span className="section-eyebrow">CORPORATE STRUCTURE</span>
            <h2 className="section-heading">
              One Group. Distinct Areas of Focus.
            </h2>
            <p className="section-lead">
              Consigliere Holdings structures its commercial activities into dedicated operating units aligned with long-term commercial objectives.
            </p>
          </div>

          <div className="divisions-grid reveal-fade-up">
            {/* Division 1: Consigliere Commodities */}
            <div className="division-panel">
              <span className="division-label">Operating Division</span>
              <h3 className="division-name">CONSIGLIERE COMMODITIES</h3>
              <p className="division-desc">
                Facilitating commercial opportunities across selected global commodity markets. We bridge qualified buyers and suppliers across energy, industrial minerals, and agricultural commodities through disciplined intermediation.
              </p>
              <div className="division-cta-wrap">
                <a href="#commodities" className="btn btn-primary" style={{ width: '100%' }}>
                  Explore Commodities
                </a>
              </div>
            </div>

            {/* Division 2: Consigliere Technologies */}
            <div className="division-panel">
              <span className="division-label" style={{ color: 'var(--text-muted)' }}>Under Formal Formation</span>
              <h3 className="division-name">CONSIGLIERE TECHNOLOGIES</h3>
              <p className="division-desc">
                A dedicated division within the Consigliere Holdings umbrella. Further information will be published as its activities, partnerships, and service capabilities are formally established.
              </p>
              <div className="division-cta-wrap">
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%' }}
                  onClick={() => setTechnologiesModalOpen(true)}
                >
                  Division Overview
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          9. CONTACT & COMMERCIAL ENQUIRIES
          Premium, functional enquiry form with pre-filled commodity support
          ================================================================= */}
      <section className="section-padding contact-section" id="contact">
        <div className="container">
          <div className="contact-layout reveal-fade-up">
            <div className="contact-info-pane">
              <span className="section-eyebrow">COMMERCIAL ENQUIRIES</span>
              <h2 className="section-heading">
                Have a Commodity Requirement?
              </h2>
              <p className="section-lead" style={{ marginBottom: '2.25rem' }}>
                Share your requirement with our team to initiate a structured commercial discussion.
              </p>

              <div className="contact-meta-item">
                <div className="contact-meta-label">Direct Communication</div>
                <div className="contact-meta-value">
                  <a href={`mailto:${data.brand.contactEmail}`}>{data.brand.contactEmail}</a>
                </div>
              </div>

              <div className="contact-meta-item">
                <div className="contact-meta-label">Commercial Desk</div>
                <div className="contact-meta-value">
                  <a href={`mailto:${data.brand.deskEmail}`}>{data.brand.deskEmail}</a>
                </div>
              </div>

              <div className="contact-meta-item">
                <div className="contact-meta-label">Headquarters & Jurisdiction</div>
                <div className="contact-meta-value" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  Consigliere Holdings Ltd.<br />
                  International Commercial Intermediation
                </div>
              </div>

              <div style={{ padding: '1.15rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', marginTop: 'auto' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-accent-gold)', marginBottom: '0.3rem' }}>
                  COUNTERPARTY PROTOCOL
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Please use an authentic company email domain. Consigliere Holdings conducts initial counterparty verification before releasing detailed transaction specifications or commercial agreements.
                </p>
              </div>
            </div>

            {/* Form Card */}
            <div className="contact-form-card">
              <form onSubmit={handleFormSubmit}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Full Name *</label>
                    <input 
                      type="text" 
                      id="fullName" 
                      name="fullName" 
                      required 
                      value={formFields.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. John Henderson" 
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="companyName">Company Name *</label>
                    <input 
                      type="text" 
                      id="companyName" 
                      name="companyName" 
                      required 
                      value={formFields.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Henderson Energy Partners" 
                      className="form-input" 
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="businessEmail">Business Email *</label>
                    <input 
                      type="email" 
                      id="businessEmail" 
                      name="businessEmail" 
                      required 
                      value={formFields.businessEmail}
                      onChange={handleInputChange}
                      placeholder="name@company.com" 
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="country">Country / Jurisdiction *</label>
                    <input 
                      type="text" 
                      id="country" 
                      name="country" 
                      required 
                      value={formFields.country}
                      onChange={handleInputChange}
                      placeholder="e.g. United Kingdom, UAE, Singapore" 
                      className="form-input" 
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="commodity">Commodity Selection *</label>
                    <select 
                      id="commodity" 
                      name="commodity" 
                      required 
                      value={formFields.commodity}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">-- Select Commodity Category --</option>
                      <optgroup label="Energy">
                        <option value="EN590 10 PPM Ultra-Low-Sulphur Diesel">EN590 10 PPM Ultra-Low-Sulphur Diesel</option>
                        <option value="Jet A-1 Aviation Fuel">Jet A-1 Aviation Fuel</option>
                        <option value="Crude Oil">Crude Oil (Light Sweet / Medium Sour)</option>
                        <option value="Other Refined Petroleum Products">Other Refined Petroleum (Naphtha, Fuel Oil, Bitumen)</option>
                      </optgroup>
                      <optgroup label="Industrial Commodities">
                        <option value="Sulphur (Granular / Formed)">Sulphur (Granular / Formed)</option>
                        <option value="Urea & Selected Fertilizers">Urea & Selected Fertilizers</option>
                        <option value="Base Oils">Base Oils (Group I, II, III)</option>
                        <option value="Ferrous & Non-Ferrous Metals">Ferrous & Non-Ferrous Metals</option>
                      </optgroup>
                      <optgroup label="Agricultural Commodities">
                        <option value="Sugar (ICUMSA 45 & Raw Cane)">Sugar (ICUMSA 45 & Raw Cane)</option>
                        <option value="Edible Oils">Edible Oils (Palm Olein, Sunflower, Soybean)</option>
                        <option value="Rice & Selected Agricultural Products">Rice & Selected Agricultural Products</option>
                      </optgroup>
                      <option value="Other / Specific Mandate">Other / Specific Mandate</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="quantity">Required Quantity & Unit *</label>
                    <input 
                      type="text" 
                      id="quantity" 
                      name="quantity" 
                      required 
                      value={formFields.quantity}
                      onChange={handleInputChange}
                      placeholder="e.g. 50,000 MT Spot / 100,000 MT Monthly" 
                      className="form-input" 
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="destination">Destination / Delivery Location *</label>
                    <input 
                      type="text" 
                      id="destination" 
                      name="destination" 
                      required 
                      value={formFields.destination}
                      onChange={handleInputChange}
                      placeholder="e.g. Rotterdam, Fujairah, Houston, Jurong" 
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="deliveryTerms">Preferred Delivery Terms *</label>
                    <select 
                      id="deliveryTerms" 
                      name="deliveryTerms" 
                      value={formFields.deliveryTerms}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                      <option value="FOB">FOB (Free on Board)</option>
                      <option value="TTT">TTT (Tank-to-Tank Transfer)</option>
                      <option value="To Be Discussed">To Be Mutually Agreed</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="description">Requirement Overview & Technical Specifications</label>
                  <textarea 
                    id="description" 
                    name="description" 
                    rows="3" 
                    value={formFields.description}
                    onChange={handleInputChange}
                    placeholder="Provide relevant commercial requirements, required delivery timeframe, banking instrument preference (DLC/SBLC), or specific product parameters..." 
                    className="form-textarea"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Contact Method</label>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.35rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="contactMethod" 
                        value="email" 
                        checked={formFields.contactMethod === 'email'} 
                        onChange={handleInputChange} 
                      />
                      Corporate Email
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="contactMethod" 
                        value="phone" 
                        checked={formFields.contactMethod === 'phone'} 
                        onChange={handleInputChange} 
                      />
                      Telephone / Secure Call
                    </label>
                  </div>
                </div>

                <div className="form-privacy-note">
                  By submitting this form, you acknowledge that Consigliere Holdings operates as an independent commercial facilitator. Information submitted is handled with strict commercial confidentiality in accordance with international business standards.
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.95rem' }}>
                  Submit Commercial Enquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          10. FOOTER
          Wordmark, positioning statement, navigation, dynamic year, legal notice
          ================================================================= */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top-grid">
            <div>
              <div className="brand-identity" style={{ marginBottom: '1.15rem' }}>
                <div className="brand-monogram">C</div>
                <div className="brand-title-wrap">
                  <span className="brand-wordmark">CONSIGLIERE HOLDINGS</span>
                  <span className="brand-sub">Commercial Facilitation</span>
                </div>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.75', maxWidth: '360px', marginBottom: '1.25rem' }}>
                Connecting Markets. Facilitating Opportunity. Facilitating Global Commodity Trade across selected international energy, industrial, and agricultural markets.
              </p>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Domain: <a href="https://consigliereholdings.com" style={{ color: 'var(--color-accent-gold)' }}>consigliereholdings.com</a>
              </div>
            </div>

            <div>
              <h4 className="footer-col-header">Commodities</h4>
              <div className="footer-menu-list">
                <a href="#commodities" className="footer-menu-link">Ultra-Low-Sulphur Diesel</a>
                <a href="#commodities" className="footer-menu-link">Jet A-1 Aviation Fuel</a>
                <a href="#commodities" className="footer-menu-link">Crude Oil Streams</a>
                <a href="#commodities" className="footer-menu-link">Sulphur & Granular Urea</a>
                <a href="#commodities" className="footer-menu-link">Refined Cane Sugar</a>
                <a href="#commodities" className="footer-menu-link">Vegetable Edible Oils</a>
              </div>
            </div>

            <div>
              <h4 className="footer-col-header">Company</h4>
              <div className="footer-menu-list">
                <a href="#about" className="footer-menu-link">About Consigliere</a>
                <a href="#approach" className="footer-menu-link">Our Commercial Approach</a>
                <a href="#divisions" className="footer-menu-link">Group Divisions</a>
                <a href="#contact" className="footer-menu-link">Commercial Enquiries</a>
                <a href="#" className="footer-menu-link" onClick={(e) => { e.preventDefault(); alert("Consigliere Holdings Privacy Policy: We hold all counterparty data with utmost confidentiality in compliance with standard commercial non-disclosure practices."); }}>Privacy Policy</a>
                <a href="#" className="footer-menu-link" onClick={(e) => { e.preventDefault(); alert("Consigliere Holdings Terms of Use: Content on this site is provided for informational and commercial intermediation purposes only."); }}>Terms of Use</a>
              </div>
            </div>

            <div>
              <h4 className="footer-col-header">Divisions</h4>
              <div className="footer-menu-list">
                <a href="#commodities" className="footer-menu-link">Consigliere Commodities</a>
                <a href="#divisions" className="footer-menu-link" onClick={() => setTechnologiesModalOpen(true)}>Consigliere Technologies</a>
                <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Enquiries: <a href={`mailto:${data.brand.contactEmail}`} style={{ color: 'var(--color-accent-gold)' }}>{data.brand.contactEmail}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Commodity Availability Legal Notice */}
          <div className="footer-disclaimer-text">
            <strong>Commercial Disclaimer:</strong> Consigliere Holdings operates as a commercial facilitator and intermediary, connecting qualified buyers, suppliers, procurement partners, and other commercial counterparties across international commodity markets. All commodity availability, specifications, allocations, quantities, prices, and transaction terms are strictly subject to commercial confirmation, independent surveyor assay, and counterparty qualification. Consigliere Holdings does not claim title ownership of refining assets, storage facilities, maritime vessels, or physical inventories unless specifically and independently verified.
          </div>

          <div className="footer-bottom-bar">
            <div>
              © {new Date().getFullYear()} Consigliere Holdings Ltd. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <span>Commercial Intermediation</span>
              <span>International Facilitation</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =================================================================
          MODAL: CONSIGLIERE TECHNOLOGIES DIVISION OVERVIEW
          Restrained, truthful explanation without fabricated claims
          ================================================================= */}
      {technologiesModalOpen && (
        <div className="modal-backdrop-layer" onClick={() => setTechnologiesModalOpen(false)}>
          <div className="modal-content-panel" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close-trigger" 
              onClick={() => setTechnologiesModalOpen(false)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <span className="section-eyebrow">DIVISION OVERVIEW</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Consigliere Technologies
            </h3>

            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: '1.5rem' }}>
              Consigliere Technologies is a dedicated business division under the Consigliere Holdings umbrella.
            </p>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>
              In keeping with our group's policy of strict commercial integrity and transparency, formal technical capabilities, operational software tools, and service offerings will be published as its commercial mandates are finalized.
            </p>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                STATUS: IN DEVELOPMENT
              </span>
              <button 
                className="btn btn-secondary" 
                onClick={() => setTechnologiesModalOpen(false)}
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.78rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL: COMMERCIAL ENQUIRY CONFIRMATION & TRANSMISSION
          Provides honest, dignified receipt, copy-to-clipboard, and direct email
          ================================================================= */}
      {formSubmitted && lastSubmissionData && (
        <div className="modal-backdrop-layer" onClick={() => setFormSubmitted(false)}>
          <div className="modal-content-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button 
              className="modal-close-trigger" 
              onClick={() => setFormSubmitted(false)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <span className="section-eyebrow">COMMERCIAL DESK ACKNOWLEDGMENT</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Enquiry Summary Generated
            </h3>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              Thank you, <strong>{lastSubmissionData.fullName}</strong>. Your commercial requirement regarding <strong>{lastSubmissionData.commodity}</strong> on behalf of <strong>{lastSubmissionData.companyName}</strong> has been structured.
            </p>

            <div style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', padding: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Target Quantity:</span> <strong style={{ color: 'var(--text-primary)' }}>{lastSubmissionData.quantity}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Destination Port:</span> <strong style={{ color: 'var(--text-primary)' }}>{lastSubmissionData.destination} ({lastSubmissionData.deliveryTerms})</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Corporate Entity:</span> <strong style={{ color: 'var(--text-primary)' }}>{lastSubmissionData.companyName} ({lastSubmissionData.country})</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Contact Email:</span> <strong style={{ color: 'var(--color-accent-gold)' }}>{lastSubmissionData.businessEmail}</strong></div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.75rem' }}>
              Submissions are reviewed directly by the Consigliere Trading Desk (<code>gs@consigliereholdings.com</code>). You can copy these structured parameters to your clipboard or launch an email draft directly:
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a 
                href={`mailto:${data.brand.contactEmail}?subject=${encodeURIComponent(`Commercial Requirement: ${lastSubmissionData.commodity} - ${lastSubmissionData.companyName}`)}&body=${encodeURIComponent(
`Attn: Consigliere Holdings Commercial Desk\n\nFull Name: ${lastSubmissionData.fullName}\nCompany: ${lastSubmissionData.companyName}\nJurisdiction: ${lastSubmissionData.country}\nEmail: ${lastSubmissionData.businessEmail}\n\nCommodity: ${lastSubmissionData.commodity}\nQuantity: ${lastSubmissionData.quantity}\nDestination: ${lastSubmissionData.destination}\nDelivery Terms: ${lastSubmissionData.deliveryTerms}\n\nTechnical Notes / Requirements:\n${lastSubmissionData.description}\n\nPreferred Contact Method: ${lastSubmissionData.contactMethod}`
                )}`}
                className="btn btn-primary"
                style={{ flex: '1', textAlign: 'center' }}
              >
                Send via Email Client
              </a>

              <button 
                className="btn btn-secondary"
                onClick={handleCopyTerms}
              >
                {copiedToClipboard ? "✓ Copied to Clipboard" : "Copy Specifications"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Mount to DOM
const mountPoint = document.getElementById('root');
if (mountPoint) {
  const root = ReactDOM.createRoot(mountPoint);
  root.render(<ConsigliereApp />);
}
