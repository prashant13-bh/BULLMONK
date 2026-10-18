import React, { useEffect } from 'react';

interface AdBannerProps {
  slotType: 'leaderboard' | 'in-article' | 'rectangle';
  slotId?: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  slotType, 
  slotId = '7155174810', 
  className = '' 
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (e) {
      // Ignore if AdSense script not loaded yet
    }
  }, []);

  return (
    <aside 
      className={`ad-container ad-${slotType} ${className}`}
      aria-label="Sponsor & AdSense Network"
      style={{
        margin: slotType === 'leaderboard' ? '1.5rem auto' : '2.5rem auto',
        textAlign: 'center',
        maxWidth: slotType === 'rectangle' ? '360px' : '980px',
        width: '100%',
        clear: 'both',
        contain: 'layout'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '6px'
      }}>
        <span style={{
          fontSize: '0.62rem',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          fontWeight: 700
        }}>
          ADVERTISEMENT & SPONSORED DISPATCH
        </span>
        <span style={{ fontSize: '0.55rem', padding: '1px 5px', borderRadius: '3px', background: 'var(--bg-surface-subtle)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          PUB-7155174810446636
        </span>
      </div>

      <div 
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: slotType === 'rectangle' ? '1.5rem 1.25rem' : '0.85rem 1.25rem',
          minHeight: slotType === 'leaderboard' ? '105px' : (slotType === 'rectangle' ? '280px' : '130px'),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Real AdSense Slot Element */}
        <ins 
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-7155174810446636"
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        {/* Discrete Institutional Sponsor Bar Fallback */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '0.4rem 0.75rem',
          width: '100%',
          flexWrap: 'wrap'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)' }}></span>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
            BULLMONK GLOBAL INVESTOR NETWORK
          </span>
          <span style={{ color: 'var(--border-medium)' }}>•</span>
          <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
            Institutional Wealth & Sovereign Portfolio Strategies
          </span>
        </div>
      </div>
    </aside>
  );
};
