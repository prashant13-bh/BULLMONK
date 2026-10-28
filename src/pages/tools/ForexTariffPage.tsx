import React from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AdBanner } from '../../components/AdBanner';
import { TradingViewBanner } from '../../components/TradingViewBanner';
import { ForexTariffPassThroughCalculator } from '../../components/tools/ForexTariffPassThroughCalculator';
import { ToolsNavigationGrid } from '../../components/tools/ToolsNavigationGrid';
import { Globe, ShieldAlert, ShieldCheck } from 'lucide-react';
import { PageView } from '../../types';

interface ForexTariffPageProps {
  setCurrentPage: (page: PageView) => void;
  showToast: (msg: string) => void;
}

export const ForexTariffPage: React.FC<ForexTariffPageProps> = ({ setCurrentPage, showToast }) => {
  return (
    <main className="container" style={{ paddingBottom: '5rem', minHeight: '80vh' }}>
      <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
        <Breadcrumbs 
          items={[
            { label: 'Intelligence Desks', onClick: () => setCurrentPage('home') },
            { label: 'Quantitative Suite', onClick: () => { window.location.hash = '#tools'; setCurrentPage('tools'); } },
            { label: 'Forex Tariff & Pass-Through', active: true }
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
            <Globe size={13} /> Sovereign Macro & International Trade
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            <ShieldCheck size={14} color="var(--accent-green)" /> IMF & BIS ERPT Elasticity Standards
          </span>
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-brand)', 
          fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', 
          letterSpacing: '-0.02em', 
          lineHeight: '1.15',
          marginBottom: '0.85rem'
        }}>
          Forex Tariff & Currency Pass-Through Arbitrage Engine
        </h1>

        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)', 
          maxWidth: '820px', 
          lineHeight: '1.6',
          margin: 0
        }}>
          Model custom tariff assessments, foreign currency depreciation buffers, exchange rate pass-through elasticity (ERPT), exporter margin concessions, and domestic reshoring price parity thresholds across global supply chains.
        </p>
      </header>

      <div className="hide-on-mobile" style={{ marginBottom: '2rem' }}>
        <AdBanner slotType="leaderboard" slotId="tools-tariff-top" />
      </div>

      {/* Main Calculation Engine */}
      <ForexTariffPassThroughCalculator showToast={showToast} />

      {/* TradingView Institutional Chart */}
      <TradingViewBanner variant="full" />

      {/* Cross-Tool Navigation Grid */}
      <ToolsNavigationGrid currentTool="tool-forex-tariff" setCurrentPage={setCurrentPage} />

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
          <ShieldAlert size={15} color="var(--accent-gold)" /> Institutional Trade Policy Disclosures
        </div>
        <p style={{ margin: 0 }}>
          Tariff and currency pass-through elasticity calculations are based on macroeconomic trade literature and empirical customs clearance schedules. Statutory customs classifications (HTS codes) and retaliatory sanctions regimes vary across jurisdictions. Consult a licensed customs broker or international trade counsel before finalizing cross-border procurement agreements.
        </p>
      </div>
    </main>
  );
};
