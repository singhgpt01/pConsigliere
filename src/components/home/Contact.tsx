import React, { useState, useEffect } from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Reveal } from '../common/Reveal';
import { Button } from '../common/Button';
import { brandData } from '../../data/commodities';
import { FormSubmissionData } from '../modals/EnquiryConfirmationModal';

export interface ContactProps {
  prefilledCommodity: string;
  onSubmitSuccess: (data: FormSubmissionData) => void;
}

export const Contact: React.FC<ContactProps> = ({ prefilledCommodity, onSubmitSuccess }) => {
  const [formFields, setFormFields] = useState<FormSubmissionData>({
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

  // Keep commodity field updated when user clicks an enquiry button in the portfolio
  useEffect(() => {
    if (prefilledCommodity) {
      setFormFields((prev) => ({
        ...prev,
        commodity: prefilledCommodity
      }));
    }
  }, [prefilledCommodity]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSuccess({ ...formFields });
  };

  return (
    <Section id="contact" className="contact-section">
      <Container>
        <Reveal>
          <div className="contact-layout">
            {/* Left Contact Information Pane */}
            <div className="contact-info-pane">
              <span className="section-eyebrow">COMMERCIAL ENQUIRIES</span>
              <h2 className="section-heading">Have a Commodity Requirement?</h2>
              <p className="section-lead" style={{ marginBottom: '2.25rem' }}>
                Share your requirement with our team to initiate a structured commercial discussion.
              </p>

              <div className="contact-meta-item">
                <div className="contact-meta-label">Direct Communication</div>
                <div className="contact-meta-value">
                  <a href={`mailto:${brandData.contactEmail}`}>{brandData.contactEmail}</a>
                </div>
              </div>

              <div className="contact-meta-item">
                <div className="contact-meta-label">Commercial Desk</div>
                <div className="contact-meta-value">
                  <a href={`mailto:${brandData.deskEmail}`}>{brandData.deskEmail}</a>
                </div>
              </div>

              <div className="contact-meta-item">
                <div className="contact-meta-label">Headquarters & Jurisdiction</div>
                <div className="contact-meta-value" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  Consigliere Holdings Ltd.<br />
                  International Commercial Intermediation
                </div>
              </div>

              <div
                style={{
                  padding: '1.15rem',
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  marginTop: 'auto'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--color-accent-gold)',
                    marginBottom: '0.3rem'
                  }}
                >
                  COUNTERPARTY PROTOCOL
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Please use an authentic company email domain. Consigliere Holdings conducts initial counterparty verification before releasing detailed transaction specifications or commercial agreements.
                </p>
              </div>
            </div>

            {/* Right Contact Form Card */}
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
                  <label className="form-label" htmlFor="description">
                    Requirement Overview & Technical Specifications
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formFields.description}
                    onChange={handleInputChange}
                    placeholder="Provide relevant commercial requirements, required delivery timeframe, banking instrument preference (DLC/SBLC), or specific product parameters..."
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <span className="form-label">Preferred Contact Method</span>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.35rem' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.84rem',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="radio"
                        name="contactMethod"
                        value="email"
                        checked={formFields.contactMethod === 'email'}
                        onChange={handleInputChange}
                      />
                      Corporate Email
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.84rem',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
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

                <Button
                  variant="primary"
                  type="submit"
                  style={{ width: '100%', padding: '0.95rem' }}
                >
                  Submit Commercial Enquiry
                </Button>
              </form>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
};
