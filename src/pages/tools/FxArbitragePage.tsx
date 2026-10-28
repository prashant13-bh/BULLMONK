import React from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AdBanner } from '../../components/AdBanner';
import { TradingViewBanner } from '../../components/TradingViewBanner';
import { FxArbitrageEngine } from '../../components/tools/FxArbitrageEngine';
import { ToolsNavigationGrid } from '../../components/tools/ToolsNavigationGrid';
import { Globe, ShieldAlert, ShieldCheck } from 'lucide-react';
import { PageView } from '../../types';

interface FxArbitragePageProps {
  setCurrentPage: (page: PageView) => void;
  showToast: (msg: string) => void;
}

export const FxArbitragePage: React.FC<FxArbitragePageProps> = ({ setCurrentPage, showToast }) => {
  return (
    <main className="container" style={{ paddingBottom: '5rem', minHeight: '80vh' }}>
      <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
        <Breadcrumbs 
          items={[
            { label: 'Intelligence Desks', onClick: () => setCurrentPage('home') },
            { label: 'Quantitative Suite', onClick: () => { window.location.hash = '#tools'; setCurrentPage('tools'); } },
            { label: 'FX Arbitrage & PPP Matrix', active: true }
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
            <Globe size={13} /> Foreign Exchange Quantitative Terminal
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            <ShieldCheck size={14} color="var(--accent-green)" /> OECD & BIS Parity Benchmarks
          </span>
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-brand)', 
          fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', 
          letterSpacing: '-0.02em', 
          lineHeight: '1.15',
          marginBottom: '0.85rem'
        }}>
          Global FX Arbitrage & Purchasing Power Parity Matrix
        </h1>

        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)', 
          maxWidth: '820px', 
          lineHeight: '1.6',
          margin: 0
        }}>
          Comprehensive currency intelligence terminal analyzing spot foreign exchange cross-rates, Purchasing Power Parity (PPP) valuation mispricings, central bank real policy rate spreads, and carry trade yield differentials across G10 and emerging market currencies.
        </p>
      </header>

      <div className="hide-on-mobile" style={{ marginBottom: '2rem' }}>
        <AdBanner slotType="leaderboard" slotId="tools-fx-top" />
      </div>

      {/* Main Calculation Engine */}
      <FxArbitrageEngine showToast={showToast} />

      {/* TradingView Institutional Chart */}
      <TradingViewBanner variant="full" />

      {/* Cross-Tool Navigation Grid */}
      <ToolsNavigationGrid currentTool="tool-fx" setCurrentPage={setCurrentPage} />

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
          Foreign exchange spot rates, PPP models, and carry trade spreads are displayed strictly for journalistic and analytical reference. Foreign exchange markets carry substantial volatility and leverage risks. Past currency valuation cycles do not guarantee sovereign exchange rate stability or peg adherence. BULLMONK does not execute foreign exchange trades or hold client custody.
        </p>
      </div>
    </main>
  );
};
