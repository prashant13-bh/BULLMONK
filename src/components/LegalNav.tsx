import React from 'react';
import { PageView } from '../types';
import { 
  Shield, Lock, FileText, DollarSign, BookOpen, Cookie, 
  AlertCircle, Share2, Printer, Check 
} from 'lucide-react';

interface LegalNavProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  documentTitle?: string;
}

export const LegalNav: React.FC<LegalNavProps> = ({ currentPage, setCurrentPage, documentTitle }) => {
  const [copied, setCopied] = React.useState(false);

  const legalLinks: { page: PageView; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { page: 'legal', label: 'Compliance Hub', shortLabel: 'Hub', icon: <Shield size={14} /> },
    { page: 'privacy', label: 'Privacy Policy', shortLabel: 'Privacy', icon: <Lock size={14} /> },
    { page: 'disclaimer', label: 'Financial & YMYL', shortLabel: 'Disclaimer', icon: <DollarSign size={14} /> },
    { page: 'terms', label: 'Terms of Service', shortLabel: 'Terms', icon: <FileText size={14} /> },
    { page: 'editorial', label: 'Editorial Ethics', shortLabel: 'Editorial', icon: <BookOpen size={14} /> },
    { page: 'cookies', label: 'Cookie Telemetry', shortLabel: 'Cookies', icon: <Cookie size={14} /> },
    { page: 'corrections', label: 'Corrections Policy', shortLabel: 'Corrections', icon: <AlertCircle size={14} /> },
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <aside 
      aria-label="Legal Suite Navigation" 
      className="legal-nav-strip"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.65rem 1rem',
        marginBottom: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.4rem', 
          overflowX: 'auto', 
          maxWidth: '100%',
          paddingBottom: '2px'
        }}
      >
        <span 
          style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.72rem', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            color: 'var(--accent-gold)', 
            marginRight: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          Legal Suite:
        </span>

        {legalLinks.map((link) => {
          const isActive = currentPage === link.page;
          return (
            <button
              key={link.page}
              type="button"
              onClick={() => {
                setCurrentPage(link.page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 500,
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: isActive ? '1px solid var(--accent-gold)' : '1px solid transparent',
                background: isActive ? 'var(--accent-gold-glow)' : 'transparent',
                color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit'
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
        <button
          type="button"
          onClick={handleShare}
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', gap: '0.35rem' }}
          title="Copy canonical link to this policy document"
          aria-label="Copy canonical link to document"
        >
          {copied ? <Check size={13} color="var(--accent-green)" /> : <Share2 size={13} />}
          <span>{copied ? 'Link Copied' : 'Share URL'}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', gap: '0.35rem' }}
          title="Print or export as PDF"
          aria-label="Print or export legal document"
        >
          <Printer size={13} />
          <span>Print / PDF</span>
        </button>
      </div>
    </aside>
  );
};
