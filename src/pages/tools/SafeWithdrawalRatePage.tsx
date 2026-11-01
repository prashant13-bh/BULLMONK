import React from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AdBanner } from '../../components/AdBanner';
import { TradingViewBanner } from '../../components/TradingViewBanner';
import { SafeWithdrawalRateEngine } from '../../components/tools/SafeWithdrawalRateEngine';
import { ToolsNavigationGrid } from '../../components/tools/ToolsNavigationGrid';
import { Award, ShieldCheck, TrendingUp } from 'lucide-react';
import { PageView } from '../../types';

interface SafeWithdrawalRatePageProps {
  setCurrentPage: (page: PageView) => void;
  showToast: (msg: string) => void;
}

export const SafeWithdrawalRatePage: React.FC<SafeWithdrawalRatePageProps> = ({ setCurrentPage, showToast }) => {
  return (
    <main className="container" style={{ paddingBottom: '5rem', minHeight: '80vh' }}>
      <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
        <Breadcrumbs 
          items={[
            { label: 'Intelligence Desks', onClick: () => setCurrentPage('home') },
            { label: 'Quantitative Suite', onClick: () => { window.location.hash = '#tools'; setCurrentPage('tools'); } },
            { label: 'Safe Withdrawal Rate Terminal', active: true }
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
            <Award size={13} /> Actuarial Forensics &amp; Longevity Decumulation
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            <ShieldCheck size={14} color="var(--accent-green)" /> Bengen 1994 &amp; Guyton-Klinger Protocol
          </span>
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-brand)', 
          fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', 
          letterSpacing: '-0.02em', 
          lineHeight: '1.15',
          marginBottom: '0.85rem'
        }}>
          Safe Withdrawal Rate (SWR) &amp; Sequence of Returns Risk Simulator
        </h1>

        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)', 
          maxWidth: '840px', 
          lineHeight: '1.6',
          margin: 0
        }}>
          Stress-test retirement decumulation portfolios across historical stagflation crises, tech crashes, and modern higher-for-longer regimes. Compare the Bengen 4% Rule against Guyton-Klinger Dynamic Guardrails, Variable Percentage Withdrawal (VPW), and statutory RRIF/Super drawdown requirements.
        </p>
      </header>

      {/* Top Interactive TradingView Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <TradingViewBanner variant="full" />
      </div>

      {/* Main SWR Calculation Engine */}
      <SafeWithdrawalRateEngine showToast={showToast} />

      {/* Mid-Page Display Ad Unit */}
      <div style={{ marginTop: '3.5rem', marginBottom: '3.5rem' }}>
        <AdBanner 
          slotType="leaderboard" 
          slotId="swr-retirement-mid-ad" 
        />
      </div>

      {/* Cross-Tool Navigation Hub */}
      <div style={{ marginTop: '3rem' }}>
        <ToolsNavigationGrid 
          currentToolId="tool-swr" 
          setCurrentPage={setCurrentPage} 
        />
      </div>
    </main>
  );
};
