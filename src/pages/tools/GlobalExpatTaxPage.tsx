import React from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AdBanner } from '../../components/AdBanner';
import { TradingViewBanner } from '../../components/TradingViewBanner';
import { GlobalExpatTaxEngine } from '../../components/tools/GlobalExpatTaxEngine';
import { ToolsNavigationGrid } from '../../components/tools/ToolsNavigationGrid';
import { Globe, ShieldAlert, ShieldCheck } from 'lucide-react';
import { PageView } from '../../types';

interface GlobalExpatTaxPageProps {
  setCurrentPage: (page: PageView) => void;
  showToast: (msg: string) => void;
}

export const GlobalExpatTaxPage: React.FC<GlobalExpatTaxPageProps> = ({ setCurrentPage, showToast }) => {
  return (
    <main className="container" style={{ paddingBottom: '5rem', minHeight: '80vh' }}>
      <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
        <Breadcrumbs 
          items={[
            { label: 'Intelligence Desks', onClick: () => setCurrentPage('home') },
            { label: 'Quantitative Suite', onClick: () => { window.location.hash = '#tools'; setCurrentPage('tools'); } },
            { label: 'Global Expat & Cross-Border Tax', active: true }
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
            <Globe size={13} /> Global Mobility & Cross-Border Wealth
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            <ShieldCheck size={14} color="var(--accent-green)" /> OECD & Statutory 2025/2026 Brackets
          </span>
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-brand)', 
          fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', 
          letterSpacing: '-0.02em', 
          lineHeight: '1.15',
          marginBottom: '0.85rem'
        }}>
          Global Expat & Cross-Border Take-Home Pay Terminal
        </h1>

        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)', 
          maxWidth: '820px', 
          lineHeight: '1.6',
          margin: 0
        }}>
          Institutional compensation and purchasing power parity modeling across the United States, Australia, Canada, United Kingdom, Germany, and Switzerland. Calculate exact net take-home cash flow, statutory pension deductions, and cost-of-living parity benchmarks.
        </p>
      </header>

      <div className="hide-on-mobile" style={{ marginBottom: '2rem' }}>
        <AdBanner slotType="leaderboard" slotId="tools-expat-tax-top" />
      </div>

      {/* Main Calculation Engine */}
      <GlobalExpatTaxEngine showToast={showToast} />

      {/* TradingView Institutional Chart */}
      <TradingViewBanner variant="full" />

      {/* Cross-Tool Navigation Grid */}
      <ToolsNavigationGrid currentTool="tool-global-tax" setCurrentPage={setCurrentPage} />

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
          <ShieldAlert size={15} color="var(--accent-gold)" /> Cross-Border Statutory Tax Disclosures
        </div>
        <p style={{ margin: 0 }}>
          Statutory tax rate calculations and cost-of-living parity indices are modeled based on published 2025/2026 revenue agency tax tables (IRS, CRA, ATO, HMRC, BMF, and ESTV). Individual tax liabilities vary based on residency classification, bilateral double-taxation treaties (DTA), foreign earned income exclusions (FEIE), and local municipal levies. This tool is provided solely for financial journalism and analytical research. Always consult a licensed international tax attorney or chartered accountant before executing cross-border relocations or filing statutory tax returns.
        </p>
      </div>
    </main>
  );
};
