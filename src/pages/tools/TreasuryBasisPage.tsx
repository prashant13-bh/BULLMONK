import React from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AdBanner } from '../../components/AdBanner';
import { TradingViewBanner } from '../../components/TradingViewBanner';
import { TreasuryBasisArbitrage } from '../../components/tools/TreasuryBasisArbitrage';
import { ToolsNavigationGrid } from '../../components/tools/ToolsNavigationGrid';
import { GitCompare, ShieldAlert, ShieldCheck } from 'lucide-react';
import { PageView } from '../../types';

interface TreasuryBasisPageProps {
  setCurrentPage: (page: PageView) => void;
  showToast: (msg: string) => void;
}

export const TreasuryBasisPage: React.FC<TreasuryBasisPageProps> = ({ setCurrentPage, showToast }) => {
  return (
    <main className="container" style={{ paddingBottom: '5rem', minHeight: '80vh' }}>
      <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
        <Breadcrumbs 
          items={[
            { label: 'Intelligence Desks', onClick: () => setCurrentPage('home') },
            { label: 'Quantitative Suite', onClick: () => { window.location.hash = '#tools'; setCurrentPage('tools'); } },
            { label: 'Treasury Basis & Repo Arbitrage', active: true }
          ]}
        />
      </div>

      <header style={{ 
        background: 'var(--bg-surface)', 
        border: '1px solid var(--border-medium)', 
        borderRadius: 'var(--radius-lg)', 
        padding: 'clamp(1.5rem, 4vw, 2.75rem)',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge badge-category" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <GitCompare size={13} /> Fixed Income Relative Value Terminal
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            <ShieldCheck size={14} color="var(--accent-green)" /> CME Conversion Factor Architecture
          </span>
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-brand)', 
          fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', 
          letterSpacing: '-0.02em', 
          lineHeight: '1.15',
          marginBottom: '0.85rem'
        }}>
          Treasury Cash-Futures Basis & Reverse Repo Arbitrage Engine
        </h1>

        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)', 
          maxWidth: '820px', 
          lineHeight: '1.6',
          margin: 0
        }}>
          Institutional relative-value terminal modeling the Treasury cash-futures gross basis, net basis net of carry (BNOC), implied repo rate (IRR), and Secured Overnight Financing Rate (SOFR) spread arbitrage. Essential for sovereign debt desks, hedge fund basis traders, and primary dealers.
        </p>
      </header>

      <div className="hide-on-mobile" style={{ marginBottom: '2rem' }}>
        <AdBanner slotType="leaderboard" slotId="tools-basis-top" />
      </div>

      {/* Main Calculation Engine */}
      <TreasuryBasisArbitrage showToast={showToast} />

      {/* TradingView Institutional Chart */}
      <TradingViewBanner variant="full" />

      {/* Cross-Tool Navigation Grid */}
      <ToolsNavigationGrid currentTool="tool-repo-spread" setCurrentPage={setCurrentPage} />

      {/* Mandatory Regulatory & YMYL Disclaimer */}
      <div style={{ 
        marginTop: '3.5rem', 
        padding: '1.5rem', 
        borderRadius: 'var(--radius-md)', 
        background: 'var(--bg-surface-elevated)', 
        border: '1px solid var(--border-medium)',
        borderLeft: '4px solid var(--accent-gold)',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          <ShieldAlert size={15} color="var(--accent-gold)" /> Institutional Disclaimer & YMYL Mathematical Disclosures
        </div>
        <p style={{ margin: 0 }}>
          Treasury basis calculations and implied repo rates are intended exclusively for professional quantitative research and informational purposes. The cash-futures basis trade involves leverage, financing liquidity risk, and delivery delivery option uncertainties. BULLMONK does not execute fixed-income derivatives or provide investment advice.
        </p>
      </div>
    </main>
  );
};
