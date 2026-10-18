import React from 'react';
import { PageView } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LegalNav } from '../components/LegalNav';
import { DollarSign, AlertTriangle, ShieldCheck, TrendingDown, ArrowRight, BookOpen } from 'lucide-react';

interface FinancialDisclaimerPageProps {
  setCurrentPage: (page: PageView) => void;
}

export const FinancialDisclaimerPage: React.FC<FinancialDisclaimerPageProps> = ({ setCurrentPage }) => {
  return (
    <main className="container" style={{ margin: '2rem auto 5rem', maxWidth: '1040px' }}>
      {/* 1. Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Legal & Governance Suite', page: 'legal' },
          { label: 'Financial & YMYL Risk Disclaimer', active: true }
        ]}
        setCurrentPage={setCurrentPage}
      />

      {/* 2. Legal Sub-Nav */}
      <LegalNav currentPage="disclaimer" setCurrentPage={setCurrentPage} />

      {/* 3. Header */}
      <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span className="region-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }}>
            <AlertTriangle size={12} /> YMYL Financial Governance Notice
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Regulatory Ref: BM-YMYL-DISC-2026.02 • Global Wire Standard
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, margin: '0.5rem 0 1rem', lineHeight: 1.2 }}>
          Financial, Macroeconomic & Investment Risk Disclaimer
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: '1.7', maxWidth: '820px' }}>
          This charter defines the journalistic boundaries of <strong>BULLMONK Intelligence Group Ltd.</strong> In compliance with international financial market regulators (US SEC, FINRA, UK FCA, European ESMA, and Indian SEBI) and Google AdSense "Your Money or Your Life" (YMYL) content quality standards, readers are bound by the statutory disclaimers detailed below.
        </p>
      </header>

      {/* Critical Highlight Alert Banner */}
      <div 
        style={{
          background: 'var(--bg-surface-elevated)',
          borderLeft: '5px solid var(--accent-gold)',
          borderRight: '1px solid var(--border-subtle)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}
      >
        <AlertTriangle size={24} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.4rem', color: 'var(--text-primary)' }}>
            MANDATORY NOTICE: INDEPENDENT JOURNALISTIC MEDIA — NOT FINANCIAL ADVICE
          </h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            BullMonk is a digital investigative news publication and macroeconomic analytical intelligence platform. <strong>BullMonk does not provide personalized investment advice, wealth management, asset allocation consulting, securities brokerage, tax advisory, or legal counsel.</strong> All content is prepared exclusively for general informational, educational, and macroeconomic research purposes.
          </p>
        </div>
      </div>

      {/* 4. Main Content Body */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '3rem', alignItems: 'start' }} className="legal-layout-grid">
        
        {/* Left Column: Full Legal Sections */}
        <article style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'clamp(1.5rem, 3.5vw, 2.75rem)', lineHeight: '1.8' }}>
          
          {/* Section 1 */}
          <section id="no-fiduciary" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>01</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                No Fiduciary Relationship or Investment Advisory Capacity
              </h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Accessing, viewing, streaming, or bookmarking any article, market ticker, bond yield chart, or geopolitical report on BullMonk does not establish an advisory, fiduciary, brokerage, or client relationship between you and BullMonk, its editors, journalists, analysts, or contributors.
            </p>

            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <strong>No Regulatory Registration:</strong> Neither BullMonk Intelligence Group Ltd. nor its staff journalists are registered investment advisors (RIAs), registered commodity trading advisors (CTAs), broker-dealers, or securities analysts under the U.S. Investment Advisers Act of 1940, the UK Financial Services and Markets Act 2000, or equivalent national jurisdictions.
              </li>
              <li>
                <strong>No Suitability Assessment:</strong> The articles published do not evaluate the financial condition, risk appetite, tax status, or investment goals of any individual or institutional reader.
              </li>
              <li>
                <strong>Independent Counsel Required:</strong> Before executing trades, purchasing securities, acquiring sovereign debt, entering forex hedging positions, or deploying capital, readers must consult a licensed, fiduciary financial advisor or registered broker.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="volatility-risk" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>02</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                High-Risk Capital Volatility & Market Risk Factors
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Global financial markets are subject to severe systemic volatility, liquidity crunches, geopolitical shocks, and statutory revisions. BullMonk emphasizes the following fundamental risk parameters:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.25rem 0' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  📉 Total Capital Loss Potential
                </strong>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Trading equities, options, foreign exchange pairs (Forex), sovereign bonds, commodities futures, and digital assets carries an inherent risk of substantial financial loss, including the loss of initial principal invested.
                </span>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  ⏳ Historical Performance Fallacy
                </strong>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Past market performance, historical central bank rate cycles, treasury yield spreads, and sovereign debt patterns referenced in our articles are historical records and provide zero assurance of future returns or price stability.
                </span>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  🌐 Geopolitical & Currency Exposure
                </strong>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Cross-border trade routes, semiconductor export bans, sovereign sanctions, and bilateral clearing mechanisms fluctuate unpredictably and may cause rapid devaluation of foreign currency reserves and corporate valuations.
                </span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="advertising-separation" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>03</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Advertising Independence & Non-Endorsement
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              BullMonk displays commercial banner advertisements supplied automatically through <strong>Google AdSense</strong>. Readers must understand:
            </p>

            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Zero Editorial Endorsement:</strong> The appearance of an advertisement for a broker, trading terminal, investment fund, cryptocurrency exchange, or financial product does NOT constitute an endorsement, recommendation, or warranty by BullMonk.</li>
              <li><strong>Algorithmic Serving:</strong> Advertisements are served dynamically by third-party ad networks based on contextual and geographic algorithms without human editorial pre-screening.</li>
              <li><strong>Commercial Wall:</strong> BullMonk maintains an impenetrable firewall between commercial advertising accounts and its investigative newsrooms.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="data-accuracy">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>04</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Data Accuracy, Feed Delays & Model Estimations
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Market tickers, commodity indices, sovereign bond yields, and central bank probability tables displayed on BullMonk are gathered from public international clearinghouses, central bank statements, and delayed market feeds. While our journalists make every effort to verify quantitative data with primary documentation, BullMonk gives no warranty regarding the instantaneous precision, completeness, or timeliness of market data streams. BullMonk shall not be liable for any trading decisions executed in reliance on real-time data delays.
            </p>
          </section>

        </article>

        {/* Right Column: Companion Navigation & Quick Links */}
        <aside style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Table of contents */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
              Document Navigation
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
              <a href="#no-fiduciary" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>01. No Fiduciary Duty</a>
              <a href="#volatility-risk" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>02. Capital Volatility Risk</a>
              <a href="#advertising-separation" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>03. Commercial Firewall</a>
              <a href="#data-accuracy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>04. Data Feeds & Delays</a>
            </nav>
          </div>

          {/* Sibling Legal Documents */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
              Related Policies
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem' }}>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setCurrentPage('privacy')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Privacy & AdSense Policy</span>
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
                onClick={() => setCurrentPage('editorial')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Editorial Ethics Code</span>
                <ArrowRight size={13} />
              </button>

              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setCurrentPage('corrections')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Corrections & Errata</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Compliance Card */}
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center' }}>
            <ShieldCheck size={24} color="var(--accent-gold)" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.25rem' }}>YMYL Compliance Guard</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Strict adherence to Google Search Quality Rater Guidelines for Financial Media.
            </div>
          </div>

        </aside>

      </div>
    </main>
  );
};
