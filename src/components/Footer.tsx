import React, { useState } from 'react';
import { PageView } from '../types';
import { 
  Shield, Lock, Mail, ArrowRight, CheckCircle2, ChevronUp, 
  ExternalLink, Globe, Sparkles, Building2, Award, Landmark 
} from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
  setSelectedCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, setSelectedCategory }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const navigate = (page: PageView, cat?: string) => {
    setCurrentPage(page);
    if (cat) setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bureaus = [
    { city: 'Zurich', country: 'Switzerland', flag: '🇨🇭', desk: 'Macro & Sovereign Wealth' },
    { city: 'London', country: 'United Kingdom', flag: '🇬🇧', desk: 'Maritime & Energy' },
    { city: 'New York', country: 'United States', flag: '🇺🇸', desk: 'Treasury & Wall Street' },
    { city: 'Tokyo', country: 'Japan', flag: '🇯🇵', desk: 'Semis & Asia-Pacific' },
    { city: 'Singapore', country: 'Singapore', flag: '🇸🇬', desk: 'ASEAN & Cross-Border FX' },
    { city: 'Mumbai', country: 'India', flag: '🇮🇳', desk: 'Silicon Corridors & RBI' },
  ];

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">

        {/* 1. Executive Briefing Subscription Tier ("The Morning Monk") */}
        <section className="footer-newsletter-section" aria-label="Executive Intelligence Briefing">
          <div className="footer-newsletter-inner">
            <div className="footer-newsletter-content">
              <div className="footer-newsletter-badge">
                <Sparkles size={12} color="var(--accent-gold)" />
                <span>EXECUTIVE BRIEFING • 06:00 UTC</span>
              </div>
              <h3 className="footer-newsletter-title">
                The Morning Monk Dossier
              </h3>
              <p className="footer-newsletter-desc">
                Unfiltered macroeconomic forensics, sovereign debt flow tables, and geopolitical intelligence dispatched directly to institutional desks every morning. Zero automated fluff. 100% human investigative reporting.
              </p>
            </div>

            <div className="footer-newsletter-form-box">
              {subscribed ? (
                <div className="footer-newsletter-success">
                  <CheckCircle2 size={18} color="var(--accent-green)" />
                  <span>Subscription confirmed. Institutional dossier dispatch active.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                  <label htmlFor="footer-newsletter-input" className="sr-only">
                    Institutional Email Address
                  </label>
                  <input
                    id="footer-newsletter-input"
                    type="email"
                    required
                    placeholder="Enter institutional email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="footer-newsletter-input"
                  />
                  <button type="submit" className="btn btn-primary footer-newsletter-btn">
                    <span>Subscribe Wire</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
              <div className="footer-newsletter-privacy">
                <Lock size={11} color="var(--accent-gold)" />
                <span>Zero-tracking privacy shield. Full GDPR & Google AdSense compliance.</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Global Bureaus Network Grid */}
        <div className="footer-bureaus-grid">
          {bureaus.map((b) => (
            <div key={b.city} className="footer-bureau-pill">
              <span className="footer-bureau-flag">{b.flag}</span>
              <div className="footer-bureau-info">
                <span className="footer-bureau-city">{b.city}</span>
                <span className="footer-bureau-desk">{b.desk}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Main Multi-Column Institutional Directory */}
        <div className="footer-directory-grid">
          
          {/* Brand & Mission Column */}
          <div className="footer-col brand-col">
            <div className="footer-brand-header">
              <div className="brand-emblem" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>BM</div>
              <span className="footer-brand-text">BULLMONK</span>
            </div>
            <p className="footer-mission-statement">
              The premier international intelligence publication and investigative newsroom dedicated to macroeconomic forensic auditing, semiconductor diplomacy, sovereign capital flows, and geopolitical realism.
            </p>

            <div className="footer-brand-actions">
              <button 
                type="button"
                className="btn btn-secondary footer-action-btn"
                onClick={() => navigate('contact')}
                aria-label="Open Zero-Knowledge Tip Line"
              >
                <Lock size={13} color="var(--accent-gold)" />
                <span>Zero-Knowledge Tip Line</span>
              </button>

              <button 
                type="button"
                className="btn btn-secondary footer-action-btn"
                onClick={() => navigate('about')}
                aria-label="View Editorial Board & Bureaus"
              >
                <Building2 size={13} />
                <span>Global Bureaus</span>
              </button>
            </div>
          </div>

          {/* Intelligence Desks */}
          <div className="footer-col">
            <h3 className="footer-col-heading">Intelligence Desks</h3>
            <ul className="footer-nav-list">
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('home', 'Markets & Finance')}>
                  Global Macro & Sovereign Rates
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('home', 'Technology & AI')}>
                  Semiconductor Corridors & AI
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('home', 'World Affairs')}>
                  Geopolitics & Bilateral Treaties
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('home', 'Energy & Climate')}>
                  Energy Transition & Critical Minerals
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('home', 'Culture & Ideas')}>
                  Culture & Macroeconomic Philosophy
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn suite-hub-link" onClick={() => navigate('tools')}>
                  Quantitative Tools & Forensics →
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn suite-hub-link" onClick={() => navigate('doc-tools')}>
                  PDF, Word & AI Image Studio →
                </button>
              </li>
            </ul>
          </div>

          {/* Newsroom & Board */}
          <div className="footer-col">
            <h3 className="footer-col-heading">Newsroom & Board</h3>
            <ul className="footer-nav-list">
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('about')}>
                  About BullMonk Newsroom
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('about')}>
                  Editorial Board & Bureau Chiefs
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('contact')}>
                  Press Contacts & Syndication Desk
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('contact')}>
                  Whistleblower PGP Gateway
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('editorial')}>
                  Newsroom Code of Honor
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('corrections')}>
                  Corrections & Public Errata Log
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Dedicated Legal Suite */}
          <div className="footer-col">
            <h3 className="footer-col-heading">Governance & Legal</h3>
            <ul className="footer-nav-list">
              <li>
                <button type="button" className="footer-link-btn legal-highlight" onClick={() => navigate('disclaimer')}>
                  Financial & YMYL Disclaimer
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('privacy')}>
                  Privacy Policy (AdSense & GDPR)
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('terms')}>
                  Terms of Service & Syndication
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('editorial')}>
                  Editorial Ethics & Independence
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('cookies')}>
                  Cookie Telemetry & Preferences
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => navigate('corrections')}>
                  Corrections Policy & Errata
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn suite-hub-link" onClick={() => navigate('legal')}>
                  All Compliance Charters →
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* 4. Bottom Regulatory Trust Bar & Copyright */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright-text">
            © 2026 <strong>BULLMONK Intelligence Group Ltd.</strong> All international rights reserved. Published across London, Zurich, and New York bureaus.
          </div>

          <div className="footer-trust-seals">
            <span className="footer-seal" title="Certified Publisher ID ca-pub-7155174810446636">
              <Shield size={12} color="var(--accent-gold)" />
              <span>Google AdSense Certified</span>
            </span>

            <span className="footer-seal" title="YMYL Financial Quality Standard">
              <Award size={12} color="var(--accent-green)" />
              <span>YMYL Compliant</span>
            </span>

            <span className="footer-seal" title="Cryptographic Zero-Knowledge Air-Gap">
              <Lock size={12} color="var(--accent-blue)" />
              <span>Air-Gapped Source Shield</span>
            </span>

            <button 
              type="button" 
              className="footer-back-to-top" 
              onClick={scrollToTop}
              aria-label="Back to top of page"
            >
              <span>Back to Top</span>
              <ChevronUp size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
