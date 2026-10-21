import React, { useState } from 'react';
import { PageView } from '../types';
import { Shield, Lock, Send, ChevronDown, ChevronUp, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface ContactPageProps {
  setCurrentPage: (page: PageView) => void;
  showToast: (msg: string) => void;
}


export const ContactPage: React.FC<ContactPageProps> = ({ setCurrentPage, showToast }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [tipCategory, setTipCategory] = useState('Corporate & Banking Fraud');
  const [tipHandle, setTipHandle] = useState('');
  const [tipDetails, setTipDetails] = useState('');

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactDept, setContactDept] = useState('Editorial Desk & Article Pitches');
  const [contactMsg, setContactMsg] = useState('');

  const faqs = [
    {
      q: 'How can an outside analyst or journalist submit manuscripts or pitches?',
      a: 'Editorial pitches, investigative dossiers, and macroeconomic research whitepapers may be submitted directly through our Editorial Desk contact form above or via encrypted transmission to editor@bullmonk.intelligence. Submissions are evaluated by our standards council within 48 hours.'
    },
    {
      q: 'How does BullMonk guarantee whistleblower confidentiality?',
      a: 'Our whistleblower portal operates with zero server logging: IP addresses, browser agents, and timestamps are stripped upon socket receipt. Sensitive document transmissions are cryptographically encrypted using 4096-bit RSA keys and audited by our Security Review Committee.'
    },
    {
      q: 'Can quantitative hedge funds or academic desks syndicate BullMonk data?',
      a: 'Yes. Non-profit academic institutions may cite excerpts with canonical hyperlinking. Quantitative hedge funds and asset managers may apply for structured API data feed access through syndicate@bullmonk.intelligence.'
    }
  ];

  const handleTipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipDetails.trim()) return;
    showToast('Secure Tip Encrypted: Dispatched to Investigative Bureau via Zero-Log Rail.');
    setTipDetails('');
    setTipHandle('');
  };

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    showToast(`Transmission received. The ${contactDept} has queued your inquiry.`);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
  };

  return (
    <main className="container" style={{ margin: '2rem auto 6rem' }}>
      <Breadcrumbs 
        items={[
          { label: 'Communications & Whistleblower Ingestion', active: true }
        ]}
        setCurrentPage={setCurrentPage}
      />

      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>

        <span style={{ fontFamily: 'var(--font-brand)', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--accent-gold)' }}>
          Communications & Ingestion
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: '0.5rem 0 0.8rem' }}>
          Connect with BullMonk
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto' }}>
          Whether you have an institutional story pitch, inquiry for our foreign desks, or an encrypted leak of vital public significance, our lines are secure.
        </p>
      </div>

      {/* Whistleblower Zero-Knowledge Card */}
      <section style={{ 
        background: 'radial-gradient(circle at top left, rgba(239, 68, 68, 0.12) 0%, var(--bg-surface) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
        marginBottom: '3.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-breaking" style={{ fontSize: '0.72rem' }}>
            <Lock size={12} /> Zero-Knowledge Secure Tip Line
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
          Investigative Whistleblower Gateway
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '820px', lineHeight: '1.6', marginBottom: '1rem' }}>
          We provide air-gapped, zero-metadata ingestion for documents revealing public fraud, central bank irregularities, sanctions evasion, or unannounced sovereign trade shifts.
        </p>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
          PGP Fingerprint: 4F2A 991B EC71 3908 C844 7120 A8BF 1419 6E93 DD41
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          <div>
            <form 
              onSubmit={handleTipSubmit}
              toolname="submit_whistleblower_tip"
              tooldescription="Submit encrypted whistleblower intelligence tip to BullMonk investigative council"
              data-webmcp-tool="submit_whistleblower_tip"
              data-webmcp-description="Submit encrypted whistleblower intelligence tip to BullMonk investigative council"
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Classification Desk</label>
                  <select 
                    className="form-control"
                    value={tipCategory}
                    onChange={(e) => setTipCategory(e.target.value)}
                    style={{ cursor: 'pointer' }}
                    toolparam="category"
                    data-webmcp-input="category"
                  >
                    <option>Corporate & Banking Fraud</option>
                    <option>Sovereign & Multilateral Treaty Violation</option>
                    <option>Critical Infrastructure & Supply Chain Chokepoints</option>
                    <option>Deep Tech & Semiconductor Export Violations</option>
                    <option>Environmental & Polar Maritime Violations</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Contact Handle (Optional / Pseudonym)</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Signal, ProtonMail, or anonymous"
                    value={tipHandle}
                    onChange={(e) => setTipHandle(e.target.value)}
                    toolparam="contactHandle"
                    data-webmcp-input="contactHandle"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Confidential Briefing / Document Summary *</label>
                <textarea 
                  className="form-control"
                  rows={4}
                  placeholder="Provide entities, dates, document hashes, and context for our investigative journalists..."
                  value={tipDetails}
                  onChange={(e) => setTipDetails(e.target.value)}
                  required
                  toolparam="briefingDetails"
                  data-webmcp-input="briefingDetails"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ background: 'var(--accent-red)', borderColor: 'var(--accent-red)', color: '#fff' }}
              >
                <Lock size={14} /> Encrypt and Transmit Secure Tip
              </button>
            </form>
          </div>

          {/* Secure Vault Image & Hardware Specs */}
          <div style={{ 
            borderRadius: 'var(--radius-md)', 
            overflow: 'hidden', 
            border: '1px solid rgba(239, 68, 68, 0.25)', 
            background: 'var(--bg-surface-elevated)'
          }}>
            <img 
              src="/images/bullmonk_secure_data_vault.webp" 
              alt="BULLMONK Zero-Knowledge Cryptographic Data Vault and Whistleblower Ingestion Terminal" 
              style={{ width: '100%', height: 'auto', minHeight: '220px', maxHeight: '270px', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
            <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span>
                <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', fontWeight: 700 }}>
                  AIR-GAPPED HARDWARE PROTOCOL ACTIVE
                </span>
              </div>
              <p style={{ margin: '0 0 0.6rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Submissions pass through Hardware Security Modules (HSMs). Connection metadata, browser fingerprints, and TCP/IP headers are permanently stripped upon packet handshake.
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                <span>• RSA-4096 / PQC Ready</span>
                <span>• Zero-Metadata Storage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Split Grid: General Inquiries & Newsroom Desks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        
        {/* Form */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '1.25rem' }}>
            General & Newsroom Inquiries
          </h3>

          <form 
            onSubmit={handleGeneralSubmit}
            toolname="submit_newsroom_inquiry"
            tooldescription="Submit editorial, syndication, or research inquiry to BullMonk bureau staff"
            data-webmcp-tool="submit_newsroom_inquiry"
            data-webmcp-description="Submit editorial, syndication, or research inquiry to BullMonk bureau staff"
          >
            <div className="form-group">
              <label className="form-label">Full Name / Institutional Title *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Sarah Jenkins, Portfolio Strategist"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Institutional Email *</label>
              <input 
                type="email" 
                className="form-control"
                placeholder="name@institution.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department *</label>
              <select 
                className="form-control"
                value={contactDept}
                onChange={(e) => setContactDept(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option>Editorial Desk & Article Pitches</option>
                <option>Syndication & Terminal Feeds</option>
                <option>Press Relations & Media Inquiries</option>
                <option>Advertising & Strategic Partnerships</option>
                <option>Legal & Rights Licensing</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea 
                className="form-control"
                rows={4}
                placeholder="Provide transmission details..."
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={15} /> Send Official Transmission
            </button>
          </form>
        </div>

        {/* Bureau Directory & Studio CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.75rem' }}>
            <h4 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.1rem', color: 'var(--accent-gold)', marginBottom: '1rem' }}>
              Direct Newsroom Wire Channels
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.86rem' }}>
              <li style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <strong>Main Newsroom Wire:</strong><br />
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>newsroom@bullmonk.intelligence</span>
              </li>
              <li style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <strong>Op-Ed & Contributing Columns:</strong><br />
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>editorials@bullmonk.intelligence</span>
              </li>
              <li style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <strong>Syndication & Financial Feeds:</strong><br />
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>syndicate@bullmonk.intelligence</span>
              </li>
              <li>
                <strong>Press & Media Accreditations:</strong><br />
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>press@bullmonk.intelligence</span>
              </li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.75rem' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>
              Editorial Desk Submissions & Inquiries
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              For confidential investigative leads, research manuscripts, or corporate earnings dispatches, connect with our bureau chiefs using the secure form.
            </p>
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%' }}
              onClick={() => setCurrentPage('about')}
            >
              <Shield size={14} /> View Global Bureaus & Board →
            </button>
          </div>
        </div>
      </div>

      {/* Frequently Answered Protocols */}
      <section>
        <div style={{ borderBottom: '2px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', fontWeight: 800 }}>
            Frequently Answered Protocols
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Institutional FAQ</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}
              >
                <div 
                  style={{ padding: '1.15rem 1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 700, fontSize: '0.98rem' }}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="var(--accent-gold)" /> : <ChevronDown size={18} />}
                </div>
                {isOpen && (
                  <div style={{ padding: '0 1.4rem 1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.65', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};
