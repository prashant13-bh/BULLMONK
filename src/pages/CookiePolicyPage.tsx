import React, { useState, useEffect } from 'react';
import { PageView } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LegalNav } from '../components/LegalNav';
import { Cookie, Shield, Check, ExternalLink, ArrowRight, Save } from 'lucide-react';

interface CookiePolicyPageProps {
  setCurrentPage: (page: PageView) => void;
  showToast?: (msg: string) => void;
}

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({ setCurrentPage, showToast }) => {
  const [adCookies, setAdCookies] = useState(true);
  const [analyticsCookies, setAnalyticsCookies] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const savedAd = localStorage.getItem('BULLMONK_COOKIE_ADS');
    const savedAna = localStorage.getItem('BULLMONK_COOKIE_ANA');
    if (savedAd !== null) setAdCookies(savedAd === 'true');
    if (savedAna !== null) setAnalyticsCookies(savedAna === 'true');
  }, []);

  const handleSavePreferences = () => {
    localStorage.setItem('BULLMONK_COOKIE_ADS', String(adCookies));
    localStorage.setItem('BULLMONK_COOKIE_ANA', String(analyticsCookies));
    setSavedSuccess(true);
    if (showToast) {
      showToast('Cookie preferences updated & recorded successfully.');
    }
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <main className="container" style={{ margin: '2rem auto 5rem', maxWidth: '1040px' }}>
      {/* 1. Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Legal & Governance Suite', page: 'legal' },
          { label: 'Cookie Telemetry & Consent Framework', active: true }
        ]}
        setCurrentPage={setCurrentPage}
      />

      {/* 2. Legal Sub-Nav */}
      <LegalNav currentPage="cookies" setCurrentPage={setCurrentPage} />

      {/* 3. Header */}
      <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span className="region-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Cookie size={12} /> Interactive Consent Architecture
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Document Ref: BM-COOKIE-2026.02 • Privacy Sandbox Ready
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, margin: '0.5rem 0 1rem', lineHeight: 1.2 }}>
          Cookie Telemetry & Client-Side Storage Policy
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: '1.7', maxWidth: '820px' }}>
          This policy discloses how <strong>BULLMONK Intelligence Group Ltd.</strong> employs HTTP cookies, LocalStorage objects, and third-party advertising telemetry in full compliance with the EU ePrivacy Directive, GDPR, and Google AdSense partner guidelines.
        </p>
      </header>

      {/* 4. Interactive Preference Control Center */}
      <section 
        aria-label="Interactive Cookie Preferences" 
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-active)',
          borderRadius: 'var(--radius-md)',
          padding: 'clamp(1.5rem, 3vw, 2.25rem)',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-gold)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
              Client-Side Sovereignty
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: '0.2rem 0 0' }}>
              Interactive Cookie & Telemetry Manager
            </h2>
          </div>

          <button 
            type="button"
            className="btn btn-primary"
            onClick={handleSavePreferences}
            style={{ fontSize: '0.84rem', padding: '0.55rem 1.25rem', gap: '0.45rem' }}
          >
            {savedSuccess ? <Check size={16} /> : <Save size={16} />}
            <span>{savedSuccess ? 'Preferences Saved!' : 'Save Preferences'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Essential */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', background: 'var(--bg-surface-elevated)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>1. Strictly Essential Platform Cookies</strong>
                <span className="region-pill" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>Always Active</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Mandatory for site security, theme preference (Prestige Paper vs Night Terminal), LocalStorage reading dossier, and page navigation. Cannot be disabled without breaking site operation.
              </p>
            </div>
            <input type="checkbox" checked disabled style={{ width: '20px', height: '20px', accentColor: 'var(--accent-gold)', marginTop: '4px' }} />
          </div>

          {/* AdSense */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', background: 'var(--bg-surface-elevated)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>2. Google AdSense & Commercial Advertising Cookies</strong>
                <span className="region-pill" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}>Personalization</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Enables Google AdSense and its certified advertising network partners to serve relevant financial and technology advertisements based on your browsing interests. If toggled off, ads remain visible but will be generic.
              </p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={adCookies} 
                onChange={(e) => setAdCookies(e.target.checked)} 
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-gold)', marginTop: '4px', cursor: 'pointer' }} 
                aria-label="Toggle Google AdSense Cookies"
              />
            </label>
          </div>

          {/* Analytics */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', background: 'var(--bg-surface-elevated)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>3. Google Analytics (gtag.js) Performance Telemetry</strong>
                <span className="region-pill" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>Anonymized</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Collects aggregated, anonymized statistics on page load speeds, Core Web Vitals, and geographic bureau readership to assist our engineers in optimizing server responsiveness.
              </p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={analyticsCookies} 
                onChange={(e) => setAnalyticsCookies(e.target.checked)} 
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-gold)', marginTop: '4px', cursor: 'pointer' }} 
                aria-label="Toggle Google Analytics Telemetry"
              />
            </label>
          </div>
        </div>
      </section>

      {/* 5. Main Content Body */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '3rem', alignItems: 'start' }} className="legal-layout-grid">
        
        {/* Left Column: Full Articles */}
        <article style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'clamp(1.5rem, 3.5vw, 2.75rem)', lineHeight: '1.8' }}>
          
          {/* Section 1 */}
          <section id="table-of-cookies" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>01</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Comprehensive Telemetry Audit & Inventory
              </h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Below is the comprehensive technical audit of cookies and storage keys utilized on BullMonk:
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-medium)', background: 'var(--bg-surface-elevated)' }}>
                    <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Cookie / Key</th>
                    <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Provider</th>
                    <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Purpose</th>
                    <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.65rem 0.75rem' }}><code>BULLMONK_REACT_THEME</code></td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>BullMonk First-Party</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>Stores light/dark theme preference</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>Persistent (Local)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.65rem 0.75rem' }}><code>BULLMONK_PRO_ARTICLES_V16</code></td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>BullMonk First-Party</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>Caches reading dossiers & bookmarks</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>Persistent (Local)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.65rem 0.75rem' }}><code>__gads</code>, <code>__gpi</code></td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>Google AdSense</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>Ad delivery, frequency capping & fraud detection</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>13 Months</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.65rem 0.75rem' }}><code>_ga</code>, <code>_ga_*</code></td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>Google Analytics</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>Distinguishes unique anonymized sessions</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>2 Years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2 */}
          <section id="browser-controls" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>02</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Browser-Level Cookie Management & Erasure
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              In addition to our on-page interactive controls above, you can manage or purge cookies directly through your client browser settings:
            </p>

            <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Third-Party Cookies.</li>
              <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Block All Cookies.</li>
              <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy & Security &gt; Enhanced Tracking Protection.</li>
              <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and Site Permissions &gt; Manage and Delete Cookies.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="third-party-optouts">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>03</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                Industry-Wide Advertising Opt-Out Portals
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              To opt out of behavioral advertising across all participating global ad networks, visit:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline', fontWeight: 600 }}>
                • Google Ads Personalization Settings Portal <ExternalLink size={12} style={{ display: 'inline' }} />
              </a>
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline', fontWeight: 600 }}>
                • Digital Advertising Alliance (DAA) WebChoices Tool <ExternalLink size={12} style={{ display: 'inline' }} />
              </a>
              <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline', fontWeight: 600 }}>
                • European Interactive Digital Advertising Alliance (EDAA) <ExternalLink size={12} style={{ display: 'inline' }} />
              </a>
            </div>
          </section>

        </article>

        {/* Right Column: Companion Navigation */}
        <aside style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Table of contents */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
              In This Policy
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
              <a href="#table-of-cookies" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>01. Telemetry Audit Table</a>
              <a href="#browser-controls" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>02. Browser Level Controls</a>
              <a href="#third-party-optouts" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>03. Global Opt-Out Tools</a>
            </nav>
          </div>

          {/* Sibling Legal Documents */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
              Companion Documents
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem' }}>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setCurrentPage('privacy')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Privacy & AdSense Policy</span>
                <ArrowRight size={13} />
              </button>

              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setCurrentPage('terms')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Terms of Service</span>
                <ArrowRight size={13} />
              </button>

              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setCurrentPage('disclaimer')}
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
              >
                <span>Financial & YMYL Disclaimer</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </aside>

      </div>
    </main>
  );
};
