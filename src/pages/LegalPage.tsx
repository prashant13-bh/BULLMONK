import React, { useState } from 'react';
import { PageView } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LegalNav } from '../components/LegalNav';
import { 
  Shield, Lock, FileText, DollarSign, BookOpen, Cookie, 
  AlertCircle, ArrowRight, Search, CheckCircle, ExternalLink 
} from 'lucide-react';

interface LegalPageProps {
  setCurrentPage: (page: PageView) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const documents: {
    page: PageView;
    title: string;
    badge: string;
    description: string;
    keyPoints: string[];
    icon: React.ReactNode;
    docRef: string;
  }[] = [
    {
      page: 'privacy',
      title: 'Privacy Policy & Advertising Disclosures',
      badge: 'Google AdSense & GDPR Certified',
      description: 'Comprehensive disclosures regarding Google AdSense (ca-pub-7155174810446636), DoubleClick DART cookies, GDPR, CCPA opt-out tools, and zero-knowledge whistleblower telemetry.',
      keyPoints: ['Google AdSense compliance', 'DoubleClick DART opt-outs', 'GDPR & CCPA reader rights', 'Zero-metadata whistleblower tip line'],
      icon: <Lock size={22} color="var(--accent-gold)" />,
      docRef: 'BM-SEC-PRIV-2026.04'
    },
    {
      page: 'disclaimer',
      title: 'Financial & YMYL Investment Disclaimer',
      badge: 'YMYL Regulatory Compliance',
      description: 'Mandatory statutory disclosure clarifying that BullMonk is pure macroeconomic journalism, not a registered investment advisor. High-risk volatility warnings for Forex, bonds, and equities.',
      keyPoints: ['Zero investment advisory capacity', 'SEC / FINRA / FCA / SEBI notices', 'Capital loss & volatility disclaimers', 'No commercial ad endorsement'],
      icon: <DollarSign size={22} color="var(--accent-gold)" />,
      docRef: 'BM-YMYL-DISC-2026.02'
    },
    {
      page: 'terms',
      title: 'Terms of Service & Syndication Charter',
      badge: 'Binding Institutional Contract',
      description: 'Governs all access to digital editions, fair use quotation allowances (150 words with canonical link), and explicit prohibitions against unauthorized AI scraping and model training ingest.',
      keyPoints: ['150-word fair use quotation rule', 'Strict AI scraper prohibitions', 'Institutional syndication licensing', 'LCIA arbitration jurisdiction'],
      icon: <FileText size={22} color="var(--accent-gold)" />,
      docRef: 'BM-TOS-2026.4'
    },
    {
      page: 'editorial',
      title: 'Editorial Standards & Newsroom Ethics Code',
      badge: 'Two-Source Verified Journalism',
      description: 'Our newsroom code of honor: absolute editorial independence from commercial advertisers, two-source corroboration mandate, and 72-hour securities trading moratorium for journalists.',
      keyPoints: ['Commercial firewall from advertisers', 'Two-source verification rule', '72-hour trading moratorium', '100% human investigative reporting'],
      icon: <BookOpen size={22} color="var(--accent-gold)" />,
      docRef: 'BM-ED-ETHICS-2026'
    },
    {
      page: 'cookies',
      title: 'Cookie Telemetry & Client-Side Storage',
      badge: 'Interactive Consent Manager',
      description: 'Full technical inventory of platform cookies and LocalStorage items with interactive toggles for Google AdSense personalization and Google Analytics telemetry.',
      keyPoints: ['Interactive consent controls', 'Audit table of active cookies', 'Browser erasure instructions', 'Industry-wide DAA/EDAA opt-outs'],
      icon: <Cookie size={22} color="var(--accent-gold)" />,
      docRef: 'BM-COOKIE-2026.02'
    },
    {
      page: 'corrections',
      title: 'Corrections, Errata & Public Accountability',
      badge: 'Public Accountability Ledger',
      description: 'Our commitment to public transparency: classifications for substantive corrections, clarifications, and retractions, accompanied by an open ledger of recent dispatch revisions.',
      keyPoints: ['Classification of errata', 'Recent public corrections log', '24-hour response SLA', 'Direct corrections email desk'],
      icon: <AlertCircle size={22} color="var(--accent-gold)" />,
      docRef: 'BM-ERRATA-2026'
    }
  ];

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.keyPoints.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="container" style={{ margin: '2rem auto 5rem', maxWidth: '1080px' }}>
      {/* 1. Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Legal & Governance Suite', active: true }
        ]}
        setCurrentPage={setCurrentPage}
      />

      {/* 2. Legal Sub-Nav */}
      <LegalNav currentPage="legal" setCurrentPage={setCurrentPage} />

      {/* 3. Header */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontFamily: 'var(--font-brand)', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--accent-gold)', display: 'block', marginBottom: '0.5rem' }}>
          Transparency, Privacy & Regulatory Compliance
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.1rem, 4vw, 3rem)', fontWeight: 800, margin: '0 0 1rem' }}>
          Legal & Governance Suite
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.7 }}>
          Select any dedicated charter below to view full institutional terms, regulatory disclosures, and compliance policies. Each document is maintained independently with dedicated breadcrumbs and canonical references.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: '480px', margin: '2rem auto 0', position: 'relative' }}>
          <label htmlFor="legal-search-input" className="sr-only">Search legal policies and compliance charters</label>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            id="legal-search-input"
            type="search" 
            placeholder="Search clauses, AdSense, GDPR, YMYL..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </header>

      {/* 4. Grid of Legal Documents */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {filteredDocs.map((doc) => (
          <article 
            key={doc.page}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                {doc.icon}
              </div>
              <span className="region-pill" style={{ fontSize: '0.7rem' }}>
                {doc.badge}
              </span>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              {doc.docRef}
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--text-primary)' }}>
              {doc.title}
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.25rem', flexGrow: 1 }}>
              {doc.description}
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {doc.keyPoints.map((point, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={13} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setCurrentPage(doc.page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ width: '100%', justifyContent: 'center', gap: '0.45rem', fontSize: '0.86rem', padding: '0.65rem 1rem' }}
              aria-label={`Open dedicated ${doc.title}`}
            >
              <span>Read Full Document</span>
              <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </div>

      {/* 5. Institutional Bottom Information */}
      <section style={{ marginTop: '4rem', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: '0 0 0.35rem' }}>
            Need Custom Corporate Syndication or Compliance Verification?
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Our Legal Directorate handles compliance verification, institutional licensing, and ombudsman inquiries directly.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setCurrentPage('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{ fontSize: '0.85rem' }}
        >
          Contact Legal Directorate
        </button>
      </section>
    </main>
  );
};
