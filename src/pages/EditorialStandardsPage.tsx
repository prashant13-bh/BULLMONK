import React from 'react';
import { PageView } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LegalNav } from '../components/LegalNav';
import { BookOpen, Shield, CheckCircle2, AlertCircle, ArrowRight, Award } from 'lucide-react';

interface EditorialStandardsPageProps {
  setCurrentPage: (page: PageView) => void;
}

export const EditorialStandardsPage: React.FC<EditorialStandardsPageProps> = ({ setCurrentPage }) => {
  return (
    <main className="container" style={{ margin: '2rem auto 5rem', maxWidth: '1040px' }}>
      {/* 1. Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Legal & Governance Suite', page: 'legal' },
          { label: 'Editorial Standards & Newsroom Ethics Code', active: true }
        ]}
        setCurrentPage={setCurrentPage}
      />

      {/* 2. Legal Sub-Nav */}
      <LegalNav currentPage="editorial" setCurrentPage={setCurrentPage} />

      {/* 3. Header */}
      <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span className="region-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Award size={12} /> Newsroom Code of Honor
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Document Ref: BM-ED-ETHICS-2026 • Verified Newsroom Standard
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, margin: '0.5rem 0 1rem', lineHeight: 1.2 }}>
          Editorial Standards, Ethics & Sourcing Charter
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: '1.7', maxWidth: '820px' }}>
          The institutional foundation of <strong>BULLMONK</strong> is unwavering journalistic independence, on-the-ground verification, and analytical rigor. This charter governs all correspondents, bureau chiefs, and contributing analysts across our worldwide operations.
        </p>
      </header>

      {/* 4. Main Body */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '3rem', alignItems: 'start' }} className="legal-layout-grid">
        
        {/* Left Column: Full Articles */}
        <article style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'clamp(1.5rem, 3.5vw, 2.75rem)', lineHeight: '1.8' }}>
          
          {/* Editorial Standards Council Photography Banner */}
          <div style={{ 
            borderRadius: 'var(--radius-md)', 
            overflow: 'hidden', 
            border: '1px solid var(--border-subtle)', 
            marginBottom: '2.5rem',
            background: 'var(--bg-surface-elevated)'
          }}>
            <img 
              src="/images/bullmonk_editorial_board.webp" 
              alt="BULLMONK Editorial Standards Council and Senior Investigative Editors in Session"
              style={{ width: '100%', height: 'auto', maxHeight: '360px', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-gold)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                EDITORIAL ETHICS COUNCIL • LONDON & FRANKFURT CHAMBERS
              </span>
              The BULLMONK Editorial Standards Council convened in executive review: senior editors, legal counsel, and forensic accountants verifying investigative dossiers and primary statutory filings under the Two-Source Protocol.
            </div>
          </div>

          {/* Principle 1 */}
          <section id="independence" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>01</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Absolute Editorial Independence & The Commercial Firewall
              </h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              BullMonk maintains a permanent, impermeable "Chinese Wall" separating editorial newsrooms from commercial revenue operations.
            </p>

            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><strong>Zero Pre-Publication Review:</strong> No advertiser, commercial sponsor, corporate board, or governmental ministry is ever permitted advance sight of an article, interview, or macroeconomic investigation.</li>
              <li><strong>Inviolable Coverage:</strong> Editorial desks cover corporate malfeasance, sovereign default risks, and regulatory enforcement actions without regard to commercial advertising partnerships.</li>
              <li><strong>No Sponsored Dispatches in Editorial Wire:</strong> Any commercially sponsored intelligence or brand partnership is sequestered into explicitly marked commercial modules with distinctive labeling and cannot appear as neutral journalistic reporting.</li>
            </ul>
          </section>

          {/* Principle 2 */}
          <section id="verification" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>02</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                The Two-Source Verification Protocol
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Rumor, market speculation, and single-source leaks do not meet the publication threshold of BullMonk. Before any investigative dispatch is approved for the global wire:
            </p>

            <div style={{ background: 'var(--bg-surface-elevated)', borderLeft: '4px solid var(--accent-gold)', padding: '1.25rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', margin: '1.25rem 0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
                Mandatory Verification Rule
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
                Every factual assertion of corporate misconduct, non-public sovereign negotiations, or unannounced monetary decisions must be corroborated by at least two independent, verified primary sources, or validated against cryptographic, audit, or statutory filing records.
              </p>
            </div>
          </section>

          {/* Principle 3 */}
          <section id="trading-restrictions" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>03</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Financial Conflicts & 72-Hour Trading Moratorium
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              To prevent insider trading, front-running, and financial bias:
            </p>

            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><strong>72-Hour Blackout:</strong> All reporters, copy editors, and bureau analysts are strictly prohibited from trading any stock, sovereign debt instrument, currency pair, commodity future, or derivative relating to an asset they have reported on for seventy-two (72) hours before and after publication.</li>
              <li><strong>Annual Portfolio Disclosure:</strong> Staff journalists submit confidential annual asset disclosure statements to the BullMonk Compliance Directorate.</li>
              <li><strong>No Commercial Gifts:</strong> Newsroom staff are barred from accepting corporate gifts, funded travel, honoraria, or equity grants from entities they cover.</li>
            </ul>
          </section>

          {/* Principle 4 */}
          <section id="human-writing" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>04</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Human Authorship & Anti-Hallucination Mandate
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              BullMonk dispatches are authored by seasoned human financial correspondents operating directly from international bureaus. 
            </p>

            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><strong>Boots-on-the-Ground Narrative:</strong> Articles must reflect eyewitness reporting, physical cleanroom visits, trading floor dialogue, and primary quantitative calculation.</li>
              <li><strong>Zero Generative AI Text Replacement:</strong> Automated AI text generators are strictly forbidden from writing or synthesizing BullMonk editorial prose. Computational software is limited to data formatting, mathematical charts, and audio text-to-speech rendering.</li>
              <li><strong>Named Bureau Attribution:</strong> Every dispatch bears the verified byline, bureau location, and contact coordinates of the authoring journalist.</li>
            </ul>
          </section>

          {/* Principle 5 */}
          <section id="ombudsman">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>05</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Public Accountability & Office of the Ombudsman
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              The independent BullMonk Newsroom Ombudsman evaluates public complaints concerning factual inaccuracy, bias, or ethical breaches. Inquiries receive an official written review within seventy-two (72) hours.
            </p>

            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', fontSize: '0.9rem' }}>
              <div><strong>Independent Ombudsman:</strong> Dr. Alistair Sterling (Senior Standards Editor)</div>
              <div><strong>Direct Contact:</strong> <code style={{ color: 'var(--accent-gold)' }}>ombudsman@bullmonk.intelligence</code></div>
              <div><strong>Corrections Bureau:</strong> <code style={{ color: 'var(--accent-gold)' }}>corrections@bullmonk.intelligence</code></div>
            </div>
          </section>

        </article>

        {/* Right Column: Companion Navigation */}
        <aside style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Table of contents */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
              Charter Sections
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
              <a href="#independence" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>01. Editorial Independence</a>
              <a href="#verification" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>02. Two-Source Verification</a>
              <a href="#trading-restrictions" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>03. Trading Moratorium</a>
              <a href="#human-writing" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>04. Human Authorship</a>
              <a href="#ombudsman" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>05. Newsroom Ombudsman</a>
            </nav>
          </div>

          {/* Sibling Legal Documents */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
              Governance Charters
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem' }}>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setCurrentPage('corrections')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Corrections & Errata Protocol</span>
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
