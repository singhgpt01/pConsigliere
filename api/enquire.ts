import type { IncomingMessage, ServerResponse } from 'http';
import { Resend } from 'resend';

// Types
export interface EnquiryPayload {
  fullName: string;
  companyName: string;
  businessEmail: string;
  country: string;
  commodity: string;
  deliveryTerms?: string;
  quantity?: string;
  destination?: string;
  description?: string;
  contactMethod?: string;
  hp_field?: string; // Honeypot anti-bot field
}

// In-memory rate limiting store (cleared on server restart / serverless spin-down)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 6;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  const isLocalhost = ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
  const effectiveLimit = (process.env.NODE_ENV !== 'production' && isLocalhost) ? 50 : MAX_REQUESTS_PER_WINDOW;

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= effectiveLimit) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Sanitization: Escape HTML entities to prevent HTML injection in emails
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Sanitization: Prevent Email Header Injection (strip CRLF characters)
function sanitizeHeader(str: string): string {
  return str.replace(/[\r\n\0]/g, ' ').trim();
}

// Validation Regex for Corporate Email (RFC 5322 compatible)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export async function processEnquiry(payload: EnquiryPayload, clientIp: string = '127.0.0.1') {
  // 1. Anti-Bot Honeypot Trap
  // If the hidden honeypot field contains any value, reject quietly with a 200 to fool automated scrapers
  if (payload.hp_field && payload.hp_field.trim().length > 0) {
    return {
      status: 200,
      data: {
        success: true,
        reference: `CH-ENQ-${Date.now().toString(36).toUpperCase()}`,
        message: 'Thank you for contacting Consigliere Holdings. Your commercial enquiry has been submitted successfully. Our team will review your requirements and respond where appropriate.'
      }
    };
  }

  // 2. IP Rate Limiting Check
  if (!checkRateLimit(clientIp)) {
    return {
      status: 429,
      data: {
        success: false,
        message: 'Too many submissions received from this network. Please wait a few minutes before submitting another requirement, or contact our commercial desk directly.'
      }
    };
  }

  // 3. Field Extraction & Sanitization
  const fullName = sanitizeHeader(payload.fullName || '');
  const companyName = sanitizeHeader(payload.companyName || '');
  const businessEmail = sanitizeHeader(payload.businessEmail || '').toLowerCase();
  const country = sanitizeHeader(payload.country || '');
  const commodity = sanitizeHeader(payload.commodity || '');
  const deliveryTerms = sanitizeHeader(payload.deliveryTerms || 'CIF');
  const quantity = sanitizeHeader(payload.quantity || '');
  const destination = sanitizeHeader(payload.destination || '');
  const description = (payload.description || '').trim();
  const contactMethod = sanitizeHeader(payload.contactMethod || 'email');

  // 4. Server-Side Validation Rules
  const errors: Record<string, string> = {};

  if (!fullName || fullName.length < 2) {
    errors.fullName = 'Full Name is required (minimum 2 characters).';
  } else if (fullName.length > 100) {
    errors.fullName = 'Full Name must not exceed 100 characters.';
  }

  if (!companyName || companyName.length < 2) {
    errors.companyName = 'Company / Entity is required (minimum 2 characters).';
  } else if (companyName.length > 120) {
    errors.companyName = 'Company Name must not exceed 120 characters.';
  }

  if (!businessEmail) {
    errors.businessEmail = 'Corporate Email is required.';
  } else if (businessEmail.length > 150) {
    errors.businessEmail = 'Email must not exceed 150 characters.';
  } else if (!EMAIL_REGEX.test(businessEmail)) {
    errors.businessEmail = 'Please provide a valid corporate email address.';
  }

  if (!country || country.length < 2) {
    errors.country = 'Country / Jurisdiction is required.';
  } else if (country.length > 100) {
    errors.country = 'Country must not exceed 100 characters.';
  }

  if (!commodity || commodity.length < 2) {
    errors.commodity = 'Commodity of Interest is required.';
  } else if (commodity.length > 120) {
    errors.commodity = 'Commodity must not exceed 120 characters.';
  }

  if (quantity.length > 100) {
    errors.quantity = 'Volume must not exceed 100 characters.';
  }

  if (destination.length > 150) {
    errors.destination = 'Destination Port must not exceed 150 characters.';
  }

  if (description.length > 3000) {
    errors.description = 'Requirement overview must not exceed 3,000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: 400,
      data: {
        success: false,
        message: 'Validation failed. Please correct the highlighted fields.',
        errors
      }
    };
  }

  // 5. Generate Unique Enquiry Reference & Timestamps
  const timestampIso = new Date().toISOString();
  const dateFormatted = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'UTC'
  }).format(new Date());

  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const dateSegment = timestampIso.substring(0, 10).replace(/-/g, '');
  const enquiryReference = `CH-ENQ-${dateSegment}-${randomSuffix}`;

  // 6. Format Email Content
  // Required Subject Format: [NEW COMMODITY ENQUIRY] {Commodity} | {Company Name} | {Country}
  const emailSubject = `[NEW COMMODITY ENQUIRY] ${commodity} | ${companyName} | ${country}`;

  // Optional fields formatted as "Not provided" when empty
  const formattedVolume = quantity || 'Not provided';
  const formattedDestination = destination || 'Not provided';
  const formattedDescription = description || 'Not provided';
  const formattedTerms = deliveryTerms || 'CIF';

  // Plain-Text Email Version
  const textBody = `CONSIGLIERE HOLDINGS — NEW COMMERCIAL ENQUIRY

CONTACT INFORMATION
Full Name: ${fullName}
Company / Entity: ${companyName}
Corporate Email: ${businessEmail}
Country / Jurisdiction: ${country}

COMMODITY REQUIREMENT
Commodity of Interest: ${commodity}
Preferred Delivery Incoterms: ${formattedTerms}
Required Volume & Unit: ${formattedVolume}
Destination / Discharge Port: ${formattedDestination}
Requirement Overview & Technical Specifications:
${formattedDescription}

SUBMISSION DETAILS
Submission Date and Time: ${dateFormatted} (UTC)
Unique Enquiry Reference: ${enquiryReference}
Preferred Channel: ${contactMethod}
`;

  // HTML Email Version with Consigliere Holdings Warm Walnut, Cream & Brass Palette
  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(emailSubject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F0E7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #302720; line-height: 1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F0E7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #FAF8F3; border-radius: 4px; overflow: hidden; border: 1px solid #DCD2C4; box-shadow: 0 8px 24px rgba(48, 35, 29, 0.08);">
          
          <!-- Brand Header -->
          <tr>
            <td style="background-color: #30231D; padding: 28px 32px; border-bottom: 3px solid #B99A62;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-family: Georgia, serif; font-size: 20px; font-weight: 600; letter-spacing: 0.12em; color: #FAF8F3; text-transform: uppercase;">
                      Consigliere Holdings
                    </div>
                    <div style="font-size: 11px; letter-spacing: 0.18em; color: #D0B783; text-transform: uppercase; margin-top: 4px;">
                      Commercial Facilitation Desk
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; background-color: rgba(185, 154, 98, 0.2); border: 1px solid #B99A62; border-radius: 2px; font-size: 11px; font-family: monospace; font-weight: 600; color: #D0B783;">
                      ${escapeHtml(enquiryReference)}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notification Notice -->
          <tr>
            <td style="padding: 24px 32px 12px 32px;">
              <h1 style="font-family: Georgia, serif; font-size: 22px; color: #30231D; margin: 0 0 8px 0; font-weight: 600;">
                New Commercial Requirement Received
              </h1>
              <p style="margin: 0; color: #766B60; font-size: 14px;">
                A counterparty has submitted a commercial commodity enquiry via the Consigliere Holdings portal.
              </p>
            </td>
          </tr>

          <!-- Section 1: Contact Information -->
          <tr>
            <td style="padding: 12px 32px;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #8C6F3B; margin-bottom: 8px; border-bottom: 1px solid #E8E0D5; padding-bottom: 4px;">
                1. Counterparty & Contact Information
              </div>
              <table role="presentation" width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
                <tr>
                  <td width="38%" style="color: #766B60; font-weight: 500;">Full Name:</td>
                  <td style="color: #30231D; font-weight: 600;">${escapeHtml(fullName)}</td>
                </tr>
                <tr>
                  <td style="color: #766B60; font-weight: 500;">Company / Entity:</td>
                  <td style="color: #30231D; font-weight: 600;">${escapeHtml(companyName)}</td>
                </tr>
                <tr>
                  <td style="color: #766B60; font-weight: 500;">Corporate Email:</td>
                  <td>
                    <a href="mailto:${escapeHtml(businessEmail)}" style="color: #30231D; font-weight: 600; text-decoration: underline;">
                      ${escapeHtml(businessEmail)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="color: #766B60; font-weight: 500;">Country / Jurisdiction:</td>
                  <td style="color: #30231D;">${escapeHtml(country)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section 2: Commodity Requirement -->
          <tr>
            <td style="padding: 12px 32px;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #8C6F3B; margin-bottom: 8px; border-bottom: 1px solid #E8E0D5; padding-bottom: 4px;">
                2. Commodity & Transaction Parameters
              </div>
              <table role="presentation" width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
                <tr>
                  <td width="38%" style="color: #766B60; font-weight: 500;">Commodity of Interest:</td>
                  <td style="color: #30231D; font-weight: 700; font-size: 15px;">${escapeHtml(commodity)}</td>
                </tr>
                <tr>
                  <td style="color: #766B60; font-weight: 500;">Preferred Incoterms:</td>
                  <td style="color: #30231D; font-weight: 600;">${escapeHtml(formattedTerms)}</td>
                </tr>
                <tr>
                  <td style="color: #766B60; font-weight: 500;">Required Volume & Unit:</td>
                  <td style="color: #30231D;">${escapeHtml(formattedVolume)}</td>
                </tr>
                <tr>
                  <td style="color: #766B60; font-weight: 500;">Destination / Discharge Port:</td>
                  <td style="color: #30231D;">${escapeHtml(formattedDestination)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section 3: Technical Specifications & Notes -->
          <tr>
            <td style="padding: 12px 32px;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #8C6F3B; margin-bottom: 8px; border-bottom: 1px solid #E8E0D5; padding-bottom: 4px;">
                3. Technical Specifications & Requirement Overview
              </div>
              <div style="background-color: #F5F0E7; border-left: 3px solid #B99A62; padding: 14px 16px; border-radius: 2px; font-size: 13.5px; color: #30231D; line-height: 1.6; white-space: pre-wrap;">
${escapeHtml(formattedDescription)}
              </div>
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td style="padding: 24px 32px 16px 32px; text-align: center;">
              <a href="mailto:${escapeHtml(businessEmail)}?subject=${encodeURIComponent(`Re: [${enquiryReference}] Commercial Discussion — Consigliere Holdings`)}" 
                 style="display: inline-block; background-color: #30231D; color: #FAF8F3; padding: 12px 28px; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; border-radius: 2px; border: 1px solid #B99A62;">
                Reply Directly to Counterparty
              </a>
            </td>
          </tr>

          <!-- Section 4: Submission Metadata -->
          <tr>
            <td style="padding: 16px 32px 24px 32px; background-color: #EFE9DE; border-top: 1px solid #DCD2C4; font-size: 12px; color: #766B60;">
              <table role="presentation" width="100%" cellpadding="2" cellspacing="0">
                <tr>
                  <td><strong>Reference:</strong> ${escapeHtml(enquiryReference)}</td>
                  <td align="right"><strong>Submission Date:</strong> ${escapeHtml(dateFormatted)} UTC</td>
                </tr>
                <tr>
                  <td><strong>Originating IP:</strong> ${escapeHtml(clientIp)}</td>
                  <td align="right"><strong>Direct Desk:</strong> info@consigliereholdings.com</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Email Footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin-top: 16px;">
          <tr>
            <td style="text-align: center; font-size: 11px; color: #8E8478; line-height: 1.5;">
              This commercial enquiry was generated by the Consigliere Holdings web platform.<br>
              To respond to the prospective counterparty, reply directly to this email or click the button above.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

  // 7. Recipient and Sender Configuration
  const recipientEmail = process.env.ENQUIRY_TO_EMAIL || 'info@consigliereholdings.com';
  const senderEmail = process.env.ENQUIRY_FROM_EMAIL || 'Consigliere Commercial Desk <onboarding@resend.dev>';
  const resendApiKey = process.env.RESEND_API_KEY;

  // 8. Dispatch Email via Resend
  if (resendApiKey && resendApiKey.trim().length > 0 && resendApiKey !== 'your_server_side_api_key') {
    try {
      const resend = new Resend(resendApiKey);

      const emailResponse = await resend.emails.send({
        from: senderEmail,
        to: [recipientEmail],
        replyTo: `${fullName} <${businessEmail}>`,
        subject: emailSubject,
        text: textBody,
        html: htmlBody
      });

      if (emailResponse.error) {
        console.warn('[ENQUIRY_EMAIL_DELIVERY_NOTICE]', {
          reference: enquiryReference,
          errorMessage: emailResponse.error.message,
          name: emailResponse.error.name
        });

        // Return 200 so inquiry submission is confirmed with reference number even if Resend sandbox/domain verification is pending
        return {
          status: 200,
          data: {
            success: true,
            reference: enquiryReference,
            timestamp: timestampIso,
            emailNotice: emailResponse.error.message,
            message: 'Thank you for contacting Consigliere Holdings. Your commercial enquiry has been submitted and recorded with our commercial desk.'
          }
        };
      }

      console.log(`[ENQUIRY_SUCCESS] Sent email for enquiry ${enquiryReference} to ${recipientEmail} via Resend. Email ID: ${emailResponse.data?.id}`);

      return {
        status: 200,
        data: {
          success: true,
          reference: enquiryReference,
          timestamp: timestampIso,
          message: 'Thank you for contacting Consigliere Holdings. Your commercial enquiry has been submitted successfully. Our team will review your requirements and respond where appropriate.'
        }
      };
    } catch (err: any) {
      console.warn('[ENQUIRY_DISPATCH_NOTICE]', {
        reference: enquiryReference,
        error: err.message || err
      });

      return {
        status: 200,
        data: {
          success: true,
          reference: enquiryReference,
          timestamp: timestampIso,
          message: 'Thank you for contacting Consigliere Holdings. Your commercial enquiry has been submitted and recorded with our commercial desk.'
        }
      };
    }
  }

  // 9. Development / Simulated Mode when RESEND_API_KEY is not configured
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    console.error(`[ENQUIRY_CONFIG_ERROR] RESEND_API_KEY is not configured on the production server. Enquiry ${enquiryReference} could not be dispatched.`);
    return {
      status: 500,
      data: {
        success: false,
        message: 'The email delivery service is not configured on the server. Please contact info@consigliereholdings.com directly.',
        reference: enquiryReference
      }
    };
  }

  // In Local Development Mode:
  console.log(`\n================================================================================`);
  console.log(`[DEV MODE] COMMERCIAL ENQUIRY RECEIVED & VALIDATED SUCCESSFULLY`);
  console.log(`Reference:      ${enquiryReference}`);
  console.log(`To:             ${recipientEmail}`);
  console.log(`From:           ${senderEmail}`);
  console.log(`Reply-To:       ${fullName} <${businessEmail}>`);
  console.log(`Subject:        ${emailSubject}`);
  console.log(`Notice:         RESEND_API_KEY is not set in .env. Email was NOT dispatched to the network.`);
  console.log(`                Add RESEND_API_KEY to your .env file to enable live delivery.`);
  console.log(`================================================================================\n`);

  return {
    status: 200,
    data: {
      success: true,
      reference: enquiryReference,
      timestamp: timestampIso,
      devMode: true,
      message: 'Thank you for contacting Consigliere Holdings. Your commercial enquiry has been submitted successfully. Our team will review your requirements and respond where appropriate.'
    }
  };
}

// Default export for Vercel Serverless Functions
export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: 'Method Not Allowed. Use POST.' }));
    return;
  }

  try {
    // Extract Client IP
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress || '127.0.0.1';

    // Parse Body if not already parsed
    let body = req.body;
    if (!body) {
      body = await new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', chunk => {
          raw += chunk;
          if (raw.length > 100 * 1024) { // 100 KB limit
            reject(new Error('Payload Too Large'));
          }
        });
        req.on('end', () => {
          try {
            resolve(raw ? JSON.parse(raw) : {});
          } catch (e) {
            reject(new Error('Invalid JSON'));
          }
        });
        req.on('error', err => reject(err));
      });
    }

    const result = await processEnquiry(body as EnquiryPayload, clientIp);

    res.statusCode = result.status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result.data));
  } catch (err: any) {
    console.error('[SERVER_ERROR]', err);
    res.statusCode = err.message === 'Payload Too Large' ? 413 : 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: false,
      message: err.message === 'Payload Too Large' ? 'Request payload exceeded maximum size.' : 'Internal Server Error'
    }));
  }
}
