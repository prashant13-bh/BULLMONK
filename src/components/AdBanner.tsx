import React from 'react';

interface AdBannerProps {
  slotType: 'leaderboard' | 'in-article' | 'rectangle';
  slotId?: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slotType, slotId = '0000000000', className = '' }) => {
  return (
    <aside 
      className={`ad-container ${className}`}
      aria-label="Advertisement"
      style={{
        margin: '2rem auto',
        textAlign: 'center',
        maxWidth: slotType === 'rectangle' ? '320px' : '760px',
        width: '100%',
        clear: 'both'
      }}
    >
      <div style={{
        fontSize: '0.62rem',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: 'var(--text-muted)',
        marginBottom: '4px',
        fontWeight: 700
      }}>
        ADVERTISEMENT
      </div>

      <div style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px dashed var(--border-medium)',
        borderRadius: 'var(--radius-sm)',
        padding: slotType === 'rectangle' ? '1.5rem 1rem' : '1.25rem 1rem',
        minHeight: slotType === 'leaderboard' ? '90px' : (slotType === 'rectangle' ? '250px' : '120px'),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        color: 'var(--text-muted)'
      }}>
        {/* Placeholder ready for Google AdSense <ins> tag */}
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-gold)' }}>
          Google AdSense Responsive Unit
        </span>
        <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
          Format: {slotType.toUpperCase()} (Slot ID: {slotId})
        </span>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          High-CPM Targeted Institutional & Finance Network
        </span>
      </div>
    </aside>
  );
};
