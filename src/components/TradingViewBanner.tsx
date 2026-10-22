import React from 'react';
import { ExternalLink, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';

interface TradingViewBannerProps {
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

export const TRADINGVIEW_AFFILIATE_URL = 'https://www.tradingview.com/pricing/?share_your_love=PRASHANT132000';

export const TradingViewBanner: React.FC<TradingViewBannerProps> = ({ 
  variant = 'full',
  className = '' 
}) => {
  if (variant === 'compact') {
    return (
      <aside 
        className={`tradingview-partner-compact ${className}`}
        aria-label="Institutional Partner - TradingView"
        style={{
          background: 'linear-gradient(145deg, var(--bg-surface-elevated) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-medium)',
          borderLeft: '4px solid #2962FF',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          margin: '1.5rem 0',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              fontWeight: 900, 
              fontSize: '0.9rem', 
              letterSpacing: '-0.02em', 
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-brand)' 
            }}>
              TradingView
            </span>
            <span style={{ 
              fontSize: '0.62rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              background: 'rgba(41, 98, 255, 0.12)', 
              color: '#2962FF', 
              padding: '2px 6px', 
              borderRadius: '4px' 
            }}>
              Official Partner
            </span>
          </div>
          <Sparkles size={14} color="var(--accent-gold)" />
        </div>

        <h4 style={{ fontSize: '0.96rem', margin: '0 0 0.4rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
          Live Financial Terminal & Advanced Macro Charting
        </h4>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: '1.5' }}>
          Real-time sovereign yield curves, FX cross-rates, and multi-asset forensic analytics. Claim up to <strong>$30 credit</strong> with the BullMonk partner link.
        </p>

        <a 
          href={TRADINGVIEW_AFFILIATE_URL}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="btn btn-primary btn-sm"
          style={{ 
            width: '100%', 
            justifyContent: 'center', 
            background: '#2962FF', 
            borderColor: '#2962FF',
            color: '#FFFFFF',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          <span>Claim Up to $30 Credit</span>
          <ExternalLink size={13} style={{ marginLeft: '4px' }} />
        </a>

        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.6rem', textAlign: 'center' }}>
          Sponsored Partner • Zero cost to reader
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className={`tradingview-partner-full ${className}`}
      aria-label="Institutional Charting Partner - TradingView"
    >
      <div className="tradingview-full-inner">
        <div className="tv-col-main">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ 
              fontWeight: 900, 
              fontSize: '1.15rem', 
              letterSpacing: '-0.03em', 
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-brand)' 
            }}>
              TradingView
            </span>
            <span style={{ 
              fontSize: '0.68rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              background: '#2962FF', 
              color: '#FFFFFF', 
              padding: '2px 8px', 
              borderRadius: '4px' 
            }}>
              Official Market Partner
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
              <ShieldCheck size={13} /> Institutional Verified
            </span>
          </div>

          <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: 'clamp(1.15rem, 3vw, 1.35rem)', margin: '0 0 0.5rem', color: 'var(--text-primary)', lineHeight: '1.35' }}>
            Forensic Technical Analysis & Global Real-Time Market Infrastructure
          </h3>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 1rem', maxWidth: '640px' }}>
            Track over 100,000 sovereign bonds, equities, global currencies, and commodities. Test quantitative trading algorithms and inspect live depth-of-market books alongside BULLMONK dispatches. 
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <TrendingUp size={14} color="#2962FF" /> Multi-Asset Real-Time Feeds
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={14} color="var(--accent-gold)" /> Exclusive Up to $30 Bonus Credit
            </span>
          </div>
        </div>

        <div className="tv-col-cta">
          <a 
            href={TRADINGVIEW_AFFILIATE_URL}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="btn btn-primary tv-cta-btn"
            style={{ 
              background: '#2962FF', 
              borderColor: '#2962FF',
              color: '#FFFFFF',
              fontWeight: 700,
              padding: '0.85rem 1.6rem',
              fontSize: '0.95rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 4px 14px rgba(41, 98, 255, 0.3)'
            }}
          >
            <span>Claim Up to $30 Credit</span>
            <ExternalLink size={16} />
          </a>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.65rem', lineHeight: '1.4' }}>
            Available for all new & upgraded accounts.<br />
            Partner link verified by BullMonk Desk.
          </div>
        </div>
      </div>

      {/* Statutory FTC & Financial Partner Disclosure */}
      <div style={{ 
        marginTop: '1.25rem', 
        paddingTop: '0.85rem', 
        borderTop: '1px solid var(--border-subtle)', 
        fontSize: '0.7rem', 
        color: 'var(--text-muted)',
        lineHeight: '1.4'
      }}>
        <em>Institutional Disclosure:</em> BULLMONK maintains independent research integrity. When readers register or upgrade through our certified TradingView partner link, our newsroom may receive referral compensation at no extra expense to you.
      </div>
    </aside>
  );
};
