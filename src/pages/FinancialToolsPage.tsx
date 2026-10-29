import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdBanner } from '../components/AdBanner';
import { TradingViewBanner } from '../components/TradingViewBanner';
import { 
  BarChart2, TrendingUp, Globe, Layers, Zap, GitCompare, Droplets, 
  ArrowRight, ShieldCheck, ShieldAlert, Search, Filter, Cpu, FileText, Sparkles, Cloud, GitCommit
} from 'lucide-react';
import { PageView } from '../types';

interface FinancialToolsPageProps {
  setCurrentPage: (page: PageView) => void;
  showToast: (msg: string) => void;
}

export const FinancialToolsPage: React.FC<FinancialToolsPageProps> = ({
  setCurrentPage,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'fixed-income' | 'infrastructure' | 'macro'>('all');

  const tools = useMemo(() => [
    {
      id: 'tool-bond' as PageView,
      hash: '#tools/bond',
      title: 'Sovereign Bond Yield, Duration & Convexity Terminal',
      badge: 'Fixed Income & Debt',
      category: 'fixed-income',
      desc: 'Institutional-grade pricing engine for sovereign debt securities. Model clean bond prices, Macaulay & Modified duration, second-order convexity curvature, and basis point yield shock sensitivities across US Treasuries, German Bunds, and UK Gilts.',
      kpis: ['Clean Price & YTM', 'Macaulay & Mod Duration', 'Taylor Convexity Shift'],
      icon: BarChart2,
      color: '#B45309'
    },
    {
      id: 'tool-inflation' as PageView,
      hash: '#tools/inflation',
      title: 'Inflation Drag & Real Wealth Preservation Forecaster',
      badge: 'Monetary Policy & Wealth',
      category: 'macro',
      desc: 'Measure the true purchasing power of capital reserves after statutory taxation and systemic monetary debasement. Model multi-decade nominal vs real returns using macroeconomic Fisher elasticity to insulate portfolios against stagflation.',
      kpis: ['Fisher Real Return CAGR', 'Monetary Debasement Loss', 'After-Tax Reserve Audit'],
      icon: TrendingUp,
      color: '#EF4444'
    },
    {
      id: 'tool-fx' as PageView,
      hash: '#tools/fx',
      title: 'Global FX Arbitrage & Purchasing Power Parity Matrix',
      badge: 'Forex & Central Banking',
      category: 'macro',
      desc: 'Comprehensive currency intelligence terminal analyzing spot foreign exchange cross-rates, Purchasing Power Parity (PPP) valuation mispricings, central bank real policy rate spreads, and carry trade yield differentials.',
      kpis: ['Spot FX Cross Rates', 'PPP Valuation Deviation', 'Central Bank Real Rate Grid'],
      icon: Globe,
      color: '#0284c7'
    },
    {
      id: 'tool-compound' as PageView,
      hash: '#tools/compound',
      title: 'Multi-Decade Compound Capital & Reserve Forecaster',
      badge: 'Reserve Accumulation',
      category: 'macro',
      desc: 'Simulate multi-decade exponential reserve compounding with periodic cash inflows and dividend reinvestment (DRIP). Analyze trajectory milestones and capital multiple expansions across generational institutional horizons.',
      kpis: ['DRIP Compounding Acceleration', 'Capital Multiple Ratio', 'Decadal Wealth Milestones'],
      icon: Layers,
      color: '#10B981'
    },
    {
      id: 'tool-ai-power' as PageView,
      hash: '#tools/ai-power',
      title: 'AI Compute Cluster Power, PUE & PPA Sizing Terminal',
      badge: 'Hyperscale Infrastructure',
      category: 'infrastructure',
      desc: 'Model continuous megawatt electrical draw, annual gigawatt-hour (GWh) consumption, direct liquid-cooling tons, Power Purchase Agreement (PPA) utility bills, and equivalent 77MW SMR nuclear modules across NVIDIA H100, B200, GB200, and AMD MI300X clusters.',
      kpis: ['Continuous Power (MW)', 'Facility PUE Overhead', 'SMR Nuclear Module Sizing'],
      icon: Zap,
      color: '#F59E0B'
    },
    {
      id: 'tool-repo-spread' as PageView,
      hash: '#tools/repo-spread',
      title: 'Treasury Cash-Futures Basis & Reverse Repo Arbitrage Engine',
      badge: 'Fixed Income Arbitrage',
      category: 'fixed-income',
      desc: 'Institutional relative-value terminal modeling Treasury cash-futures gross basis, net basis net of carry (BNOC), implied repo rate (IRR), and Secured Overnight Financing Rate (SOFR) spread arbitrage for primary dealers.',
      kpis: ['Basis Net of Carry (BNOC)', 'Implied Repo Rate (IRR)', 'SOFR Spread Arbitrage'],
      icon: GitCompare,
      color: '#10B981'
    },
    {
      id: 'tool-water-cooling' as PageView,
      hash: '#tools/water-cooling',
      title: 'Data Center Water Usage Effectiveness (WUE) & Watershed Sizer',
      badge: 'Environmental Engineering',
      category: 'infrastructure',
      desc: 'Simulate municipal water consumption, daily evaporative cooling draws, Water Usage Effectiveness (WUE in Liters/kWh), household usage equivalents, and watershed utility bills across Direct-to-Chip liquid loops and dry coolers.',
      kpis: ['WUE (L/kWh) ASHRAE Index', 'Peak Daily Water Draw', 'Municipal Household Equiv'],
      icon: Droplets,
      color: '#0284c7'
    },
    {
      id: 'tool-forex-tariff' as PageView,
      hash: '#tools/forex-tariff',
      title: 'Forex Tariff & Currency Pass-Through Arbitrage Engine',
      badge: 'Sovereign Macro & Trade',
      category: 'macro',
      desc: 'Model custom tariff assessments, foreign currency depreciation buffers, exchange rate pass-through elasticity (ERPT), exporter margin concessions, and domestic reshoring price parity thresholds across global supply chains.',
      kpis: ['Landed Duty-Paid (LDP) Cost', 'FX Devaluation Buffer Offset', 'Reshoring Price Parity'],
      icon: Globe,
      color: '#D97706'
    },
    {
      id: 'tool-cloud-finops' as PageView,
      hash: '#tools/finops',
      title: 'Cloud FinOps Compute & LLM Cluster TCO Optimizer',
      badge: 'Hyperscale Infrastructure',
      category: 'infrastructure',
      desc: 'Simulate multi-cloud GPU/CPU instance expenditure, Reserved Instance commitment arbitrage, data egress tax penalties, Apache Iceberg storage tiering, inference token unit economics ($/1M tokens), and private cloud colocation repatriation breakeven points.',
      kpis: ['Monthly Run-Rate TCO', 'Annualized FinOps Savings', 'Token Cost ($/1M tokens)'],
      icon: Cloud,
      color: '#0284c7'
    },
    {
      id: 'tool-iso20022' as PageView,
      hash: '#tools/iso20022',
      title: 'ISO 20022 Cross-Border Liquidity & RTGS Clearing Modeler',
      badge: 'Interbank Payments & Messaging',
      category: 'fixed-income',
      desc: 'Simulate capital velocity, intraday nostro/vostro buffer haircuts, straight-through processing (STP) exceptions, and cost-of-capital carry across SWIFT MT103 legacy messaging and modern ISO 20022 pacs.008 XML corridors.',
      kpis: ['Trapped Nostro Liquidity', 'Annual Exception Drag', 'Cost per $1M Cleared'],
      icon: GitCommit,
      color: '#10B981'
    }
  ], []);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesFilter = selectedFilter === 'all' || tool.category === selectedFilter;
      const matchesSearch = searchQuery.trim() === '' || 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.badge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [tools, selectedFilter, searchQuery]);

  const handleOpenTool = (targetId: PageView, hash: string) => {
    window.location.hash = hash;
    setCurrentPage(targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="container" style={{ paddingBottom: '5rem', minHeight: '80vh' }}>
      {/* Top Breadcrumb Navigation */}
      <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
        <Breadcrumbs 
          items={[
            { label: 'Intelligence Desks', onClick: () => setCurrentPage('home') },
            { label: 'Quantitative Suite', active: true }
          ]}
        />
      </div>

      {/* Header Banner */}
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
            <Cpu size={13} /> Institutional Analytical Suite
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            <ShieldCheck size={14} color="var(--accent-green)" /> 8 Standalone Computational Terminals
          </span>
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-brand)', 
          fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', 
          letterSpacing: '-0.02em', 
          lineHeight: '1.15',
          marginBottom: '0.85rem'
        }}>
          Sovereign Quantitative Suite & Computational Terminals
        </h1>

        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)', 
          maxWidth: '840px', 
          lineHeight: '1.6',
          margin: 0
        }}>
          Dedicated, institutional-grade calculation terminals for fixed income duration sensitivity, monetary inflation drag, foreign exchange purchasing power parity, AI cluster power and water cooling sizing, and global tariff pass-through arbitrage. Every tool is hosted on its own standalone page with dedicated shareable endpoints.
        </p>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => { window.location.hash = '#doc-tools'; setCurrentPage('doc-tools'); }}
            style={{ fontSize: '0.82rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FileText size={14} />
            <span>PDF, Word & AI Image Studio →</span>
          </button>
        </div>
      </header>

      {/* Responsive AdSense Placement */}
      <div className="hide-on-mobile" style={{ marginBottom: '2rem' }}>
        <AdBanner slotType="leaderboard" slotId="tools-hub-top" />
      </div>

      {/* Search and Category Filters */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1rem', 
        marginBottom: '2rem',
        background: 'var(--bg-surface)',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-medium)'
      }}>
        {/* Category Filter Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`cat-tab ${selectedFilter === 'all' ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            All Terminals ({tools.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('fixed-income')}
            className={`cat-tab ${selectedFilter === 'fixed-income' ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            Fixed Income & Yield (2)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('infrastructure')}
            className={`cat-tab ${selectedFilter === 'infrastructure' ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            Compute & Energy Infrastructure (2)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('macro')}
            className={`cat-tab ${selectedFilter === 'macro' ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            Macro, Wealth & Trade (4)
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 240px', maxWidth: '360px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search quantitative tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem 0.55rem 2.25rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      {/* Master 8-Card Tool Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {filteredTools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <div 
              key={tool.id} 
              className="card"
              style={{ 
                padding: '1.75rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(15, 23, 42, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: `${tool.color}15`, color: tool.color, padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <IconComponent size={14} />
                    <span>{tool.badge}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Standalone URL
                  </span>
                </div>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.65rem 0', lineHeight: '1.3' }}>
                  {tool.title}
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.55', margin: '0 0 1.25rem 0' }}>
                  {tool.desc}
                </p>

                {/* Key KPIs Modeled */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  {tool.kpis.map((kpi, idx) => (
                    <span 
                      key={idx} 
                      style={{ 
                        fontSize: '0.72rem', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px', 
                        background: 'var(--bg-subtle)', 
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      ✓ {kpi}
                    </span>
                  ))}
                </div>
              </div>

              {/* Launch Button */}
              <button
                type="button"
                onClick={() => handleOpenTool(tool.id, tool.hash)}
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  fontSize: '0.88rem',
                  padding: '0.65rem 1rem'
                }}
              >
                <span>Open Dedicated Terminal</span>
                <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Official Financial Charting Partner: TradingView */}
      <TradingViewBanner variant="full" />

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
          The computational engines, duration models, inflation debasement projections, and currency arbitrage matrices provided across the BullMonk Quantitative Suite are intended exclusively for academic, informational, and journalistic reference. BULLMONK does not provide personal financial advisory, asset custody, broker-dealer execution, or fiduciary guidance. Consult an accredited CFA/fiduciary prior to executing transactions.
        </p>
      </div>
    </main>
  );
};
