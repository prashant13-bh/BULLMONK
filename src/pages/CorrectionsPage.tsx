import React from 'react';
import { PageView } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LegalNav } from '../components/LegalNav';
import { AlertCircle, CheckCircle2, Mail, Clock, ArrowRight, Shield } from 'lucide-react';

interface CorrectionsPageProps {
  setCurrentPage: (page: PageView) => void;
}

export const CorrectionsPage: React.FC<CorrectionsPageProps> = ({ setCurrentPage }) => {
  return (
    <main className="container" style={{ margin: '2rem auto 5rem', maxWidth: '1040px' }}>
      {/* 1. Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Legal & Governance Suite', page: 'legal' },
          { label: 'Corrections & Transparency Protocol', active: true }
        ]}
        setCurrentPage={setCurrentPage}
      />

      {/* 2. Legal Sub-Nav */}
      <LegalNav currentPage="corrections" setCurrentPage={setCurrentPage} />

      {/* 3. Header */}
      <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span className="region-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <AlertCircle size={12} /> Transparency & Accountability
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Protocol Ref: BM-ERRATA-2026 • Public Audit Standard
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, margin: '0.5rem 0 1rem', lineHeight: 1.2 }}>
          Corrections, Errata & Public Accountability Protocol
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: '1.7', maxWidth: '820px' }}>
          Journalistic credibility is anchored in intellectual honesty. <strong>BULLMONK</strong> maintains a strict policy of prompt, transparent, and public correction whenever factual, statistical, or contextual errors occur across our dispatches.
        </p>
      </header>

      {/* 4. Main Body */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '3rem', alignItems: 'start' }} className="legal-layout-grid">
        
        {/* Left Column: Full Articles */}
        <article style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'clamp(1.5rem, 3.5vw, 2.75rem)', lineHeight: '1.8' }}>
          
          {/* Section 1 */}
          <section id="policy-overview" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>01</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Correction Standards & Hierarchy
              </h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              When an inaccuracy is reported or discovered by our copy desk, BullMonk categorizes and handles the revision according to the following protocol:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', borderLeft: '4px solid var(--accent-gold)', padding: '1rem 1.25rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  A. Substantive Corrections (Factual or Numeric Errors)
                </strong>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Errors of fact, misrepresented quotations, misstated basis points, or incorrect sovereign statistics are corrected immediately in the text, and a prominent footnote is appended to the dispatch detailing: (1) The exact previous text; (2) The accurate corrected figure; and (3) The UTC timestamp of revision.
                </span>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', borderLeft: '4px solid var(--accent-blue)', padding: '1rem 1.25rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  B. Clarifications (Contextual Nuance)
                </strong>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  When phrasing is factually accurate but potentially misleading or incomplete, the wording is refined with a note stating that the dispatch has been clarified to provide additional institutional context.
                </span>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', borderLeft: '4px solid var(--accent-red)', padding: '1rem 1.25rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  C. Formal Retractions
                </strong>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  In the rare event that the fundamental investigative premise of an article is disproven, the piece is formally retracted. The original text is struck through or archived with a signed explanatory statement from the Editor-in-Chief detailing the editorial failure.
                </span>
              </div>
            </div>
          </section>

          {/* Section 2: Public Corrections Log */}
          <section id="public-log" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>02</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Public Corrections Ledger (Recent Dispatches)
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              In accordance with international ombudsman transparency guidelines, BullMonk maintains a public record of recent editorial corrections:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Log Entry 1 */}
              <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                    US Treasury 10-Year Auction Allocation
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    October 18, 2026 • 21:14 UTC
                  </span>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong>Dispatch:</strong> "The 90-Second Sovereign Bidding War: Inside Wall Street's Treasury Rebalancing Wave" (Marcus Vance).<br />
                  <strong>Correction:</strong> An earlier edition stated that indirect bidders were allocated 68.4% of the $38 billion tranche. The official Department of the Treasury allotment release confirmed the final figure at 69.2%. The body text and terminal table have been updated accordingly.
                </div>
              </div>

              {/* Log Entry 2 */}
              <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                    Dholera Cleanroom Power Substation Capacity
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    October 17, 2026 • 14:02 UTC
                  </span>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong>Dispatch:</strong> "Inside Dholera's Silicon Cleanrooms: How India Broke Into the Global Semiconductor Corridor" (Siddharth Rao).<br />
                  <strong>Clarification:</strong> Clarified that the 400kV dedicated electrical substation is scheduled for dual-redundant commissioning in Q1 2027, rather than operating at full secondary grid load currently.
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="submit-error">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>03</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Submitting an Errata or Factual Inquiry
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Readers, institutional analysts, and named subjects who detect factual discrepancies in any BullMonk story are urged to file a formal error review. Submissions must include:
            </p>

            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>The article headline, author byline, and published URL.</li>
              <li>The exact sentence or statistic disputed.</li>
              <li>Supporting primary documentary evidence (e.g. regulatory filing, audited balance sheet, or government press record).</li>
            </ul>

            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', fontSize: '0.9rem' }}>
              <div><strong>Direct Errata Desk:</strong> <code style={{ color: 'var(--accent-gold)' }}>corrections@bullmonk.intelligence</code></div>
              <div><strong>Service SLA:</strong> Acknowledgment within twenty-four (24) hours; senior editorial review completed within forty-eight (48) hours.</div>
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
              <a href="#policy-overview" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>01. Correction Hierarchy</a>
              <a href="#public-log" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>02. Public Corrections Ledger</a>
              <a href="#submit-error" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>03. Submit Errata Request</a>
            </nav>
          </div>

          {/* Sibling Legal Documents */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
              Editorial Policies
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem' }}>
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
                onClick={() => setCurrentPage('disclaimer')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Financial & YMYL Disclaimer</span>
                <ArrowRight size={13} />
              </button>

              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setCurrentPage('privacy')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Privacy & AdSense Policy</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </aside>

      </div>
    </main>
  );
};
