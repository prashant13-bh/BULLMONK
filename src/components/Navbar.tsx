import React, { useState } from 'react';
import { PageView, MarketTicker } from '../types';
import { Sun, Moon, PenSquare, Menu, X, Globe, Shield, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  tickers: MarketTicker[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  setSelectedCategory,
  tickers,
  theme,
  toggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PageView, category?: string) => {
    setCurrentPage(page);
    if (category) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Live Market Ticker Marquee */}
      <aside className="ticker-wrap" aria-label="Global Market Indices">
        <div className="ticker-label">
          <span className="ticker-pulse"></span>
          MARKETS WIRE
        </div>
        <div className="ticker-marquee">
          <div className="ticker-track">
            {[...tickers, ...tickers].map((item, idx) => (
              <div key={idx} className="ticker-item">
                <span className="ticker-symbol">{item.symbol}</span>
                <span>{item.value}</span>
                <span className={`ticker-change ${item.positive ? 'pos' : 'neg'}`}>
                  {item.positive ? '▲' : '▼'} {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. Main Site Header */}
      <header className="site-header">
        <div className="container">
          <div className="header-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span className="badge badge-desk" style={{ fontSize: '0.68rem' }}>
                <Globe size={12} /> Global Edition
              </span>
              <span style={{ fontFamily: 'var(--font-mono)' }} className="hide-on-mobile">
                London • Zurich • Tokyo • New York
              </span>
            </div>

            {/* Brand Logo */}
            <div className="brand-logo-container" onClick={() => handleNavClick('home', 'all')}>
              <div className="brand-logo">
                <div className="brand-emblem">BM</div>
                <span>BULLMONK</span>
              </div>
              <span className="brand-tagline">Global Intelligence & Market Truth</span>
            </div>

            {/* Actions: Write, Theme, Mobile toggle */}
            <div className="header-actions">
              <button 
                className="btn btn-primary"
                onClick={() => handleNavClick('write')}
                title="Open BullMonk Editorial Studio"
              >
                <PenSquare size={16} />
                <span>Write Story</span>
              </button>

              <button 
                className="btn-icon" 
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light Paper' : 'Night Terminal'} theme`}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button 
                className="btn-icon mobile-nav-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Desktop Nav Bar */}
          <nav className="header-nav">
            <ul className="nav-links">
              <li className="nav-item">
                <span 
                  className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home', 'all')}
                >
                  Home Wire
                </span>
              </li>
              <li className="nav-item">
                <span 
                  className="nav-link"
                  onClick={() => handleNavClick('home', 'Markets & Finance')}
                >
                  Markets & Finance
                </span>
              </li>
              <li className="nav-item">
                <span 
                  className="nav-link"
                  onClick={() => handleNavClick('home', 'Technology & AI')}
                >
                  Tech & AI <span className="badge badge-breaking" style={{ fontSize: '0.55rem', padding: '1px 4px', marginLeft: '3px' }}>Hot</span>
                </span>
              </li>
              <li className="nav-item">
                <span 
                  className="nav-link"
                  onClick={() => handleNavClick('home', 'World Affairs')}
                >
                  Geopolitics
                </span>
              </li>
              <li className="nav-item">
                <span 
                  className="nav-link"
                  onClick={() => handleNavClick('home', 'Energy & Climate')}
                >
                  Energy & Climate
                </span>
              </li>
              <li className="nav-item">
                <span 
                  className={`nav-link ${currentPage === 'write' ? 'active' : ''}`}
                  onClick={() => handleNavClick('write')}
                  style={{ color: 'var(--accent-gold)' }}
                >
                  <Sparkles size={14} /> BullMonk Studio
                </span>
              </li>
            </ul>

            <div className="nav-secondary-links">
              <span className="nav-secondary-link" onClick={() => handleNavClick('about')}>About</span>
              <span className="nav-secondary-link" onClick={() => handleNavClick('contact')}>
                <Shield size={13} style={{ display: 'inline', marginRight: '3px' }} /> Tip Line
              </span>
              <span className="nav-secondary-link" onClick={() => handleNavClick('legal')}>Legal & Ethics</span>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <span className="nav-link" onClick={() => handleNavClick('home', 'all')}>🏠 Home Wire</span>
            <span className="nav-link" onClick={() => handleNavClick('home', 'Markets & Finance')}>📈 Markets & Finance</span>
            <span className="nav-link" onClick={() => handleNavClick('home', 'Technology & AI')}>⚡ Technology & AI</span>
            <span className="nav-link" onClick={() => handleNavClick('home', 'World Affairs')}>🌐 Geopolitics & Treaties</span>
            <span className="nav-link" onClick={() => handleNavClick('home', 'Energy & Climate')}>⚛️ Energy & Climate</span>
            <span className="nav-link" onClick={() => handleNavClick('write')} style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
              ✍️ Write & Publish Story
            </span>
            <span className="nav-link" onClick={() => handleNavClick('about')}>🏛️ About Newsroom</span>
            <span className="nav-link" onClick={() => handleNavClick('contact')}>🔒 Whistleblower Tip Line</span>
            <span className="nav-link" onClick={() => handleNavClick('legal')}>⚖️ Legal Suite & Standards</span>
          </div>
        )}
      </header>
    </>
  );
};
