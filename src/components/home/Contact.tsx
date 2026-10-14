import React, { useState, useEffect } from 'react';
import { Container } from '../layout/Container';
import { Reveal } from '../common/Reveal';
import { brandData, commoditiesData } from '../../data/commodities';
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null);

    // Basic email validation
    if (!formFields.businessEmail.includes('@') || !formFields.businessEmail.includes('.')) {
      setErrorMessage('Please provide a valid corporate email address.');
      return;
    }

    setIsSubmitting(true);

    // Simulate structured processing
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onSubmitSuccess({ ...formFields });
    }, 600);
  };

  return (
    <section className="section-padding enquiry-wrap" id="contact">
      <Container>
        <Reveal>
          <div className="enquiry-split-grid">
            {/* Left Column: Verified Contact Information & Protocol */}
            <div className="enquiry-info-pane">
              <span className="section-eyebrow">COMMERCIAL FACILITATION</span>
              <h2 className="section-heading">Initiate a Commercial Discussion.</h2>
              <p className="section-lead" style={{ marginBottom: '2rem' }}>
                Share your commodity specification, target volumes, and delivery parameters for direct evaluation by our facilitation team.
              </p>

              <div className="enquiry-channel-card">
                <div className="channel-label">Commercial Desk</div>
                <a href={`mailto:${brandData.deskEmail}`} className="channel-email">
                  {brandData.deskEmail}
                </a>
                <div className="channel-note">General requirements, supplier mandates & inquiries</div>
              </div>

              <div className="enquiry-channel-card">
                <div className="channel-label">Direct Communication</div>
                <a href={`mailto:${brandData.contactEmail}`} className="channel-email">
                  {brandData.contactEmail}
                </a>
                <div className="channel-note">Principal correspondence & transaction structuring</div>
              </div>

              <div className="protocol-notice">
                <div className="protocol-title">Counterparty Protocol</div>
                <p className="protocol-text">
                  To maintain transaction integrity and regulatory compliance, Consigliere Holdings conducts preliminary counterparty verification prior to issuing formal procedure documents or detailed assays.
                </p>
              </div>
            </div>

            {/* Right Column: Comprehensive Enquiry Form */}
            <div className="enquiry-form-card">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ color: 'var(--color-brass-dark)', fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-walnut)', marginBottom: '0.75rem' }}>
                    Commercial Enquiry Received
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
                    Thank you, {formFields.fullName}. Our commercial desk has logged your requirement for <strong>{formFields.commodity || 'specified commodity'}</strong>. A confirmation summary has been generated.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another Requirement
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} noValidate>
                  {errorMessage && (
                    <div style={{ padding: '0.75rem 1rem', background: '#FDF2F2', border: '1px solid #F8B4B4', color: '#9B1C1C', borderRadius: 'var(--radius-xs)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                      {errorMessage}
                    </div>
                  )}

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        className="form-input"
                        placeholder="e.g. Johnathan Vance"
                        value={formFields.fullName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="companyName">Company / Entity *</label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        required
                        className="form-input"
                        placeholder="e.g. Vance Energy Ltd."
                        value={formFields.companyName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="businessEmail">Corporate Email *</label>
                      <input
                        type="email"
                        id="businessEmail"
                        name="businessEmail"
                        required
                        className="form-input"
                        placeholder="e.g. j.vance@vanceenergy.com"
                        value={formFields.businessEmail}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="country">Country / Jurisdiction *</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        required
                        className="form-input"
                        placeholder="e.g. United Kingdom"
                        value={formFields.country}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="commodity">Commodity of Interest *</label>
                      <select
                        id="commodity"
                        name="commodity"
                        required
                        className="form-select"
                        value={formFields.commodity}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a Commodity...</option>
                        {commoditiesData.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                        <option value="Other Commodity / Custom">Other Commodity / Custom Requirement</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="deliveryTerms">Preferred Delivery IncoTerms</label>
                      <select
                        id="deliveryTerms"
                        name="deliveryTerms"
                        className="form-select"
                        value={formFields.deliveryTerms}
                        onChange={handleInputChange}
                      >
                        <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                        <option value="FOB">FOB (Free on Board)</option>
                        <option value="Other">Other (DAP / TTO / In-Tank)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="quantity">Required Volume & Unit</label>
                      <input
                        type="text"
                        id="quantity"
                        name="quantity"
                        className="form-input"
                        placeholder="e.g. 50,000 MT / Month"
                        value={formFields.quantity}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="destination">Destination / Discharge Port</label>
                      <input
                        type="text"
                        id="destination"
                        name="destination"
                        className="form-input"
                        placeholder="e.g. Port of Rotterdam / Singapore"
                        value={formFields.destination}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="description">Requirement Overview & Technical Specifications</label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="form-textarea"
                      placeholder="Specify quality standard, target delivery window, preferred banking framework, or specific product parameters..."
                      value={formFields.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing Commercial Enquiry...' : 'Submit Commercial Requirement'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
