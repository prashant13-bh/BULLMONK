import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { 
  Printer, X, CheckSquare, Square, FileText, 
  Download, ShieldCheck, Check, Clock, AlertCircle
} from 'lucide-react';

export interface PrintOptions {
  includeTakeaways: boolean;
  includeHeroImage: boolean;
  includeComments: boolean;
  includeDisclaimer: boolean;
  includeCitationFooter: boolean;
  inkSavingMode: boolean;
}

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
  commentsCount?: number;
  onConfirmPrint: (options: PrintOptions) => void;
  showToast: (msg: string) => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  article,
  commentsCount = 0,
  onConfirmPrint,
  showToast
}) => {
  const [options, setOptions] = useState<PrintOptions>({
    includeTakeaways: true,
    includeHeroImage: true,
    includeComments: false,
    includeDisclaimer: true,
    includeCitationFooter: true,
    inkSavingMode: false
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleOption = (key: keyof PrintOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrint = () => {
    onConfirmPrint(options);
    onClose();
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleDownloadTextDossier = () => {
    const dateStr = new Date(article.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const takeawaysText = article.keyTakeaways && article.keyTakeaways.length > 0
      ? `\nEXECUTIVE KEY TAKEAWAYS:\n` + article.keyTakeaways.map((t, idx) => `[${idx + 1}] ${t}`).join('\n')
      : '';

    // Strip HTML tags for clean plain text export
    const cleanContent = article.content.replace(/<[^>]+>/g, '\n').replace(/\n\s*\n/g, '\n\n').trim();

    const dossier = `================================================================================
BULLMONK GLOBAL FINANCIAL INTELLIGENCE & GEOPOLITICAL RESEARCH
DISPATCH REF: BM-INTEL-${article.id.toUpperCase()}
================================================================================

TITLE: ${article.title.toUpperCase()}
DECK: ${article.deck}

BUREAU / DESK: ${article.region} • ${article.category}
AUTHOR: ${article.author.name} (${article.author.title}, ${article.author.location})
PUBLISHED: ${dateStr}
ESTIMATED READING DURATION: ${article.readTime}
CANONICAL ARCHIVE: https://bullmonk.live/#article-${article.id}
${takeawaysText}

--------------------------------------------------------------------------------
DISPATCH BODY PROSE
--------------------------------------------------------------------------------
${cleanContent}

--------------------------------------------------------------------------------
INSTITUTIONAL COMPLIANCE & LEGAL NOTICE
--------------------------------------------------------------------------------
The macroeconomic analyses, asset valuations, and sovereign policy commentaries published
by BULLMONK are provided strictly for informational, educational, and journalistic purposes.
Nothing contained herein constitutes investment, legal, accounting, or tax advice.

© 2026 BULLMONK International Intelligence. All Rights Reserved.
`;

    const blob = new Blob([dossier], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BullMonk_${article.id}_Dispatch.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Plain-text intelligence brief downloaded');
  };

  return (
    <div 
      className="print-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="print-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
              <Printer size={13} /> Institutional Print &amp; PDF Export
            </div>
            <h3 id="print-modal-title" style={{ fontFamily: 'var(--font-brand)', fontSize: '1.35rem', margin: 0, color: 'var(--text-primary)' }}>
              Print Intelligence Dispatch
            </h3>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Configure your archival print layout or generate a high-contrast ink-saving PDF.
            </p>
          </div>

          <button 
            type="button"
            onClick={onClose}
            aria-label="Close Print Dialog"
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Dispatch Metrics Overview */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Desk Authority</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{article.region}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Reading Time</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '2px' }}>{article.readTime}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Est. PDF Pages</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>2 - 3 Pages</div>
          </div>
        </div>

        {/* Print Configuration Options */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            Sections to Include in Print / PDF
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {/* Takeaways */}
            <div 
              onClick={() => toggleOption('includeTakeaways')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {options.includeTakeaways ? <CheckSquare size={16} color="var(--accent-gold)" /> : <Square size={16} color="var(--text-muted)" />}
              <div style={{ flex: 1, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                Executive Key Takeaways &amp; Data Box
              </div>
            </div>

            {/* Hero Image */}
            <div 
              onClick={() => toggleOption('includeHeroImage')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {options.includeHeroImage ? <CheckSquare size={16} color="var(--accent-gold)" /> : <Square size={16} color="var(--text-muted)" />}
              <div style={{ flex: 1, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                Featured Photo &amp; Caption
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '6px' }}>(Uncheck to conserve printer ink)</span>
              </div>
            </div>

            {/* Comments */}
            <div 
              onClick={() => toggleOption('includeComments')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {options.includeComments ? <CheckSquare size={16} color="var(--accent-gold)" /> : <Square size={16} color="var(--text-muted)" />}
              <div style={{ flex: 1, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                Analyst Commentary &amp; Reader Room Notes ({commentsCount})
              </div>
            </div>

            {/* Disclaimer */}
            <div 
              onClick={() => toggleOption('includeDisclaimer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {options.includeDisclaimer ? <CheckSquare size={16} color="var(--accent-gold)" /> : <Square size={16} color="var(--text-muted)" />}
              <div style={{ flex: 1, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                Institutional YMYL Risk &amp; Financial Disclaimer
              </div>
            </div>

            {/* Ink Saving Mode */}
            <div 
              onClick={() => toggleOption('inkSavingMode')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {options.inkSavingMode ? <CheckSquare size={16} color="var(--accent-gold)" /> : <Square size={16} color="var(--text-muted)" />}
              <div style={{ flex: 1, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                Ink-Saving Eco Mode
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '6px' }}>(Pure black &amp; white, zero background fills)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePrint}
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.92rem', gap: '6px' }}
          >
            <Printer size={16} />
            <span>Confirm &amp; Print / Save as PDF</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDownloadTextDossier}
            style={{ width: '100%', padding: '0.6rem', fontSize: '0.82rem', gap: '6px' }}
          >
            <Download size={14} />
            <span>Download Plain-Text Dossier (.txt)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
