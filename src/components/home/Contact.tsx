import React, { useState, useEffect } from 'react';
import { Container } from '../layout/Container';
import { Reveal } from '../common/Reveal';
import { brandData, commoditiesData } from '../../data/commodities';
import { FormSubmissionData } from '../modals/EnquiryConfirmationModal';

export interface ContactProps {
  prefilledCommodity: string;
  onSubmitSuccess: (data: FormSubmissionData) => void;
}

interface FormState extends FormSubmissionData {
  hp_field: string;
}

const INITIAL_FORM_STATE: FormState = {
  fullName: '',
  companyName: '',
  businessEmail: '',
  country: '',
  commodity: '',
  quantity: '',
  destination: '',
  deliveryTerms: 'CIF',
  description: '',
  contactMethod: 'email',
  hp_field: ''
};

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const Contact: React.FC<ContactProps> = ({ prefilledCommodity, onSubmitSuccess }) => {
  const [formFields, setFormFields] = useState<FormState>(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionReference, setSubmissionReference] = useState<string>('');
  const [lastSubmittedSnapshot, setLastSubmittedSnapshot] = useState<FormState | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    if (prefilledCommodity) {
      setFormFields((prev) => ({
        ...prev,
        commodity: prefilledCommodity
      }));
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.commodity;
        return next;
      });
    }
  }, [prefilledCommodity]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formFields.fullName.trim() || formFields.fullName.trim().length < 2) {
      errors.fullName = 'Please provide your full legal or representative name.';
    }

    if (!formFields.companyName.trim() || formFields.companyName.trim().length < 2) {
      errors.companyName = 'Please specify your registered corporate or commercial entity.';
    }

    const emailTrimmed = formFields.businessEmail.trim();
    if (!emailTrimmed) {
      errors.businessEmail = 'A corporate email address is required.';
    } else if (!EMAIL_REGEX.test(emailTrimmed)) {
      errors.businessEmail = 'Please provide a valid corporate email address (e.g. name@entity.com).';
    }

    if (!formFields.country.trim() || formFields.country.trim().length < 2) {
      errors.country = 'Please specify your operating country or legal jurisdiction.';
    }

    if (!formFields.commodity.trim()) {
      errors.commodity = 'Please select your target commodity of interest.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Prevent accidental duplicate requests while submitting
    if (isSubmitting) return;

    // Client-side validation before request
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formFields)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        // Submission failed: keep user's entered info intact and display server message
        const errMsg = data?.message || 'Unable to submit your enquiry at this time. Please try again, or contact our commercial desk directly.';
        setServerError(errMsg);
        if (data?.errors) {
          setFieldErrors(data.errors);
        }
        setIsSubmitting(false);
        return;
      }

      // Submission confirmed by server
      const confirmedReference = data.reference || `CH-ENQ-${Date.now().toString(36).toUpperCase()}`;
      setSubmissionReference(confirmedReference);
      setLastSubmittedSnapshot({ ...formFields });

      // Reset form fields only after server confirmed success
      setFormFields(INITIAL_FORM_STATE);
      setFieldErrors({});
      setSubmitted(true);
      setIsSubmitting(false);

      // Trigger optional confirmation summary modal
      onSubmitSuccess({
        ...formFields,
        referenceNumber: confirmedReference,
        submittedAt: data.timestamp || new Date().toISOString()
      });

    } catch (err) {
      console.error('[COMMERCIAL_ENQUIRY_SUBMIT_FAILED]', err);
      // Retain entered values on network failure
      setServerError('A network connectivity error occurred while sending your requirement. Your entered specifications have been preserved. Please retry or email info@consigliereholdings.com.');
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (!submissionReference) return;
    navigator.clipboard.writeText(submissionReference).then(() => {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    });
  };

  const handleResetForNewSubmission = () => {
    setSubmitted(false);
    setSubmissionReference('');
    setLastSubmittedSnapshot(null);
    setServerError(null);
    setFieldErrors({});
    setFormFields(INITIAL_FORM_STATE);
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
                <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    margin: '0 auto 1.25rem auto',
                    borderRadius: '50%',
                    background: 'rgba(185, 154, 98, 0.15)',
                    border: '1px solid var(--color-brass)',
                    color: 'var(--color-brass-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    fontWeight: 700
                  }}>
                    ✓
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', color: 'var(--color-walnut)', marginBottom: '0.75rem' }}>
                    Commercial Enquiry Registered
                  </h3>

                  {submissionReference && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 0.85rem',
                        background: 'var(--color-ivory)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-xs)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--color-walnut)'
                      }}>
                        Ref: {submissionReference}
                        <button
                          type="button"
                          onClick={handleCopyReference}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-brass-dark)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '0 0.25rem'
                          }}
                          title="Copy reference code"
                        >
                          {copiedRef ? 'Copied' : 'Copy'}
                        </button>
                      </span>
                    </div>
                  )}

                  {/* Prompt Required Success Text */}
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', maxWidth: '480px', margin: '0 auto 1.5rem auto', fontSize: '0.94rem' }}>
                    Thank you for contacting Consigliere Holdings. Your commercial enquiry has been submitted successfully. Our team will review your requirements and respond where appropriate.
                  </p>

                  {lastSubmittedSnapshot && (
                    <div style={{
                      textAlign: 'left',
                      background: 'var(--color-ivory)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '1.25rem',
                      maxWidth: '480px',
                      margin: '0 auto 2rem auto',
                      fontSize: '0.82rem',
                      color: 'var(--color-text-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem'
                    }}>
                      <div>
                        <span style={{ color: 'var(--color-text-muted)' }}>Entity:</span>{' '}
                        <strong style={{ color: 'var(--color-walnut)' }}>{lastSubmittedSnapshot.companyName} ({lastSubmittedSnapshot.country})</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-text-muted)' }}>Representative:</span>{' '}
                        <strong style={{ color: 'var(--color-walnut)' }}>{lastSubmittedSnapshot.fullName} ({lastSubmittedSnapshot.businessEmail})</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-text-muted)' }}>Commodity:</span>{' '}
                        <strong style={{ color: 'var(--color-brass-dark)' }}>{lastSubmittedSnapshot.commodity}</strong>
                      </div>
                      {lastSubmittedSnapshot.quantity && (
                        <div>
                          <span style={{ color: 'var(--color-text-muted)' }}>Target Volume:</span>{' '}
                          <strong style={{ color: 'var(--color-walnut)' }}>{lastSubmittedSnapshot.quantity} ({lastSubmittedSnapshot.deliveryTerms})</strong>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleResetForNewSubmission}
                  >
                    Submit Another Requirement
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} noValidate>
                  {/* Honeypot Bot Trap (Invisible to humans, catches automated bots) */}
                  <div style={{ display: 'none', visibility: 'hidden' }} aria-hidden="true">
                    <label htmlFor="hp_field">Do not fill this field</label>
                    <input
                      type="text"
                      id="hp_field"
                      name="hp_field"
                      value={formFields.hp_field}
                      onChange={handleInputChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {serverError && (
                    <div
                      role="alert"
                      style={{
                        padding: '0.85rem 1.1rem',
                        background: '#FFF5F5',
                        border: '1px solid #FEB2B2',
                        color: '#9B1C1C',
                        borderRadius: 'var(--radius-xs)',
                        marginBottom: '1.5rem',
                        fontSize: '0.86rem',
                        lineHeight: '1.5'
                      }}
                    >
                      <strong>Submission Notice:</strong> {serverError}
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
                        className={`form-input ${fieldErrors.fullName ? 'input-error' : ''}`}
                        placeholder="e.g. Johnathan Vance"
                        value={formFields.fullName}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        aria-invalid={!!fieldErrors.fullName}
                      />
                      {fieldErrors.fullName && (
                        <span className="field-error-text" role="alert">{fieldErrors.fullName}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="companyName">Company / Entity *</label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        required
                        className={`form-input ${fieldErrors.companyName ? 'input-error' : ''}`}
                        placeholder="e.g. Vance Energy Ltd."
                        value={formFields.companyName}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        aria-invalid={!!fieldErrors.companyName}
                      />
                      {fieldErrors.companyName && (
                        <span className="field-error-text" role="alert">{fieldErrors.companyName}</span>
                      )}
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
                        className={`form-input ${fieldErrors.businessEmail ? 'input-error' : ''}`}
                        placeholder="e.g. j.vance@vanceenergy.com"
                        value={formFields.businessEmail}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        aria-invalid={!!fieldErrors.businessEmail}
                      />
                      {fieldErrors.businessEmail && (
                        <span className="field-error-text" role="alert">{fieldErrors.businessEmail}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="country">Country / Jurisdiction *</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        required
                        className={`form-input ${fieldErrors.country ? 'input-error' : ''}`}
                        placeholder="e.g. United Kingdom"
                        value={formFields.country}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        aria-invalid={!!fieldErrors.country}
                      />
                      {fieldErrors.country && (
                        <span className="field-error-text" role="alert">{fieldErrors.country}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="commodity">Commodity of Interest *</label>
                      <select
                        id="commodity"
                        name="commodity"
                        required
                        className={`form-select ${fieldErrors.commodity ? 'input-error' : ''}`}
                        value={formFields.commodity}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        aria-invalid={!!fieldErrors.commodity}
                      >
                        <option value="">Select a Commodity...</option>
                        {commoditiesData.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                        <option value="Other Commodity / Custom">Other Commodity / Custom Requirement</option>
                      </select>
                      {fieldErrors.commodity && (
                        <span className="field-error-text" role="alert">{fieldErrors.commodity}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="deliveryTerms">Preferred Delivery Incoterms</label>
                      <select
                        id="deliveryTerms"
                        name="deliveryTerms"
                        className="form-select"
                        value={formFields.deliveryTerms}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      marginTop: '0.5rem',
                      opacity: isSubmitting ? 0.75 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.65rem'
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span style={{
                          display: 'inline-block',
                          width: '14px',
                          height: '14px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#FFFFFF',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }} />
                        Submitting Enquiry...
                      </>
                    ) : (
                      'Submit Commercial Requirement'
                    )}
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
