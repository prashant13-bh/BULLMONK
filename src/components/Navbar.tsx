import React, { useState, useEffect } from 'react';
import { PageView, MarketTicker, AdminUser } from '../types';
import { MarketTickerBar } from './MarketTickerBar';
import { 
  Sun, Moon, Menu, X, Globe, Shield, Sparkles, 
  Search, Radio, TrendingUp, Cpu, Flame, Lock, ChevronRight,
  BookOpen, Landmark, Clock, ExternalLink, ArrowRight, FileText,
  DollarSign, Cookie, AlertCircle, Calculator, PenTool, ShieldCheck
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
  adminUser?: AdminUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  selectedCategory,
  setSelectedCategory,
  tickers,
  theme,
  toggleTheme,
  onOpenSearch,
  adminUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [worldTimes, setWorldTimes] = useState<{ city: string; time: string }[]>([]);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

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

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (page: PageView, category?: string) => {
    setCurrentPage(page);
    if (category) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isToolsActive = currentPage === 'tools' || 
    currentPage === 'tool-bond' || 
    currentPage === 'tool-inflation' || 
    currentPage === 'tool-fx' || 
    currentPage === 'tool-compound' || 
    currentPage === 'tool-ai-power' || 
    currentPage === 'tool-repo-spread' || 
    currentPage === 'tool-water-cooling' || 
    currentPage === 'tool-forex-tariff';

  const isDocToolsActive = currentPage === 'doc-tools' || currentPage === 'tool-pdf' || currentPage === 'tool-image';

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
            {/* Left: Live Newsroom Status & Date */}
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

            {/* Right: Whistleblower Tip & Edition */}
            <div className="masthead-right-group">
              <button 
                type="button"
                className="whistleblower-link"
                onClick={() => handleNavClick('contact')}
                title="Zero-Knowledge Secure Whistleblower Tip Line"
                aria-label="Open Whistleblower Tip Line"
              >
                <Lock size={11} /> 
                <span>Whistleblower Tip</span>
              </button>
              <span className="masthead-separator hide-on-mobile">•</span>
              <button 
                type="button"
                className="masthead-edition-badge hide-on-mobile"
                onClick={() => handleNavClick('about')}
                title="View BullMonk Bureaus & Editorial Board"
                aria-label="View BullMonk Bureaus & Editorial Board"
                style={{ background: 'none', border: 'none', font: 'inherit', padding: 0 }}
              >
                Vol. IV • Intl Edition
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* 2. Live Global Market Ticker Bar (Multi-Asset Streaming Rails) */}
      <MarketTickerBar initialTickers={tickers} />

      {/* 3. Main Site Header */}
      <header className="site-header">
        <div className="container">
          <div className="header-top">
            
            {/* Left Tools: Search & Global Wire Indicator */}
            <div className="header-left-tools">
              <button 
                type="button"
                className="btn-search-trigger"
                onClick={onOpenSearch}
                title="Search dispatches (Ctrl+K or ⌘K)"
                aria-label="Open Search Intelligence Modal"
              >
                <Search size={15} />
                <span className="hide-on-mobile">Search Intelligence</span>
                <kbd className="search-shortcut hide-on-mobile">⌘K</kbd>
              </button>

              <span className="header-edition-tag hide-on-tablet">
                <Globe size={12} color="var(--accent-gold)" />
                <span>Global Edition</span>
              </span>
            </div>

            {/* Center: Majestic Brand Crest */}
            <div 
              className="brand-logo-container" 
              onClick={() => handleNavClick('home', 'all')}
              role="button"
              tabIndex={0}
              aria-label="BULLMONK Home Wire"
              onKeyDown={(e) => { if (e.key === 'Enter') handleNavClick('home', 'all'); }}
            >
              <div className="brand-logo">
                <div className="brand-emblem">BM</div>
                <span className="brand-text">BULLMONK</span>
              </div>
              <div className="brand-tagline-wrapper">
                <span className="tagline-rule left-rule"></span>
                <span className="brand-tagline">GLOBAL FINANCIAL INTELLIGENCE & GEOPOLITICAL TRUTH</span>
                <span className="tagline-rule right-rule"></span>
              </div>
            </div>

            {/* Right: Actions (Tip Line, Theme Toggle, Mobile Menu) */}
            <div className="header-actions">
              <button 
                type="button"
                className="btn btn-primary tip-line-header-btn hide-on-mobile"
                onClick={() => handleNavClick('contact')}
                title="Zero-Knowledge Encrypted Whistleblower Line"
                aria-label="Open Whistleblower Tip Line"
              >
                <Lock size={13} />
                <span>Tip Line</span>
              </button>

              <button 
                type="button"
                className="btn-icon theme-toggle-btn" 
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Prestige Paper' : 'Night Terminal'} theme`}
                aria-label="Toggle Night/Light Theme"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              <button 
                type="button"
                className="btn-icon mobile-nav-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Drawer"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links Bar */}
          <nav className="header-nav" aria-label="Main Navigation">
            <ul className="nav-links">
              <li className="nav-item">
                <button 
                  type="button"
                  className={`nav-link ${currentPage === 'home' && selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home', 'all')}
                >
                  Home Wire
                </button>
              </li>
              <li className="nav-item">
                <button 
                  type="button"
                  className={`nav-link ${currentPage === 'home' && selectedCategory === 'Markets & Finance' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home', 'Markets & Finance')}
                  title="Markets & Rates — Sovereign Debt & Global Capital Flows"
                >
                  <TrendingUp size={13} />
                  <span>Markets & Rates</span>
                </button>
              </li>
              <li className="nav-item">
                <button 
                  type="button"
                  className={`nav-link ${currentPage === 'home' && selectedCategory === 'Technology & AI' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home', 'Technology & AI')}
                  title="Tech & Semis — Artificial Intelligence & Semiconductor Geopolitics"
                >
                  <Cpu size={13} />
                  <span>Tech & Semis</span>
                  <span className="nav-hot-badge">Hot</span>
                </button>
              </li>
              <li className="nav-item">
                <button 
                  type="button"
                  className={`nav-link ${currentPage === 'home' && selectedCategory === 'World Affairs' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home', 'World Affairs')}
                  title="Geopolitics — Sovereign Corridors & World Affairs"
                >
                  <Globe size={13} />
                  <span>Geopolitics</span>
                </button>
              </li>
              <li className="nav-item">
                <button 
                  type="button"
                  className={`nav-link ${currentPage === 'home' && selectedCategory === 'Energy & Climate' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home', 'Energy & Climate')}
                  title="Commodities & Energy — Critical Minerals, Oil & Energy Transition"
                >
                  <Flame size={13} />
                  <span>Commodities & Energy</span>
                </button>
              </li>
              <li className="nav-item">
                <button 
                  type="button"
                  className={`nav-link ${currentPage === 'home' && selectedCategory === 'Culture & Ideas' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home', 'Culture & Ideas')}
                  title="Culture & Ideas — Industrial Systems & Strategic Essays"
                >
                  <BookOpen size={13} />
                  <span>Culture & Ideas</span>
                </button>
              </li>
              <li className="nav-item">
                <button 
                  type="button"
                  className={`nav-link ${isToolsActive ? 'active' : ''} nav-tools-link`}
                  onClick={() => handleNavClick('tools')}
                  title="Financial Tools — Sovereign Yield, Bond Duration & Inflation Calculators"
                >
                  <Calculator size={13} />
                  <span>Financial Tools</span>
                </button>
              </li>
              <li className="nav-item">
                <button 
                  type="button"
                  className={`nav-link ${isDocToolsActive ? 'active' : ''} nav-tools-link`}
                  onClick={() => handleNavClick('doc-tools')}
                  title="AI & Doc Tools — PDF Studio & Client-Side File Triage"
                >
                  <FileText size={13} />
                  <span>AI & Doc Tools</span>
                  <span className="nav-hot-badge">AI</span>
                </button>
              </li>
            </ul>

            <div className="nav-secondary-links hide-on-tablet">
              {adminUser && (
                <button 
                  type="button"
                  className={`nav-secondary-link ${currentPage === 'admin' ? 'active' : ''}`} 
                  onClick={() => handleNavClick('admin')}
                  title="Managing Desk — Editorial Command & Curation Console"
                  style={{ color: 'var(--accent-gold)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <ShieldCheck size={13} color="var(--accent-gold)" />
                  Managing Desk
                </button>
              )}
              <button 
                type="button"
                className={`nav-secondary-link ${currentPage === 'about' ? 'active' : ''}`} 
                onClick={() => handleNavClick('about')}
                title="Bureaus & Board — Editorial Leadership & Global Bureau Directory"
              >
                Bureaus & Board
              </button>
              <button 
                type="button"
                className={`nav-secondary-link ${currentPage === 'legal' ? 'active' : ''}`} 
                onClick={() => handleNavClick('legal')}
                title="Compliance Hub — Master Legal, Privacy & Governance Suite"
              >
                Compliance Hub
              </button>
            </div>
          </nav>
        </div>

        {/* 4. Luxury Mobile Drawer & Full-Screen Overlay */}
        {mobileMenuOpen && (
          <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
              
              {/* Drawer Top Header */}
              <div className="mobile-drawer-header">
                <div className="mobile-drawer-brand">
                  <div className="brand-emblem" style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}>BM</div>
                  <span style={{ fontFamily: 'var(--font-brand)', fontWeight: 900, letterSpacing: '0.12em', fontSize: '1.15rem' }}>BULLMONK</span>
                </div>
                <button 
                  type="button"
                  className="btn-icon" 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close Mobile Drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Quick Search */}
              <div className="mobile-drawer-search">
                <button 
                  type="button"
                  className="btn-search-trigger"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 1rem' }}
                  onClick={() => { setMobileMenuOpen(false); onOpenSearch?.(); }}
                >
                  <Search size={16} />
                  <span>Search All Dispatches & Tickers...</span>
                </button>
              </div>

              {/* Drawer Content Scrollable Area */}
              <div className="mobile-drawer-content">
                
                {/* Desks Navigation */}
                <div className="mobile-drawer-section">
                  <span className="mobile-drawer-section-title">Intelligence Desks</span>
                  <div className="mobile-drawer-links">
                    <button 
                      type="button"
                      className={`mobile-nav-link ${currentPage === 'home' && selectedCategory === 'all' ? 'active' : ''}`}
                      onClick={() => handleNavClick('home', 'all')}
                    >
                      <Globe size={16} color="var(--accent-gold)" />
                      <span>Home Wire (All Bureaus)</span>
                      <ChevronRight size={14} className="chevron" />
                    </button>

                    <button 
                      type="button"
                      className={`mobile-nav-link ${currentPage === 'home' && selectedCategory === 'Markets & Finance' ? 'active' : ''}`}
                      onClick={() => handleNavClick('home', 'Markets & Finance')}
                    >
                      <TrendingUp size={16} color="var(--accent-gold)" />
                      <span>Markets & Sovereign Debt</span>
                      <ChevronRight size={14} className="chevron" />
                    </button>

                    <button 
                      type="button"
                      className={`mobile-nav-link ${currentPage === 'home' && selectedCategory === 'Technology & AI' ? 'active' : ''}`}
                      onClick={() => handleNavClick('home', 'Technology & AI')}
                    >
                      <Cpu size={16} color="var(--accent-gold)" />
                      <span>Semiconductors & AI</span>
                      <span className="nav-hot-badge">Hot</span>
                      <ChevronRight size={14} className="chevron" style={{ marginLeft: 'auto' }} />
                    </button>

                    <button 
                      type="button"
                      className={`mobile-nav-link ${currentPage === 'home' && selectedCategory === 'World Affairs' ? 'active' : ''}`}
                      onClick={() => handleNavClick('home', 'World Affairs')}
                    >
                      <Landmark size={16} color="var(--accent-gold)" />
                      <span>Geopolitics & Sovereignty</span>
                      <ChevronRight size={14} className="chevron" />
                    </button>

                    <button 
                      type="button"
                      className={`mobile-nav-link ${currentPage === 'home' && selectedCategory === 'Energy & Climate' ? 'active' : ''}`}
                      onClick={() => handleNavClick('home', 'Energy & Climate')}
                    >
                      <Flame size={16} color="var(--accent-gold)" />
                      <span>Commodities & Energy Transition</span>
                      <ChevronRight size={14} className="chevron" />
                    </button>

                    <button 
                      type="button"
                      className={`mobile-nav-link ${currentPage === 'home' && selectedCategory === 'Culture & Ideas' ? 'active' : ''}`}
                      onClick={() => handleNavClick('home', 'Culture & Ideas')}
                    >
                      <BookOpen size={16} color="var(--accent-gold)" />
                      <span>Culture & Macro-Philosophy</span>
                      <ChevronRight size={14} className="chevron" />
                    </button>

                    <button 
                      type="button"
                      className={`mobile-nav-link ${isToolsActive ? 'active' : ''}`}
                      onClick={() => handleNavClick('tools')}
                      style={{ background: 'rgba(180, 83, 9, 0.08)', border: '1px solid rgba(180, 83, 9, 0.25)' }}
                    >
                      <Calculator size={16} color="var(--accent-gold)" />
                      <span className="nav-tools-link">Financial Tools & Calculators</span>
                      <ChevronRight size={14} className="chevron" style={{ marginLeft: 'auto' }} />
                    </button>

                    <button 
                      type="button"
                      className={`mobile-nav-link ${isDocToolsActive ? 'active' : ''}`}
                      onClick={() => handleNavClick('doc-tools')}
                      style={{ background: 'rgba(180, 83, 9, 0.08)', border: '1px solid rgba(180, 83, 9, 0.25)', marginTop: '0.45rem' }}
                    >
                      <Sparkles size={16} color="var(--accent-gold)" />
                      <span className="nav-tools-link">PDF, Word & AI Image Studio</span>
                      <span className="nav-hot-badge">AI</span>
                      <ChevronRight size={14} className="chevron" style={{ marginLeft: 'auto' }} />
                    </button>
                  </div>
                </div>

                {/* Newsroom & Board */}
                <div className="mobile-drawer-section">
                  <span className="mobile-drawer-section-title">Newsroom & Whistleblower</span>
                  <div className="mobile-drawer-links">
                    {adminUser && (
                      <button 
                        type="button"
                        className={`mobile-nav-link ${currentPage === 'admin' ? 'active' : ''}`}
                        onClick={() => handleNavClick('admin')}
                        style={{ background: 'rgba(180, 83, 9, 0.08)', border: '1px solid rgba(180, 83, 9, 0.25)' }}
                      >
                        <ShieldCheck size={16} color="var(--accent-gold)" />
                        <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>Managing Desk (Admin)</span>
                        <ChevronRight size={14} className="chevron" style={{ marginLeft: 'auto' }} />
                      </button>
                    )}

                    <button 
                      type="button"
                      className="mobile-nav-link" 
                      onClick={() => handleNavClick('about')}
                    >
                      <Shield size={16} color="var(--accent-gold)" />
                      <span>About BullMonk & Global Bureaus</span>
                      <ChevronRight size={14} className="chevron" />
                    </button>

                    <button 
                      type="button"
                      className="mobile-nav-link" 
                      onClick={() => handleNavClick('contact')}
                    >
                      <Lock size={16} color="var(--accent-red)" />
                      <span>Zero-Knowledge Tip Line</span>
                      <ChevronRight size={14} className="chevron" />
                    </button>
                  </div>
                </div>

                {/* Dedicated Legal Suite Directory */}
                <div className="mobile-drawer-section">
                  <span className="mobile-drawer-section-title">Compliance & Legal Suite</span>
                  <div className="mobile-drawer-links">
                    <button 
                      type="button"
                      className="mobile-nav-link" 
                      onClick={() => handleNavClick('privacy')}
                    >
                      <Lock size={15} color="var(--accent-gold)" />
                      <span>Privacy Policy (AdSense & GDPR)</span>
                      <ChevronRight size={14} className="chevron" />
                    </button>

                    <button 
                      type="button"
                      className="mobile-nav-link" 
                      onClick={() => handleNavClick('disclaimer')}
                    >
                      <DollarSign size={15} color="var(--accent-gold)" />
                      <span>Financial & YMYL Disclaimer</span>
                      <ChevronRight size={14} className="chevron" />
                    </button>

                    <button 
                      type="button"
                      className="mobile-nav-link" 
                      onClick={() => handleNavClick('terms')}
                    >
                      <FileText size={15} color="var(--accent-gold)" />
                      <span>Terms of Service & Syndication</span>
                      <ChevronRight size={14} className="chevron" />
                    </button>

                    <button 
                      type="button"
                      className="mobile-nav-link" 
                      onClick={() => handleNavClick('editorial')}
                    >
                      <BookOpen size={15} color="var(--accent-gold)" />
                      <span>Editorial Standards & Ethics</span>
                      <ChevronRight size={14} className="chevron" />
                    </button>

                    <button 
                      type="button"
                      className="mobile-nav-link" 
                      onClick={() => handleNavClick('cookies')}
                    >
                      <Cookie size={15} color="var(--accent-gold)" />
                      <span>Cookie Telemetry Manager</span>
                      <ChevronRight size={14} className="chevron" />
                    </button>

                    <button 
                      type="button"
                      className="mobile-nav-link" 
                      onClick={() => handleNavClick('corrections')}
                    >
                      <AlertCircle size={15} color="var(--accent-gold)" />
                      <span>Corrections & Errata Protocol</span>
                      <ChevronRight size={14} className="chevron" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="mobile-drawer-footer">
                <button 
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1rem' }}
                  onClick={() => handleNavClick('contact')}
                >
                  <Lock size={15} />
                  <span>Submit Secure Whistleblower Tip</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Theme: {theme === 'dark' ? 'Night Terminal' : 'Prestige Paper'}</span>
                  <button 
                    type="button"
                    onClick={toggleTheme}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Switch Theme ⇄
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </header>
    </>
  );
};
