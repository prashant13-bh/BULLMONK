import React from 'react';
import { PageView } from '../types';
import { Shield, Lock, Globe2 } from 'lucide-react';

interface AboutPageProps {
  setCurrentPage: (page: PageView) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentPage }) => {
  const bureaus = [
    {
      flag: '🇨🇭',
      city: 'Zurich',
      focus: 'Macroeconomics & Sovereign Wealth',
      address: 'Bleicherweg 24, Enge Financial Quarter, 8002 Zürich, Switzerland',
      email: 'zurich.desk@bullmonk.intelligence'
    },
    {
      flag: '🇬🇧',
      city: 'London',
      focus: 'Maritime Logistics & Energy Transition',
      address: '30 St Mary Axe, City of London, EC3A 8EP London, United Kingdom',
      email: 'london.desk@bullmonk.intelligence'
    },
    {
      flag: '🇯🇵',
      city: 'Tokyo',
      focus: 'Semiconductors & Asia-Pacific Tech',
      address: 'Marunouchi Park Building, Chiyoda-ku, Tokyo 100-8088, Japan',
      email: 'tokyo.desk@bullmonk.intelligence'
    },
    {
      flag: '🇸🇬',
      city: 'Singapore',
      focus: 'ASEAN Trade & Cross-Border FinTech',
      address: 'Marina Bay Financial Centre Tower 2, Singapore 018983',
      email: 'singapore.desk@bullmonk.intelligence'
    },
    {
      flag: '🇦🇪',
      city: 'Dubai',
      focus: 'Petrodollar & Gulf Infrastructure',
      address: 'DIFC Gate Precinct 4, Level 7, Dubai, United Arab Emirates',
      email: 'dubai.desk@bullmonk.intelligence'
    },
    {
      flag: '🇺🇸',
      city: 'New York',
      focus: 'Central Banks & Capital Markets',
      address: 'One World Trade Center, Suite 7400, New York, NY 10007, USA',
      email: 'ny.desk@bullmonk.intelligence'
    }
  ];

  const leaders = [
    {
      name: 'Marcus Vance',
      role: 'Editor-in-Chief & Macro Chief',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      bio: 'Former BIS senior research fellow and veteran financial correspondent with 22 years tracking sovereign liquidity.'
    },
    {
      name: 'Helena Lindqvist',
      role: 'Maritime & Energy Bureau Chief',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      bio: 'Leading maritime investigator specializing in polar shipping corridors, seabed treaties, and LNG trade flows.'
    },
    {
      name: 'Siddharth Rao',
      role: 'Lead Technology & AI Analyst',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      bio: 'Specialist in lithography, photonic computation, and rare earth supply chains across East Asia and the West.'
    },
    {
      name: 'Amara Okonjo',
      role: 'Geopolitics & Sovereignty Director',
      img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80',
      bio: 'Former multilateral policy advisor researching sovereign AI initiatives, BRICS expansion, and critical minerals.'
    }
  ];

  return (
    <main className="container" style={{ margin: '3rem auto 6rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span style={{ fontFamily: 'var(--font-brand)', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--accent-gold)' }}>
          The Bull & The Monk
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: '0.5rem 0 0.8rem' }}>
          Disciplined Truth in a Volatile World
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto' }}>
          We bridge the ferocious momentum of global markets with the contemplative, monastic rigor of investigative truth.
        </p>
      </div>

      {/* Manifesto Card */}
      <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'clamp(1.75rem, 4vw, 3rem)', marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1.25rem' }}>
          Our Founding Philosophy
        </h2>
        <div style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '1.25rem' }}>
            In an era dominated by instantaneous algorithmic churn, sensationalist click-aggregators, and opaque corporate public relations, the global public is starved of genuine, foundational context. Traditional journalism often falters between two extremes: breathless financial hot-takes on one side, and lethargic academic reports months after the fact on the other.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            <strong>BULLMONK was established to synthesize these twin forces:</strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', margin: '2rem 0' }}>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.75rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-gold)' }}>
              <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.2rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>THE BULL</h3>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Represents raw market momentum, technological acceleration, sovereign resource competition, and the relentless animal spirits that shape international trade, debt cycles, and balance sheets.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.75rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-blue)' }}>
              <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.2rem', color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>THE MONK</h3>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Represents ascetic discipline, patient forensic verification, ethical stillness, and the unwavering refusal to publish hearsay or surrender editorial sovereignty to commercial expediency.
              </p>
            </div>
          </div>

          <p>
            Together, BullMonk delivers high-conviction, mathematically verified reporting that empowers sovereign leaders, institutional allocators, and intellectually curious citizens around the globe.
          </p>
        </div>
      </section>

      {/* Global Bureaus Grid */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ borderBottom: '2px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.35rem', fontWeight: 800 }}>
            International Newsroom Bureaus
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>6 CONTINENTAL HUBS</span>
        </div>

        <div className="bureau-grid">
          {bureaus.map((b, idx) => (
            <div key={idx} className="aside-panel" style={{ padding: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-brand)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                {b.flag} {b.city}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                {b.focus}
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                {b.address}
              </p>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {b.email}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Leadership */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ borderBottom: '2px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.35rem', fontWeight: 800 }}>
            Editorial Board & Standards Council
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Investigative Leadership</span>
        </div>

        <div className="team-grid">
          {leaders.map((lead, idx) => (
            <div key={idx} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={lead.img} alt={lead.name} style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)', marginBottom: '1rem' }} />
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', margin: '0 0 0.3rem' }}>{lead.name}</h4>
              <div style={{ fontSize: '0.76rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '0.6rem' }}>{lead.role}</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{lead.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional CTA */}
      <section style={{ 
        background: 'radial-gradient(circle at top right, rgba(234, 179, 8, 0.15) 0%, rgba(14, 22, 38, 0.95) 70%)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.75rem' }}>
          Have Global Intelligence or Market Research?
        </h3>
        <p style={{ color: '#CBD5E1', maxWidth: '600px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
          We invite guest columns, economic whitepapers, and field dispatches from analysts and verified correspondents worldwide.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setCurrentPage('home')}>
            <Globe2 size={15} /> Explore Global Wire
          </button>
          <button className="btn btn-secondary" onClick={() => setCurrentPage('contact')}>
            <Lock size={15} /> Submit Encrypted Tip
          </button>
        </div>
      </section>
    </main>
  );
};
