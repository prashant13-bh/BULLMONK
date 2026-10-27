import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { 
  X, Copy, Check, Share2, Mail, ExternalLink, 
  QrCode, BookOpen, Smartphone, Send
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
  showToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  article,
  showToast
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [citationFormat, setCitationFormat] = useState<'ap' | 'bibtex'>('ap');
  const [showQr, setShowQr] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/#article-${article.id}`
    : `https://bullmonk.live/#article-${article.id}`;

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
      setShowQr(false);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    showToast('Dispatch URL copied to clipboard');
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const getCitationText = () => {
    const pubYear = new Date(article.publishedAt).getFullYear() || 2026;
    if (citationFormat === 'bibtex') {
      return `@article{bullmonk_${article.id.replace(/[^a-zA-Z0-9]/g, '_')},\n  title={${article.title}},\n  author={${article.author.name}},\n  journal={BULLMONK Global Financial Intelligence},\n  year={${pubYear}},\n  url={${shareUrl}}\n}`;
    }
    return `${article.author.name} (${pubYear}). "${article.title}." BULLMONK International Intelligence & Macro Research. Retrieved from ${shareUrl}`;
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(getCitationText());
    setCopiedCitation(true);
    showToast(`Institutional ${citationFormat.toUpperCase()} citation copied`);
    setTimeout(() => setCopiedCitation(false), 2200);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.deck,
          url: shareUrl
        });
        showToast('Dispatch shared successfully');
        onClose();
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  const socialChannels = [
    {
      name: '𝕏 (Twitter)',
      icon: '𝕏',
      color: '#000000',
      textColor: '#FFFFFF',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${article.title}" — Deep investigative dispatch via @BullMonkNews`)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      color: '#0A66C2',
      textColor: '#FFFFFF',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: 'WA',
      color: '#25D366',
      textColor: '#FFFFFF',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`*${article.title}*\n${article.deck}\n\nRead dispatch: ${shareUrl}`)}`
    },
    {
      name: 'Telegram',
      icon: 'TG',
      color: '#229ED9',
      textColor: '#FFFFFF',
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`
    },
    {
      name: 'Reddit',
      icon: 'r/',
      color: '#FF4500',
      textColor: '#FFFFFF',
      href: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(article.title)}`
    },
    {
      name: 'Email Wire',
      icon: '@',
      color: 'var(--accent-gold)',
      textColor: '#FFFFFF',
      href: `mailto:?subject=${encodeURIComponent(`BullMonk Intelligence: ${article.title}`)}&body=${encodeURIComponent(`${article.title}\n\n${article.deck}\n\nRead the full investigation on BullMonk:\n${shareUrl}`)}`
    }
  ];

  // SVG QR Code for instant phone handoff
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}&format=svg`;

  return (
    <div 
      className="share-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
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
        className="share-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          width: '100%',
          maxWidth: '560px',
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
              <Share2 size={13} /> Institutional Syndication
            </div>
            <h3 id="share-modal-title" style={{ fontFamily: 'var(--font-brand)', fontSize: '1.35rem', margin: 0, color: 'var(--text-primary)' }}>
              Share Intelligence Dispatch
            </h3>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Distribute verified reporting across global desks, terminals, and social networks.
            </p>
          </div>

          <button 
            type="button"
            onClick={onClose}
            aria-label="Close Share Dialog"
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

        {/* Article Preview Card */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          gap: '0.85rem',
          alignItems: 'center'
        }}>
          <img 
            src={article.heroImage} 
            alt={article.title} 
            style={{ width: '64px', height: '64px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} 
          />
          <div style={{ overflow: 'hidden' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
              {article.category} • {article.region}
            </span>
            <div style={{ 
              fontWeight: 700, 
              fontSize: '0.9rem', 
              color: 'var(--text-primary)', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              marginTop: '2px'
            }}>
              {article.title}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              By {article.author.name} • {article.readTime}
            </div>
          </div>
        </div>

        {/* Copy Link Row */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Canonical Dispatch Link
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem 0.5rem 0.4rem 0.85rem'
          }}>
            <input 
              type="text" 
              readOnly 
              value={shareUrl}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                flex: 1,
                fontSize: '0.84rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)'
              }}
              onFocus={(e) => e.target.select()}
            />
            <button 
              type="button"
              className="btn btn-primary"
              onClick={handleCopyLink}
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem', gap: '4px' }}
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Social Sharing Grid */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Direct Syndication Desks
            </span>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleNativeShare}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-gold)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <Smartphone size={13} /> Device Share
              </button>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.65rem'
          }}>
            {socialChannels.map((ch) => (
              <a
                key={ch.name}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0.6rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-surface-elevated)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-gold)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.transform = '';
                }}
              >
                <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--accent-gold)' }}>{ch.icon}</span>
                <span>{ch.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Academic / Financial Citation Section */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              <BookOpen size={13} /> Academic &amp; Newsroom Citation
            </span>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setCitationFormat('ap')}
                style={{
                  background: citationFormat === 'ap' ? 'var(--accent-gold)' : 'transparent',
                  color: citationFormat === 'ap' ? '#FFFFFF' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '2px 7px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                AP Press
              </button>
              <button
                type="button"
                onClick={() => setCitationFormat('bibtex')}
                style={{
                  background: citationFormat === 'bibtex' ? 'var(--accent-gold)' : 'transparent',
                  color: citationFormat === 'bibtex' ? '#FFFFFF' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '2px 7px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                BibTeX
              </button>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: '4px',
            padding: '0.65rem 0.75rem',
            fontFamily: citationFormat === 'bibtex' ? 'var(--font-mono)' : 'inherit',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.5',
            whiteSpace: citationFormat === 'bibtex' ? 'pre-wrap' : 'normal',
            maxHeight: '85px',
            overflowY: 'auto'
          }}>
            {getCitationText()}
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCopyCitation}
            style={{ width: '100%', marginTop: '0.65rem', padding: '0.45rem', fontSize: '0.76rem', gap: '4px' }}
          >
            {copiedCitation ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedCitation ? 'Citation Copied' : 'Copy Citation for Research'}</span>
          </button>
        </div>

        {/* Mobile QR Transfer Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: 0
            }}
          >
            <QrCode size={13} />
            <span>{showQr ? 'Hide Mobile QR Transfer' : 'Instant Smartphone Transfer (Scan QR Code)'}</span>
          </button>

          {showQr && (
            <div style={{
              marginTop: '0.75rem',
              textAlign: 'center',
              padding: '1rem',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)'
            }}>
              <img 
                src={qrSvgUrl} 
                alt="Article QR Code" 
                width={160} 
                height={160}
                style={{ 
                  borderRadius: '8px', 
                  background: '#FFFFFF', 
                  padding: '8px',
                  boxShadow: 'var(--shadow-sm)'
                }} 
              />
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Point camera to open and continue reading on smartphone.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
