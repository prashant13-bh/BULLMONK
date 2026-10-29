import React from 'react';

interface BureauFlagProps {
  id: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BureauFlag: React.FC<BureauFlagProps> = ({ id, size = 'sm', className = '' }) => {
  const width = size === 'lg' ? 24 : size === 'md' ? 20 : 16;
  const height = size === 'lg' ? 16 : size === 'md' ? 13 : 11;

  switch (id) {
    case 'all':
    case 'Global':
      return (
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 20 20" 
          fill="none" 
          className={`bureau-flag ${className}`} 
          aria-hidden="true"
          style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}
        >
          <circle cx="10" cy="10" r="9" stroke="var(--accent-gold)" strokeWidth="1.6" fill="rgba(180, 83, 9, 0.12)" />
          <path d="M10 1 A 9 9 0 0 0 10 19 M10 1 A 9 9 0 0 1 10 19" stroke="var(--accent-gold)" strokeWidth="1.2" />
          <path d="M2 7.5 H 18 M2 12.5 H 18" stroke="var(--accent-gold)" strokeWidth="1.2" />
          <ellipse cx="10" cy="10" rx="4.5" ry="9" stroke="var(--accent-gold)" strokeWidth="1.2" />
        </svg>
      );

    case 'United States':
      return (
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 24 16" 
          className={`bureau-flag ${className}`} 
          aria-hidden="true"
          style={{ flexShrink: 0, borderRadius: '2px', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(0,0,0,0.12)', display: 'inline-block', verticalAlign: 'middle' }}
        >
          <rect width="24" height="16" fill="#B91C1C" />
          <rect y="2.46" width="24" height="2.46" fill="#FFFFFF" />
          <rect y="7.38" width="24" height="2.46" fill="#FFFFFF" />
          <rect y="12.3" width="24" height="2.46" fill="#FFFFFF" />
          <rect width="10" height="8.6" fill="#1E3A8A" />
          <circle cx="3" cy="2.5" r="0.75" fill="#FFFFFF" />
          <circle cx="7" cy="2.5" r="0.75" fill="#FFFFFF" />
          <circle cx="5" cy="4.3" r="0.75" fill="#FFFFFF" />
          <circle cx="3" cy="6.1" r="0.75" fill="#FFFFFF" />
          <circle cx="7" cy="6.1" r="0.75" fill="#FFFFFF" />
        </svg>
      );

    case 'Europe':
      return (
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 24 16" 
          className={`bureau-flag ${className}`} 
          aria-hidden="true"
          style={{ flexShrink: 0, borderRadius: '2px', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(0,0,0,0.12)', display: 'inline-block', verticalAlign: 'middle' }}
        >
          <rect width="24" height="16" fill="#003399" />
          <circle cx="12" cy="8" r="4.6" fill="none" stroke="#FFCC00" strokeWidth="1.3" strokeDasharray="1.1 1.3" />
        </svg>
      );

    case 'India':
      return (
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 24 16" 
          className={`bureau-flag ${className}`} 
          aria-hidden="true"
          style={{ flexShrink: 0, borderRadius: '2px', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(0,0,0,0.12)', display: 'inline-block', verticalAlign: 'middle' }}
        >
          <rect width="24" height="5.33" fill="#FF9933" />
          <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
          <rect y="10.66" width="24" height="5.34" fill="#138808" />
          <circle cx="12" cy="8" r="2.2" fill="none" stroke="#000080" strokeWidth="0.8" />
          <circle cx="12" cy="8" r="0.6" fill="#000080" />
        </svg>
      );

    case 'Asia-Pacific':
      return (
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 24 16" 
          className={`bureau-flag ${className}`} 
          aria-hidden="true"
          style={{ flexShrink: 0, borderRadius: '2px', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(0,0,0,0.12)', display: 'inline-block', verticalAlign: 'middle' }}
        >
          <rect width="24" height="16" fill="#F8FAFC" />
          <circle cx="12" cy="8" r="4.8" fill="#DC2626" />
        </svg>
      );

    case 'Middle East':
      return (
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 24 16" 
          className={`bureau-flag ${className}`} 
          aria-hidden="true"
          style={{ flexShrink: 0, borderRadius: '2px', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(0,0,0,0.12)', display: 'inline-block', verticalAlign: 'middle' }}
        >
          <rect width="24" height="5.33" fill="#007A3D" />
          <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
          <rect y="10.66" width="24" height="5.34" fill="#000000" />
          <polygon points="0,0 8,8 0,16" fill="#CE1126" />
        </svg>
      );

    case 'Canada':
      return (
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 24 16" 
          className={`bureau-flag ${className}`} 
          aria-hidden="true"
          style={{ flexShrink: 0, borderRadius: '2px', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(0,0,0,0.12)', display: 'inline-block', verticalAlign: 'middle' }}
        >
          <rect width="6" height="16" fill="#D80027" />
          <rect x="6" width="12" height="16" fill="#FFFFFF" />
          <rect x="18" width="6" height="16" fill="#D80027" />
          <path d="M12 4 L13 6.5 L15 6 L14 8 L16 9 L13.5 10 L13.5 12 L12 11 L10.5 12 L10.5 10 L8 9 L10 8 L9 6 L11 6.5 Z" fill="#D80027" />
        </svg>
      );

    case 'Australia & NZ':
      return (
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 24 16" 
          className={`bureau-flag ${className}`} 
          aria-hidden="true"
          style={{ flexShrink: 0, borderRadius: '2px', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(0,0,0,0.12)', display: 'inline-block', verticalAlign: 'middle' }}
        >
          <rect width="24" height="16" fill="#00008B" />
          <rect width="10" height="8" fill="#00247D" />
          <path d="M0 0 L10 8 M10 0 L0 8" stroke="#FFFFFF" strokeWidth="0.8" />
          <circle cx="5" cy="12" r="1.3" fill="#FFFFFF" />
          <circle cx="17" cy="4" r="0.75" fill="#FFFFFF" />
          <circle cx="19" cy="7" r="0.75" fill="#FFFFFF" />
          <circle cx="15" cy="8" r="0.75" fill="#FFFFFF" />
          <circle cx="17" cy="12" r="0.75" fill="#FFFFFF" />
        </svg>
      );

    case 'Russia & Eurasia':
      return (
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 24 16" 
          className={`bureau-flag ${className}`} 
          aria-hidden="true"
          style={{ flexShrink: 0, borderRadius: '2px', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(0,0,0,0.12)', display: 'inline-block', verticalAlign: 'middle' }}
        >
          <rect width="24" height="5.33" fill="#FFFFFF" />
          <rect y="5.33" width="24" height="5.33" fill="#0039A6" />
          <rect y="10.66" width="24" height="5.34" fill="#D52B1E" />
        </svg>
      );

    default:
      return null;
  }
};
