import React from 'react';
import { 
  BarChart2, TrendingUp, Globe, Layers, Zap, GitCompare, Droplets, ArrowRight, ShieldCheck, Cloud, GitCommit 
} from 'lucide-react';
import { PageView } from '../../types';

interface ToolsNavigationGridProps {
  currentTool: string;
  setCurrentPage: (page: PageView) => void;
}

export const ToolsNavigationGrid: React.FC<ToolsNavigationGridProps> = ({ currentTool, setCurrentPage }) => {
  const tools = [
    {
      id: 'tool-bond',
      hash: '#tools/bond',
      title: 'Sovereign Bond & Duration Engine',
      category: 'Fixed Income & Sovereign Debt',
      desc: 'Macaulay & Modified duration, second-order convexity curvature, and basis point yield shock modeling.',
      icon: BarChart2,
      color: '#B45309'
    },
    {
      id: 'tool-inflation',
      hash: '#tools/inflation',
      title: 'Inflation Drag & Real Return Forecaster',
      category: 'Monetary Policy & Wealth',
      desc: 'Fisher equation capital degradation, monetary debasement drag, and after-tax purchasing power audits.',
      icon: TrendingUp,
      color: '#EF4444'
    },
    {
      id: 'tool-fx',
      hash: '#tools/fx',
      title: 'FX Arbitrage & PPP Valuation Matrix',
      category: 'Global Forex & Central Banking',
      desc: 'Cross-rate calculations, Purchasing Power Parity mispricings, and central bank real rate spreads.',
      icon: Globe,
      color: '#0284c7'
    },
    {
      id: 'tool-compound',
      hash: '#tools/compound',
      title: 'Compound Capital Forecaster',
      category: 'Reserve Accumulation',
      desc: 'Multi-decade reserve growth, DRIP dividend reinvestment, and capital multiple trajectories.',
      icon: Layers,
      color: '#10B981'
    },
    {
      id: 'tool-ai-power',
      hash: '#tools/ai-power',
      title: 'AI Compute Power & PPA Sizer',
      category: 'Hyperscale Infrastructure',
      desc: 'GPU cluster continuous megawatt draw, PUE cooling loads, annual power bills, and SMR nuclear modules.',
      icon: Zap,
      color: '#F59E0B'
    },
    {
      id: 'tool-repo-spread',
      hash: '#tools/repo-spread',
      title: 'Treasury Basis & Repo Arbitrage',
      category: 'Fixed Income Arbitrage',
      desc: 'Cash-futures gross basis, net basis net of carry (BNOC), implied repo rate (IRR), and SOFR spreads.',
      icon: GitCompare,
      color: '#10B981'
    },
    {
      id: 'tool-water-cooling',
      hash: '#tools/water-cooling',
      title: 'Data Center Water & WUE Sizer',
      category: 'Hyperscale Engineering',
      desc: 'Annual megaliters, peak daily draw, Water Usage Effectiveness (WUE L/kWh), and watershed utility bills.',
      icon: Droplets,
      color: '#0284c7'
    },
    {
      id: 'tool-forex-tariff',
      hash: '#tools/forex-tariff',
      title: 'Forex Tariff & Pass-Through Engine',
      category: 'Sovereign Macro & Trade',
      desc: 'Custom tariffs, currency depreciation offsets, ERPT elasticity, and domestic reshoring parity pricing.',
      icon: Globe,
      color: '#D97706'
    },
    {
      id: 'tool-cloud-finops',
      hash: '#tools/finops',
      title: 'Cloud FinOps & LLM Cluster TCO Optimizer',
      category: 'Hyperscale Cloud & Infrastructure',
      desc: 'GPU instance commitments, network egress tax, Apache Iceberg storage tiering, and inference $/1M tokens.',
      icon: Cloud,
      color: '#0284c7'
    },
    {
      id: 'tool-iso20022',
      hash: '#tools/iso20022',
      title: 'ISO 20022 Liquidity & Clearing Modeler',
      category: 'Interbank Payments & Messaging',
      desc: 'Nostro/vostro buffer haircuts, SWIFT MT103 vs pacs.008 XML exceptions, and RTGS clearing velocity.',
      icon: GitCommit,
      color: '#10B981'
    }
  ];

  const handleNav = (targetId: PageView, hash: string) => {
    window.location.hash = hash;
    setCurrentPage(targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ marginTop: '3.5rem', borderTop: '1px solid var(--border-medium)', paddingTop: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
            Explore Dedicated Quantitative Terminals
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
            Standalone institutional models for fixed income, infrastructure engineering, and sovereign macro analysis.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleNav('tools', '#tools')}
          className="btn btn-secondary"
          style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}
        >
          View Master Quantitative Hub →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {tools.filter((t) => t.id !== currentTool).slice(0, 4).map((tool) => {
          const IconComponent = tool.icon;
          return (
            <div 
              key={tool.id}
              onClick={() => handleNav(tool.id as PageView, tool.hash)}
              className="card"
              style={{ 
                padding: '1.25rem', 
                cursor: 'pointer', 
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                  <div style={{ padding: '0.4rem', borderRadius: '6px', background: `${tool.color}18`, color: tool.color }}>
                    <IconComponent size={16} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                    {tool.category}
                  </span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.4rem 0', lineHeight: '1.3' }}>
                  {tool.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: 0 }}>
                  {tool.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 700, marginTop: '1rem' }}>
                <span>Launch Terminal</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
