import React, { useState } from 'react';
import { LegalTab, PageView } from '../types';
import { Shield, FileText, Lock, CheckCircle, Cookie, AlertCircle, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  setCurrentPage: (page: PageView) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState<LegalTab>('terms');

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
          Legal Architecture & Ethics
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto' }}>
          Review our global terms of syndication, data sovereignty protocols, rigorous journalistic verification standards, and whistleblower confidentiality safeguards.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
        <button 
          className={`cat-tab ${activeTab === 'terms' ? 'active' : ''}`}
          onClick={() => setActiveTab('terms')}
          style={{ borderRadius: 'var(--radius-xs)', padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
        >
          <FileText size={14} style={{ display: 'inline', marginRight: '5px' }} /> Terms of Service
        </button>

        <button 
          className={`cat-tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
          style={{ borderRadius: 'var(--radius-xs)', padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
        >
          <Lock size={14} style={{ display: 'inline', marginRight: '5px' }} /> Privacy & Data Shield
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
        
        {/* 1. Terms */}
        {activeTab === 'terms' && (
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
              Last Amended: October 2026 • Document Ref: BM-TOS-2026.4
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '1.25rem 0 0.75rem' }}>1. Institutional Acceptance of Terms</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              By accessing, referencing, syndicating, or subscribing to the digital publications, market indicators, data streams, and investigative articles provided by <strong>BULLMONK Intelligence Group Ltd.</strong> ("BullMonk", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you are accessing our services on behalf of an institution, fund, or governmental agency, you represent that you possess lawful authority to bind said entity to these terms.
            </p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '2rem 0 0.75rem' }}>2. Intellectual Property & Syndication Rights</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              All proprietary analysis, editorial prose, quantitative charts, audio briefings, investigative reports, and trademarks displayed on BullMonk are the exclusive intellectual property of BullMonk Intelligence Group and its designated correspondents, protected by international copyright conventions (including the Berne Convention and TRIPS Agreement).
            </p>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Non-Commercial Citation:</strong> Academic and non-commercial publications may quote excerpts up to 150 words, provided clear canonical attribution and active hyperlinking to BullMonk are maintained.</li>
              <li><strong>Commercial Redistribution:</strong> Systematic aggregation, automated scraping, or machine learning model ingest without express license requires an institutional syndication agreement.</li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '2rem 0 0.75rem' }}>3. Financial and Market Intelligence Disclaimer</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              The macroeconomic analyses, currency telemetry, commodity models, and company evaluations published on BullMonk are provided strictly for informational, educational, and journalistic purposes. <strong>Nothing published on BullMonk constitutes financial, investment, legal, or tax advice.</strong>
            </p>
          </div>
        )}

        {/* 2. Privacy */}
        {activeTab === 'privacy' && (
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
              GDPR / CCPA / Swiss FADP Compliant • Effective October 2026
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '1.25rem 0 0.75rem' }}>1. The BullMonk Privacy Pledge</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              At BullMonk, data sovereignty is not an afterthought; it is our foundation. As a publisher investigating geopolitical and financial systems, we respect the absolute privacy of our readers, subscribers, and sources. We will never sell, lease, or broker your personal information to third-party ad exchanges or data brokers.
            </p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '2rem 0 0.75rem' }}>2. Information We Collect</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>We restrict data collection to the minimum technical footprint necessary to deliver our services:</p>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Subscriber Contact Data:</strong> Email addresses provided voluntarily for "The Morning Monk" newsletter or institutional dispatches.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Local Storage Preferences:</strong> Your saved reading lists, night/day theme preferences, and locally authored draft articles are stored client-side in your own browser's LocalStorage.</li>
              <li><strong>Anonymous Technical Telemetry:</strong> Aggregated page view counts and latency benchmarks stripped of IP addresses and device identifiers.</li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '2rem 0 0.75rem' }}>3. Whistleblower & Anonymous Source Protection</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Communications sent via our Secure Whistleblower Tip Line are processed through zero-knowledge encrypted channels. BullMonk systems do not log source IP addresses, browser user-agents, or session timestamps for investigative tips.
            </p>
          </div>
        )}

        {/* 3. Editorial Standards */}
        {activeTab === 'editorial' && (
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
              BullMonk Editorial Code of Honor
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '1.25rem 0 0.75rem' }}>1. Absolute Editorial Independence</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              BullMonk operates completely independent of commercial sponsors, sovereign wealth funds, political parties, or financial institutions. No advertiser, shareholder, or parent entity exercises pre-publication editorial review or veto power over our investigative reports.
            </p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '2rem 0 0.75rem' }}>2. Verification & The Two-Source Standard</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Factual claims and leaked documents published as investigative scoops must undergo independent corroboration by at least two distinct, verified sources or verified primary cryptographic/documentary evidence. Where official responses cannot be obtained before publication deadline, reasonable notice is always extended to all named parties.
            </p>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '2rem 0 0.75rem' }}>3. Financial Conflicts of Interest</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              BullMonk financial journalists and macro analysts are strictly barred from trading equities, sovereign debt, derivatives, or tokens within seventy-two (72) hours of authoring or editing reports regarding those specific instruments or industries.
            </p>
          </div>
        )}

        {/* 4. Cookies */}
        {activeTab === 'cookies' && (
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
              Telemetry & Storage Preferences
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '1.25rem 0 0.75rem' }}>1. Client-Side State Philosophy</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              BullMonk prioritizes local client-side state. We do not deploy intrusive cross-site behavioral tracking cookies, canvas fingerprinting scripts, or third-party pixel beacons.
            </p>

            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', margin: '1rem 0' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--accent-gold)' }}>Active Telemetry Controls</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>Customize your client-side storage preferences below:</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span><strong>Essential Platform Cookies</strong> (Theme, Navigation state)</span>
                  <input type="checkbox" defaultChecked disabled style={{ accentColor: 'var(--accent-gold)' }} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span><strong>Local Reading Dossier</strong> (Bookmarks & Drafts storage)</span>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent-gold)' }} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span><strong>Aggregated Dispatch Metrics</strong> (Anonymous read counters)</span>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent-gold)' }} />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 5. Corrections */}
        {activeTab === 'corrections' && (
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
              Transparent Accountability
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '1.25rem 0 0.75rem' }}>1. The BullMonk Errata Protocol</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Trust is fragile and non-negotiable. When factual, quantitative, or typographical errors occur in our reporting, BullMonk corrects them promptly and with full transparency.
            </p>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Substantive Corrections:</strong> Any alteration to fact, quote, or statistical figure is prominently noted at the foot of the dispatch, detailing the exact previous text, the correction, and the timestamp.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Clarity Notes:</strong> Clarifications that provide additional context without altering the underlying factual accuracy are labeled as an "Editorial Note".</li>
              <li><strong>Retraction Standards:</strong> In the rare event that an article's foundational premise is proven unsound, the article will be formally retracted with a signed explanation by the Editor-in-Chief.</li>
            </ul>
          </div>
        )}

      </div>
    </main>
  );
};
