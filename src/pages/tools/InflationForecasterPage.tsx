import React from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AdBanner } from '../../components/AdBanner';
import { TradingViewBanner } from '../../components/TradingViewBanner';
import { InflationForecaster } from '../../components/tools/InflationForecaster';
import { ToolsNavigationGrid } from '../../components/tools/ToolsNavigationGrid';
import { TrendingUp, ShieldAlert, ShieldCheck } from 'lucide-react';
import { PageView } from '../../types';

interface InflationForecasterPageProps {
  setCurrentPage: (page: PageView) => void;
  showToast: (msg: string) => void;
}

export const InflationForecasterPage: React.FC<InflationForecasterPageProps> = ({ setCurrentPage, showToast }) => {
  return (
    <main className="container" style={{ paddingBottom: '5rem', minHeight: '80vh' }}>
      <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
        <Breadcrumbs 
          items={[
            { label: 'Intelligence Desks', onClick: () => setCurrentPage('home') },
            { label: 'Quantitative Suite', onClick: () => { window.location.hash = '#tools'; setCurrentPage('tools'); } },
            { label: 'Inflation Drag & Real Return', active: true }
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
            <TrendingUp size={13} /> Monetary Policy & Capital Preservation
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            <ShieldCheck size={14} color="var(--accent-green)" /> Fisher Equation Verified
          </span>
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-brand)', 
          fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', 
          letterSpacing: '-0.02em', 
          lineHeight: '1.15',
          marginBottom: '0.85rem'
        }}>
          Inflation Drag & Real Wealth Preservation Forecaster
        </h1>

        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)', 
          maxWidth: '820px', 
          lineHeight: '1.6',
          margin: 0
        }}>
          Measure the true purchasing power of capital reserves after statutory taxation and systemic monetary debasement. Model multi-decade nominal vs real returns using macroeconomic Fisher elasticity to insulate sovereign and family office portfolios against stagflationary shocks.
        </p>
      </header>

      <div className="hide-on-mobile" style={{ marginBottom: '2rem' }}>
        <AdBanner slotType="leaderboard" slotId="tools-inflation-top" />
      </div>

      {/* Main Calculation Engine */}
      <InflationForecaster showToast={showToast} />

      {/* TradingView Institutional Chart */}
      <TradingViewBanner variant="full" />

      {/* Cross-Tool Navigation Grid */}
      <ToolsNavigationGrid currentTool="tool-inflation" setCurrentPage={setCurrentPage} />

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
          Inflation calculations and real CAGR models are generated exclusively for educational and journalistic analysis. BULLMONK does not provide tax advice, investment management, or financial planning. Past CPI inflation rates or historical monetary debasement trends do not guarantee future central bank policy actions. Consult a certified financial planner (CFP) or tax professional.
        </p>
      </div>
    </main>
  );
};
