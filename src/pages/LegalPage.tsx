import React, { useState } from 'react';
import { LegalTab, PageView } from '../types';
import { FileText, Lock, Shield, Cookie, AlertCircle, ArrowLeft, DollarSign } from 'lucide-react';

interface LegalPageProps {
  setCurrentPage: (page: PageView) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState<LegalTab>('privacy');

  return (
    <main className="container" style={{ margin: '3rem auto 6rem', maxWidth: '1040px' }}>
      <button 
        className="btn btn-secondary" 
        onClick={() => setCurrentPage('home')}
        style={{ marginBottom: '1.5rem', fontSize: '0.8rem' }}
      >
        <ArrowLeft size={14} /> Back to Global Wire
      </button>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontFamily: 'var(--font-brand)', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--accent-gold)' }}>
          Transparency, Privacy & Editorial Sovereignty
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: '0.5rem 0 0.8rem' }}>
          Legal Suite & Compliance Architecture
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto' }}>
          Fully compliant with Google AdSense Publisher Policies, GDPR, CCPA, Swiss FADP, and international financial disclosure standards.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
        <button 
          className={`cat-tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
          style={{ borderRadius: 'var(--radius-xs)', padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
        >
          <Lock size={14} style={{ display: 'inline', marginRight: '5px' }} /> Privacy Policy (AdSense & GDPR)
        </button>

        <button 
          className={`cat-tab ${activeTab === 'financial-disclaimer' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial-disclaimer')}
          style={{ borderRadius: 'var(--radius-xs)', padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
        >
          <DollarSign size={14} style={{ display: 'inline', marginRight: '5px' }} /> Financial & YMYL Disclaimer
        </button>

        <button 
          className={`cat-tab ${activeTab === 'terms' ? 'active' : ''}`}
          onClick={() => setActiveTab('terms')}
          style={{ borderRadius: 'var(--radius-xs)', padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
        >
          <FileText size={14} style={{ display: 'inline', marginRight: '5px' }} /> Terms of Service
        </button>

        <button 
          className={`cat-tab ${activeTab === 'editorial' ? 'active' : ''}`}
          onClick={() => setActiveTab('editorial')}
          style={{ borderRadius: 'var(--radius-xs)', padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
        >
          <Shield size={14} style={{ display: 'inline', marginRight: '5px' }} /> Editorial Standards & Ethics
        </button>

        <button 
          className={`cat-tab ${activeTab === 'cookies' ? 'active' : ''}`}
          onClick={() => setActiveTab('cookies')}
          style={{ borderRadius: 'var(--radius-xs)', padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
        >
          <Cookie size={14} style={{ display: 'inline', marginRight: '5px' }} /> Cookie Telemetry
        </button>

        <button 
          className={`cat-tab ${activeTab === 'corrections' ? 'active' : ''}`}
          onClick={() => setActiveTab('corrections')}
          style={{ borderRadius: 'var(--radius-xs)', padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
        >
          <AlertCircle size={14} style={{ display: 'inline', marginRight: '5px' }} /> Corrections Policy
        </button>
      </div>

      {/* Content Panes */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'clamp(1.5rem, 4vw, 2.75rem)', lineHeight: '1.75' }}>
        
        {/* 1. Privacy Policy (AdSense Strict Requirement) */}
        {activeTab === 'privacy' && (
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
              Google AdSense, GDPR, CCPA & Swiss FADP Compliant • Effective October 2026
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '1.25rem 0 0.75rem' }}>
              Privacy Policy & Advertising Disclosures
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              At <strong>BULLMONK Intelligence Group Ltd.</strong> ("BullMonk", "we", "our", or "us"), we prioritize data sovereignty and transparent user privacy. This Privacy Policy outlines our data handling policies, cookie telemetry, and third-party advertising disclosures in full compliance with Google AdSense publisher terms, the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and international standards.
            </p>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: '1.75rem 0 0.5rem', color: 'var(--text-primary)' }}>
              1. Third-Party Advertising & Google AdSense Disclosure
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              BullMonk partners with third-party advertising networks, primarily <strong>Google AdSense</strong>, to display commercial advertisements when you visit our website. Please be advised of the following required disclosures:
            </p>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Cookie Usage for Advertising:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites across the Internet.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>DoubleClick DART Cookie:</strong> Google's use of advertising cookies enables it and its partner network to serve personalized advertisements to users based on their visits to BullMonk and/or other sites on the web.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Opt-Out Mechanism:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>Google Ads Settings</a>. Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>www.aboutads.info</a>.
              </li>
            </ul>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: '1.75rem 0 0.5rem', color: 'var(--text-primary)' }}>
              2. Information We Collect
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              We restrict direct data collection to minimal operational requirements:
            </p>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Email Subscriptions:</strong> Institutional email addresses provided voluntarily for "The Morning Monk" daily newsletter.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Local Dossier Preferences:</strong> Bookmarked stories, drafts, and theme preferences stored locally in your browser's LocalStorage.</li>
              <li><strong>Anonymous Web Telemetry:</strong> Anonymized server telemetry (via Google Analytics gtag.js) for page view statistics, load speed optimization, and country-level traffic distribution.</li>
            </ul>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: '1.75rem 0 0.5rem', color: 'var(--text-primary)' }}>
              3. Whistleblower & Source Confidentiality
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Submissions received through our Secure Whistleblower Tip Line are processed through air-gapped zero-metadata channels. IP addresses and browser fingerprints are permanently discarded upon receipt.
            </p>
          </div>
        )}

        {/* 2. Financial Disclaimer (YMYL Policy for AdSense) */}
        {activeTab === 'financial-disclaimer' && (
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
              Your Money Your Life (YMYL) Governance Charter
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '1.25rem 0 0.75rem' }}>
              Financial, Macroeconomic & Investment Risk Disclaimer
            </h2>
            <div style={{ background: 'var(--bg-surface-elevated)', borderLeft: '4px solid var(--accent-gold)', padding: '1.25rem 1.5rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', margin: '1.5rem 0' }}>
              <strong style={{ color: 'var(--text-primary)' }}>CRITICAL NOTICE:</strong> BullMonk is an independent journalistic publication and news agency. We do not provide personalized financial, legal, tax, or investment advice.
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              All articles, macroeconomic models, currency indicators, bond yield reports, commodity statistics, and central bank analyses published on BullMonk are prepared exclusively for general informational, educational, and journalistic purposes.
            </p>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: '1.5rem 0 0.5rem' }}>No Fiduciary Relationship</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Viewing, reading, or referencing content on BullMonk does not create a fiduciary, advisory, broker-dealer, or client relationship. Neither BullMonk nor its contributing journalists, editors, or analysts are registered investment advisors (RIAs), registered broker-dealers, or financial planners under United States FINRA/SEC regulations, UK FCA rules, European ESMA guidelines, or Indian SEBI regulations.
            </p>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: '1.5rem 0 0.5rem' }}>Capital Loss & Volatility Risk</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Sovereign bonds, foreign exchange (Forex), equities, digital assets, and commodities involve substantial volatility and potential risk of total capital loss. Historical price movements and central bank policy precedents discussed in our dispatches do not guarantee future performance. Readers must conduct independent due diligence and consult accredited fiduciary financial advisors before allocating capital.
            </p>
          </div>
        )}

        {/* 3. Terms of Service */}
        {activeTab === 'terms' && (
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
              Document Ref: BM-TOS-2026.4
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '1.25rem 0 0.75rem' }}>Terms of Service</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              By accessing, referencing, syndicating, or subscribing to the digital publications, market indicators, data streams, and investigative articles provided by BULLMONK Intelligence Group Ltd., you agree to be bound by these Terms of Service.
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: '1.5rem 0 0.5rem' }}>Intellectual Property & Syndication</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              All proprietary reporting, investigative prose, quantitative charts, and trademarks displayed on BullMonk are the intellectual property of BullMonk Intelligence Group and its correspondents, protected under international copyright conventions.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              Non-commercial quotations up to 150 words are permitted with active canonical hyperlinking. Wholesale aggregation or unauthorized AI model training ingest requires express written syndication licensing.
            </p>
          </div>
        )}

        {/* 4. Editorial Standards */}
        {activeTab === 'editorial' && (
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
              BullMonk Editorial Code of Honor
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '1.25rem 0 0.75rem' }}>Editorial Standards & Ethics</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              BullMonk operates under total editorial independence. No commercial advertiser, sponsor, or sovereign entity exercises pre-publication review or editorial veto over our investigations.
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: '1.5rem 0 0.5rem' }}>Two-Source Verification Protocol</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Factual claims and leaked documents must undergo independent corroboration by at least two distinct verified sources or cryptographically authenticated primary records before publishing.
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: '1.5rem 0 0.5rem' }}>Trading Prohibition</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Our financial correspondents and editors are barred from trading securities or derivatives within seventy-two (72) hours of authoring or editing reports regarding those specific assets or sectors.
            </p>
          </div>
        )}

        {/* 5. Cookie Telemetry */}
        {activeTab === 'cookies' && (
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
              Telemetry & Storage Preferences
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '1.25rem 0 0.75rem' }}>Cookie & Telemetry Policy</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              BullMonk respects client-side state sovereignty. You can inspect and toggle your cookie preferences below:
            </p>

            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span><strong>Essential Platform Cookies</strong> (Theme state, routing)</span>
                  <input type="checkbox" defaultChecked disabled style={{ accentColor: 'var(--accent-gold)' }} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span><strong>Advertising Cookies</strong> (Google AdSense personalization opt-in)</span>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent-gold)' }} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span><strong>Performance Analytics</strong> (Google Analytics gtag.js anonymous metrics)</span>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent-gold)' }} />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 6. Corrections Policy */}
        {activeTab === 'corrections' && (
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
              Transparent Accountability
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '1.25rem 0 0.75rem' }}>Corrections & Errata Protocol</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Trust is non-negotiable. When factual or quantitative errors occur in our reporting, BullMonk corrects them promptly and with full public transparency.
            </p>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Substantive Corrections:</strong> Any alteration to fact, quote, or statistical figure is prominently noted at the foot of the dispatch, detailing the exact previous text and timestamp.</li>
              <li><strong>Retraction Standards:</strong> If an article’s core premise is proven inaccurate, it is formally retracted with a signed statement by the Editor-in-Chief.</li>
            </ul>
            <p style={{ color: 'var(--text-secondary)' }}>
              To report errors, contact <code style={{ color: 'var(--accent-gold)' }}>corrections@bullmonk.intelligence</code>.
            </p>
          </div>
        )}

      </div>
    </main>
  );
};
