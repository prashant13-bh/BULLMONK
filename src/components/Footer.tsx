import React from 'react';
import { PageView } from '../types';
import { Shield, PenSquare, Lock } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
  setSelectedCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, setSelectedCategory }) => {
  const navigate = (page: PageView, cat?: string) => {
    setCurrentPage(page);
    if (cat) setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: '#04070D', borderTop: '1px solid var(--border-subtle)', padding: '4rem 0 2rem', marginTop: 'auto', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <div className="brand-emblem" style={{ width: '26px', height: '26px', fontSize: '0.9rem' }}>BM</div>
              <span style={{ fontFamily: 'var(--font-brand)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '0.12em' }}>BULLMONK</span>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem', fontSize: '0.84rem' }}>
              Independent international news and intelligence organization dedicated to rigorous geopolitical reporting, macroeconomic forensic analysis, and sovereign technological developments.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-secondary" 
                style={{ fontSize: '0.74rem', padding: '0.4rem 0.85rem' }}
                onClick={() => navigate('contact')}
                aria-label="Open Zero-Knowledge Tip Line"
              >
                <Lock size={13} /> Zero-Knowledge Tip Line
              </button>
            </div>
          </div>

          {/* Intelligence Desks */}
          <div>
            <h5 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)', marginBottom: '1rem' }}>
              Intelligence Desks
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('home', 'Markets & Finance')}>Global Macro & Forex</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('home', 'Technology & AI')}>Semiconductors & AI</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('home', 'World Affairs')}>Geopolitics & Treaties</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('home', 'Energy & Climate')}>Energy Transition</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('home', 'Culture & Ideas')}>Culture & Philosophy</span></li>
            </ul>
          </div>

          {/* Newsroom */}
          <div>
            <h5 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)', marginBottom: '1rem' }}>
              Newsroom
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('about')}>About BullMonk</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('about')}>Global Bureaus</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('contact')}>Contact & Press Desk</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('contact')}>Whistleblower Tip Line</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('legal')}>Editorial Charter & Ethics</span></li>
            </ul>
          </div>

          {/* Legal & Standards */}
          <div>
            <h5 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)', marginBottom: '1rem' }}>
              Governance & Legal
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('legal')}>Financial & YMYL Disclaimer</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('legal')}>Privacy Policy (AdSense & GDPR)</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('legal')}>Terms of Service</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('legal')}>Editorial Ethics Charter</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('legal')}>Cookie Telemetry Policy</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => navigate('legal')}>Corrections Policy</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          <div>
            © 2026 BULLMONK Intelligence Group Ltd. All global rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={12} color="var(--accent-gold)" /> Verified Integrity Consortium
            </span>
            <span>Cryptographic Source Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
