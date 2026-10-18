import React, { useState, useEffect } from 'react';
import { PageView, MarketTicker } from '../types';
import { 
  Sun, Moon, PenSquare, Menu, X, Globe, Shield, Sparkles, 
  Search, Radio, TrendingUp, Cpu, Flame, Lock, ChevronRight 
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  tickers: MarketTicker[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  selectedCategory,
  setSelectedCategory,
  tickers,
  theme,
  toggleTheme,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [worldTimes, setWorldTimes] = useState<{ city: string; time: string }[]>([]);

  // Real-time world clocks
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      };
      setCurrentTimeStr(now.toLocaleDateString('en-US', options));

      const formatTime = (timeZone: string) => {
        try {
          return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone
          }).format(now);
        } catch (e) {
          return '--:--';
        }
      };

      setWorldTimes([
        { city: 'NYC', time: formatTime('America/New_York') },
        { city: 'LON', time: formatTime('Europe/London') },
        { city: 'ZUR', time: formatTime('Europe/Zurich') },
        { city: 'MUM', time: formatTime('Asia/Kolkata') },
        { city: 'TYO', time: formatTime('Asia/Tokyo') }
      ]);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (page: PageView, category?: string) => {
    setCurrentPage(page);
    if (category) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to render SVG mini sparkline polyline points
  const generateSvgPoints = (data: number[], width = 36, height = 13) => {
    if (!data || data.length === 0) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    return data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 3) - 1.5;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <>
      {/* 1. Global Financial Masthead Bar with World Clocks */}
      <div className="masthead-clock-bar">
        <div className="container">
          <div className="masthead-clock-inner">
            {/* Left: Date & Market Status */}
            <div className="masthead-status-group">
              <span className="status-live-indicator">
                <span className="status-dot"></span>
                <span>GLOBAL DESKS LIVE</span>
              </span>
              <span className="masthead-separator hide-on-mobile">•</span>
              <span className="masthead-date hide-on-mobile">{currentTimeStr}</span>
            </div>

            {/* Center: Live World Clocks */}
            <div className="world-clocks-row hide-on-tablet">
              {worldTimes.map((item, idx) => (
                <div key={idx} className="clock-item">
                  <span className="clock-city">{item.city}</span>
                  <span className="clock-time">{item.time}</span>
                </div>
              ))}
            </div>

            {/* Right: Security & Quick Tip */}
            <div className="masthead-right-group">
              <span 
                className="whistleblower-link"
                onClick={() => handleNavClick('contact')}
                title="Zero-Knowledge Secure Tip Line"
              >
                <Lock size={11} /> Whistleblower Tip
              </span>
              <span className="masthead-separator hide-on-mobile">•</span>
              <span 
                className="masthead-edition-badge hide-on-mobile"
                onClick={() => handleNavClick('about')}
              >
                Vol. IV No. 288
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Live Market Ticker Marquee with SVG Sparklines */}
      <aside className="ticker-wrap" aria-label="Global Market Indices">
        <div className="ticker-label">
          <Radio size={12} className="ticker-pulse-icon" />
          <span>MARKET WIRE</span>
        </div>
        <div className="ticker-marquee">
          <div className="ticker-track">
            {[...tickers, ...tickers].map((item, idx) => (
              <div key={idx} className="ticker-item">
                <span className="ticker-symbol">{item.symbol}</span>
                <span className="ticker-val">{item.value}</span>
                
                {/* Real SVG mini sparkline */}
                {item.sparkline && item.sparkline.length > 0 && (
                  <svg 
                    width="36" 
                    height="13" 
                    viewBox="0 0 36 13" 
                    className="ticker-sparkline"
                    aria-hidden="true"
                  >
                    <polyline
                      fill="none"
                      stroke={item.positive ? '#10B981' : '#EF4444'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={generateSvgPoints(item.sparkline, 36, 13)}
                    />
                  </svg>
                )}

                <span className={`ticker-change ${item.positive ? 'pos' : 'neg'}`}>
                  {item.positive ? '▲' : '▼'} {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 3. Main Site Header & Brand Monogram */}
      <header className="site-header">
        <div className="container">
          <div className="header-top">
            
            {/* Left: Quick Search Button */}
            <div className="header-left-tools">
              <button 
                className="btn-search-trigger"
                onClick={onOpenSearch}
                title="Search dispatches (Ctrl+K or ⌘K)"
                aria-label="Open Search"
              >
                <Search size={15} />
                <span className="hide-on-mobile">Search Intelligence</span>
                <kbd className="search-shortcut hide-on-mobile">⌘K</kbd>
              </button>
            </div>

            {/* Center: Brand Logo */}
            <div className="brand-logo-container" onClick={() => handleNavClick('home', 'all')}>
              <div className="brand-logo">
                <div className="brand-emblem">BM</div>
                <span className="brand-text">BULLMONK</span>
              </div>
              <span className="brand-tagline">The Sovereign Chronicle of Global Finance & Geopolitics</span>
            </div>

            {/* Right: Actions: Tip Line, Theme, Mobile Drawer */}
            <div className="header-actions">
              <button 
                className="btn btn-primary"
                onClick={() => handleNavClick('contact')}
                title="Zero-Knowledge Encrypted Whistleblower Line"
              >
                <Lock size={14} />
                <span>Tip Line</span>
              </button>

              <button 
                className="btn-icon theme-toggle-btn" 
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Prestige Paper' : 'Night Terminal'} theme`}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
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

          {/* Desktop Navigation Links Bar */}
          <nav className="header-nav">
            <ul className="nav-links">
              <li className="nav-item">
                <span 
                  className={`nav-link ${currentPage === 'home' && selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home', 'all')}
                >
                  Home Wire
                </span>
              </li>
              <li className="nav-item">
                <span 
                  className={`nav-link ${currentPage === 'home' && selectedCategory === 'Markets & Finance' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home', 'Markets & Finance')}
                >
                  <TrendingUp size={13} /> Markets & Rates
                </span>
              </li>
              <li className="nav-item">
                <span 
                  className={`nav-link ${currentPage === 'home' && selectedCategory === 'Technology & AI' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home', 'Technology & AI')}
                >
                  <Cpu size={13} /> Tech & Semis
                  <span className="nav-hot-badge">Hot</span>
                </span>
              </li>
              <li className="nav-item">
                <span 
                  className={`nav-link ${currentPage === 'home' && selectedCategory === 'World Affairs' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home', 'World Affairs')}
                >
                  <Globe size={13} /> Geopolitics
                </span>
              </li>
              <li className="nav-item">
                <span 
                  className={`nav-link ${currentPage === 'home' && selectedCategory === 'Energy & Climate' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home', 'Energy & Climate')}
                >
                  <Flame size={13} /> Commodities & Energy
                </span>
              </li>
            </ul>

            <div className="nav-secondary-links hide-on-tablet">
              <span className="nav-secondary-link" onClick={() => handleNavClick('about')}>
                Bureaus & Board
              </span>
              <span className="nav-secondary-link" onClick={() => handleNavClick('contact')}>
                Whistleblower
              </span>
              <span className="nav-secondary-link" onClick={() => handleNavClick('legal')}>
                Disclosures
              </span>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <div className="mobile-search-row">
              <button 
                className="btn-search-trigger"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { setMobileMenuOpen(false); onOpenSearch?.(); }}
              >
                <Search size={16} /> Search Intelligence Archive
              </button>
            </div>

            <span 
              className={`nav-link ${currentPage === 'home' && selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleNavClick('home', 'all')}
            >
              Home Wire
            </span>
            <span 
              className={`nav-link ${currentPage === 'home' && selectedCategory === 'Markets & Finance' ? 'active' : ''}`}
              onClick={() => handleNavClick('home', 'Markets & Finance')}
            >
              Markets & Rates
            </span>
            <span 
              className={`nav-link ${currentPage === 'home' && selectedCategory === 'Technology & AI' ? 'active' : ''}`}
              onClick={() => handleNavClick('home', 'Technology & AI')}
            >
              Technology & AI
            </span>
            <span 
              className={`nav-link ${currentPage === 'home' && selectedCategory === 'World Affairs' ? 'active' : ''}`}
              onClick={() => handleNavClick('home', 'World Affairs')}
            >
              Geopolitics & Sovereignty
            </span>
            <span 
              className={`nav-link ${currentPage === 'home' && selectedCategory === 'Energy & Climate' ? 'active' : ''}`}
              onClick={() => handleNavClick('home', 'Energy & Climate')}
            >
              Energy & Commodities
            </span>
            <span className="nav-link" onClick={() => handleNavClick('about')}>
              Editorial Board & Bureaus
            </span>
            <span className="nav-link" onClick={() => handleNavClick('contact')}>
              Zero-Knowledge Whistleblower Line
            </span>
            <span className="nav-link" onClick={() => handleNavClick('legal')}>
              AdSense & YMYL Disclosures
            </span>
          </div>
        )}
      </header>
    </>
  );
};
