import React from 'react';
import { PageView } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LegalNav } from '../components/LegalNav';
import { Lock, Shield, ExternalLink, CheckCircle, Mail, AlertTriangle, ArrowRight } from 'lucide-react';

interface PrivacyPolicyPageProps {
  setCurrentPage: (page: PageView) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ setCurrentPage }) => {
  return (
    <main className="container" style={{ margin: '2rem auto 5rem', maxWidth: '1040px' }}>
      {/* 1. Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Legal & Governance Suite', page: 'legal' },
          { label: 'Privacy Policy & Advertising Disclosures', active: true }
        ]}
        setCurrentPage={setCurrentPage}
      />

      {/* 2. Legal Sub-Nav */}
      <LegalNav currentPage="privacy" setCurrentPage={setCurrentPage} />

      {/* 3. Document Header */}
      <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span className="region-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Lock size={12} /> Google AdSense & GDPR Certified
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Document Ref: BM-SEC-PRIV-2026.04 • Effective October 2026
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, margin: '0.5rem 0 1rem', lineHeight: 1.2 }}>
          Privacy Policy & Global Advertising Disclosures
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: '1.7', maxWidth: '820px' }}>
          This Privacy Policy sets forth the privacy architecture, cryptographic source protection protocols, and third-party advertising disclosures of <strong>BULLMONK Intelligence Group Ltd.</strong> ("BullMonk", "we", "us", or "our"). This document rigorously enforces compliance with Google AdSense Publisher Policies, the European Union General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), the Swiss Federal Act on Data Protection (FADP), and global data privacy standards.
        </p>
      </header>

      {/* 4. Main Content Body */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '3rem', alignItems: 'start' }} className="legal-layout-grid">
        
        {/* Left Column: Full Legal Sections */}
        <article style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'clamp(1.5rem, 3.5vw, 2.75rem)', lineHeight: '1.8' }}>
          
          {/* Section 1 */}
          <section id="adsense-disclosure" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>01</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Third-Party Advertising & Google AdSense Publisher Compliance
              </h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              BullMonk finances its independent global newsrooms, quantitative macroeconomic models, and investigative foreign bureaus in part through digital advertising partnerships, primarily <strong>Google AdSense</strong> (Publisher Client ID: <code>ca-pub-7155174810446636</code>). In strict compliance with Google Publisher Terms, we disclose the following operational telemetry:
            </p>

            <div style={{ background: 'var(--bg-surface-elevated)', borderLeft: '4px solid var(--accent-gold)', padding: '1.25rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
                DoubleClick DART Cookie Notice
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
                Google, as a third-party vendor, utilizes cookies to serve commercial advertisements on BullMonk. Google's use of the DoubleClick DART cookie enables it and its advertising network partners to serve contextual and interest-based ads to visitors based on prior visits to BullMonk and other destinations across the World Wide Web.
              </p>
            </div>

            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <strong>Third-Party Ad Networks:</strong> Third-party ad servers or ad networks use technology that sends advertisements and links directly to your browser. They automatically receive your IP address when this occurs. Other technologies (such as cookies, JavaScript, or Web Beacons) may also be used by our third-party ad networks to measure the effectiveness of their advertising campaigns and to personalize the advertising content that you see.
              </li>
              <li>
                <strong>Absence of Editorial Control:</strong> BullMonk has zero access to or control over these cookies used by third-party advertisers. We do not transmit personally identifiable information (PII) to ad brokers.
              </li>
              <li>
                <strong>Opt-Out Mechanism (Personalized Advertising):</strong> Users may permanently opt out of personalized Google advertising by visiting the official <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline', fontWeight: 600 }}>Google Ads Settings Portal <ExternalLink size={12} style={{ display: 'inline' }} /></a>.
              </li>
              <li>
                <strong>Industry-Wide Opt-Out:</strong> Alternatively, you can opt out of third-party vendor cookies across hundreds of ad networks simultaneously through the Digital Advertising Alliance at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline', fontWeight: 600 }}>aboutads.info/choices <ExternalLink size={12} style={{ display: 'inline' }} /></a> or European users via <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline', fontWeight: 600 }}>Your Online Choices <ExternalLink size={12} style={{ display: 'inline' }} /></a>.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="data-collected" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>02</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Information We Collect & Data Minimization
              </h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              BullMonk is engineered under a strict <em>Data Minimization by Design</em> framework. Reading our investigative articles, wire dispatches, and macroeconomic reports requires zero registration, zero phone numbers, and zero mandatory identity disclosures.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', margin: '1.25rem 0' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                  📩 Newsletter Dispatch
                </span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Voluntary email submissions for "The Morning Monk". Used solely to transmit editorial digests; never sold, rented, or co-marketed.
                </span>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                  💾 Client-Side Storage
                </span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Bookmarked dossiers, theme preference, and reading progress reside strictly within your local browser's LocalStorage and are never sent to BullMonk central servers.
                </span>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                  📊 Anonymized Web Metrics
                </span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Google Analytics (gtag.js ID: <code>G-CKPQGSX23W</code>) operates with IP anonymization to compute aggregated latency, reader engagement, and geographic bureau reach.
                </span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="whistleblower-protection" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>03</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Whistleblower & Source Confidentiality Architecture
              </h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Journalistic source privilege is sacred at BullMonk. When sources submit documentation via our Secure Tip Line:
            </p>

            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Zero-Metadata Ingestion:</strong> Inbound IP addresses, user-agent strings, and hardware fingerprints are stripped in volatile memory before payloads touch storage.</li>
              <li><strong>End-to-End Encryption:</strong> Leaked materials are encrypted using PGP keys held exclusively by senior investigative editors across air-gapped workstations.</li>
              <li><strong>No Third-Party Access:</strong> Whistleblower channels bypass all commercial analytics, advertising trackers, and third-party CDNs.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="gdpr-ccpa-rights" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>04</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                GDPR (EU/EEA), UK DPA & CCPA Consumer Rights
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Regardless of your geographic location, BullMonk extends comprehensive data rights to all readers:
            </p>

            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Right of Access & Portability:</strong> Request confirmation of any data associated with your email newsletter address.</li>
              <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request immediate permanent deletion of your email subscription and reader logs.</li>
              <li><strong>Right to Restrict or Object to Processing:</strong> Unsubscribe with a single click at any time via the foot of every newsletter.</li>
              <li><strong>California CCPA "Do Not Sell My Info":</strong> BullMonk does NOT sell, monetize, or barter reader personal data to data brokers or marketing conglomerates.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="dpo-contact">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>05</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Data Protection Officer & Editorial Inquiries
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              For formal inquiries, GDPR supervisory escalations, or data removal requests, contact the BullMonk Office of the Data Protection Officer:
            </p>

            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div><strong>Corporate Entity:</strong> BULLMONK Intelligence Group Ltd.</div>
              <div><strong>Bureaus:</strong> London (140 Leadenhall St), Zurich (Bahnhofstrasse 45), Lower Manhattan (One World Trade)</div>
              <div><strong>Data Protection Officer:</strong> <code style={{ color: 'var(--accent-gold)' }}>dpo@bullmonk.intelligence</code></div>
              <div><strong>Legal & Compliance Desk:</strong> <code style={{ color: 'var(--accent-gold)' }}>legal@bullmonk.intelligence</code></div>
            </div>
          </section>

        </article>

        {/* Right Column: Quick Navigation & Companion Disclosures */}
        <aside style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Table of contents */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
              In This Document
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
              <a href="#adsense-disclosure" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>01. Google AdSense Disclosures</a>
              <a href="#data-collected" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>02. Data Minimization Protocol</a>
              <a href="#whistleblower-protection" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>03. Whistleblower Anonymity</a>
              <a href="#gdpr-ccpa-rights" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>04. GDPR & CCPA Rights</a>
              <a href="#dpo-contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>05. Contact Data Controller</a>
            </nav>
          </div>

          {/* Sibling Legal Documents Card */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
              Companion Charters
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem' }}>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setCurrentPage('disclaimer')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Financial & YMYL Disclaimer</span>
                <ArrowRight size={13} />
              </button>

              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setCurrentPage('terms')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Terms of Service</span>
                <ArrowRight size={13} />
              </button>

              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setCurrentPage('cookies')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Cookie Telemetry Manager</span>
                <ArrowRight size={13} />
              </button>

              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setCurrentPage('editorial')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Editorial Ethics Code</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* AdSense Verification Badge */}
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center' }}>
            <Shield size={24} color="var(--accent-gold)" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.25rem' }}>AdSense Verified Policy</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Compliant with Google AdSense, GDPR, CCPA & Privacy Sandbox standards.
            </div>
          </div>

        </aside>

      </div>
    </main>
  );
};
