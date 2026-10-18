import React from 'react';
import { PageView } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LegalNav } from '../components/LegalNav';
import { FileText, Shield, ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';

interface TermsOfServicePageProps {
  setCurrentPage: (page: PageView) => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ setCurrentPage }) => {
  return (
    <main className="container" style={{ margin: '2rem auto 5rem', maxWidth: '1040px' }}>
      {/* 1. Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Legal & Governance Suite', page: 'legal' },
          { label: 'Terms of Service & Syndication Charter', active: true }
        ]}
        setCurrentPage={setCurrentPage}
      />

      {/* 2. Legal Sub-Nav */}
      <LegalNav currentPage="terms" setCurrentPage={setCurrentPage} />

      {/* 3. Header */}
      <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span className="region-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <FileText size={12} /> Institutional Syndication Agreement
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Document Ref: BM-TOS-2026.4 • Revised October 2026
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, margin: '0.5rem 0 1rem', lineHeight: 1.2 }}>
          Terms of Service & Syndication Governance
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: '1.7', maxWidth: '820px' }}>
          These Terms of Service constitute a legally binding agreement between you and <strong>BULLMONK Intelligence Group Ltd.</strong> governing all access to and use of BullMonk's digital newsrooms, investigative articles, audio dispatches, market tickers, and intelligence archives.
        </p>
      </header>

      {/* 4. Main Body */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '3rem', alignItems: 'start' }} className="legal-layout-grid">
        
        {/* Left Column: Full Articles */}
        <article style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'clamp(1.5rem, 3.5vw, 2.75rem)', lineHeight: '1.8' }}>
          
          {/* Article 1 */}
          <section id="acceptance" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>01</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Acceptance of Terms & Universal Scope
              </h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              By accessing, browsing, reading, sharing, or syndicating content from BullMonk (including web clients, mobile endpoints, RSS feeds, and audio briefings), you signify your unconditional assent to these Terms. If you do not accept these Terms, you are prohibited from utilizing the platform.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              These Terms apply equally to individual readers, financial institutions, sovereign analysts, academic researchers, and automated crawlers.
            </p>
          </section>

          {/* Article 2 */}
          <section id="ip-rights" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>02</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Intellectual Property & Investigative Copyright
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              All investigative prose, quantitative macroeconomic modeling, original reporting, audio dispatches, editorial layout, software architecture, and the BullMonk brand trademarks are the exclusive proprietary intellectual property of BullMonk Intelligence Group Ltd. and its contributing bureau journalists, protected under international copyright treaties (including the Berne Convention and WIPO treaties).
            </p>

            <div style={{ background: 'var(--bg-surface-elevated)', borderLeft: '4px solid var(--accent-gold)', padding: '1.25rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', margin: '1.25rem 0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
                Fair Use Quotation Policy (150-Word Standard)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
                Non-commercial journalistic, academic, and commentary quotation of BullMonk articles is permitted under fair use doctrine, subject to the following strict conditions: (a) Quotations shall not exceed 150 consecutive words; (b) The author and bureau desk must be visibly credited; and (c) An active, followable canonical hyperlink must point directly to the original article URI on BullMonk.
              </p>
            </div>
          </section>

          {/* Article 3 */}
          <section id="ai-scraping" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>03</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Prohibition of Unauthorized AI Crawling & LLM Ingestion
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              BullMonk explicitly reserves its rights regarding text and data mining under <strong>Article 4(3) of EU Directive 2019/790</strong> on Copyright in the Digital Single Market:
            </p>

            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <strong>No LLM Training Ingest:</strong> The reproduction, scraping, harvesting, or automated parsing of BullMonk dispatches, articles, or author archives for training, fine-tuning, or augmenting generative AI models or large language models without a negotiated commercial syndication contract is strictly prohibited.
              </li>
              <li>
                <strong>Search Engine Indexing:</strong> Standard public search engine indexing crawlers (e.g., Googlebot, Bingbot) are authorized exclusively to provide direct navigational references and snippets to human users.
              </li>
            </ul>
          </section>

          {/* Article 4 */}
          <section id="user-conduct" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>04</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Whistleblower Conduct & Tip Line Submissions
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Users who provide leaks, documents, or intelligence through our Zero-Knowledge Whistleblower Tip Line agree:
            </p>

            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Submissions must not contain malicious malware, spyware, trojans, or destructive code.</li>
              <li>Sources represent that they possess lawful access to material or are acting in good faith under recognized whistleblower protections.</li>
              <li>BullMonk reserves absolute discretion regarding whether to investigate, publish, or discard inbound intelligence leads.</li>
            </ul>
          </section>

          {/* Article 5 */}
          <section id="disclaimer-liability" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>05</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Limitation of Liability & Warranty Disclaimer
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              The platform and all publications are provided strictly on an "AS IS" and "AS AVAILABLE" basis without representations or warranties of any kind. To the fullest extent permissible under applicable law:
            </p>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              In no event shall BullMonk Intelligence Group Ltd., its directors, reporters, or bureau affiliates be liable for any direct, indirect, incidental, punitive, or consequential damages resulting from (a) trading or capital losses incurred through reliance on market news; (b) downtime, data transmission interruptions, or telecommunications latency; or (c) third-party advertisements served via Google AdSense.
            </p>
          </section>

          {/* Article 6 */}
          <section id="jurisdiction">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>06</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Governing Law & Institutional Arbitration
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              These Terms shall be governed by and construed in accordance with the laws of England and Wales, without giving effect to conflicts of law principles. Any dispute arising under or in connection with these Terms shall be resolved by final and binding institutional arbitration under the London Court of International Arbitration (LCIA) Rules.
            </p>

            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem', fontSize: '0.88rem' }}>
              <strong>Institutional Syndication Desk:</strong> <code style={{ color: 'var(--accent-gold)' }}>syndication@bullmonk.intelligence</code>
            </div>
          </section>

        </article>

        {/* Right Column: Companion Navigation */}
        <aside style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Table of contents */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
              Document Navigation
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
              <a href="#acceptance" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>01. Acceptance of Terms</a>
              <a href="#ip-rights" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>02. Intellectual Property</a>
              <a href="#ai-scraping" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>03. AI Scraper Prohibition</a>
              <a href="#user-conduct" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>04. Whistleblower Conduct</a>
              <a href="#disclaimer-liability" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>05. Limitation of Liability</a>
              <a href="#jurisdiction" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>06. Governing Jurisdiction</a>
            </nav>
          </div>

          {/* Sibling Legal Documents */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
              Companion Documents
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem' }}>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setCurrentPage('privacy')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Privacy Policy</span>
                <ArrowRight size={13} />
              </button>

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
                onClick={() => setCurrentPage('editorial')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Editorial Ethics Code</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </aside>

      </div>
    </main>
  );
};
