import React, { useState, useMemo } from 'react';
import { 
  GitCommit, DollarSign, Clock, ShieldCheck, ArrowUpRight, 
  Download, Layers, AlertTriangle, FileText, CheckCircle2 
} from 'lucide-react';

interface Iso20022CalculatorProps {
  showToast: (msg: string) => void;
}

type ClearingCorridor = 'USD-EUR' | 'USD-GBP' | 'USD-INR' | 'EUR-AED' | 'USD-SGD';
type MessagingFormat = 'legacy-mt103' | 'iso20022-pacs008';

export const Iso20022LiquidityCalculator: React.FC<Iso20022CalculatorProps> = ({ showToast }) => {
  const [corridor, setCorridor] = useState<ClearingCorridor>('USD-EUR');
  const [dailyVolumeMillion, setDailyVolumeMillion] = useState<number>(250); // $250M daily clearing
  const [format, setFormat] = useState<MessagingFormat>('iso20022-pacs008');
  const [interestRatePct, setInterestRatePct] = useState<number>(4.65); // Benchmark SOFR/EURSTR yield
  const [txCountDaily, setTxCountDaily] = useState<number>(1850); // Number of wire transactions

  // Quantitative Matrix
  const calculations = useMemo(() => {
    const isIso = format === 'iso20022-pacs008';

    // Exception rates (investigative BIS and SWIFT metrics)
    const exceptionRate = isIso ? 0.004 : 0.092; // 0.4% vs 9.2% failure/truncation
    const manualRepairCostPerTx = 42.0; // $42 average manual investigation and compliance repair

    const dailyExceptions = Math.round(txCountDaily * exceptionRate);
    const dailyRepairCost = dailyExceptions * manualRepairCostPerTx;
    const annualRepairCost = dailyRepairCost * 252; // 252 clearing days

    // Trapped Nostro Liquidity Buffer
    // Legacy MT103 requires ~18% buffer due to unconfirmed settlement lags. ISO 20022 requires ~4.5%.
    const bufferPct = isIso ? 0.045 : 0.18;
    const trappedLiquidity = dailyVolumeMillion * 1000000 * bufferPct;
    
    // Opportunity cost of trapped liquidity @ SOFR/EURSTR rate
    const annualLiquidityOpportunityCost = trappedLiquidity * (interestRatePct / 100);

    // Total Annualized Friction
    const totalAnnualFriction = annualRepairCost + annualLiquidityOpportunityCost;
    const totalAnnualVolume = dailyVolumeMillion * 1000000 * 252;
    const costPerMillion = (totalAnnualFriction / (totalAnnualVolume / 1000000));

    // Settlement Velocity
    const averageSettlementMinutes = isIso ? 3.5 : 240; // 3.5 mins vs 4 hours

    return {
      dailyExceptions,
      annualRepairCost,
      trappedLiquidity,
      annualLiquidityOpportunityCost,
      totalAnnualFriction,
      costPerMillion,
      averageSettlementMinutes,
      bufferPct: (bufferPct * 100).toFixed(1)
    };
  }, [dailyVolumeMillion, format, interestRatePct, txCountDaily]);

  const handleExportJson = () => {
    const report = {
      auditTimestamp: new Date().toISOString(),
      platform: "BULLMONK ISO 20022 Sovereign Liquidity Terminal",
      corridor,
      clearingParameters: {
        dailyVolumeUsd: dailyVolumeMillion * 1000000,
        transactionCountDaily: txCountDaily,
        messagingStandard: format,
        costOfCapitalPct: interestRatePct
      },
      liquidityAudit: {
        trappedNostroBufferUsd: Math.round(calculations.trappedLiquidity),
        trappedBufferPct: `${calculations.bufferPct}%`,
        annualLiquidityOpportunityCostUsd: Math.round(calculations.annualLiquidityOpportunityCost),
        dailyStpExceptions: calculations.dailyExceptions,
        annualManualRepairCostUsd: Math.round(calculations.annualRepairCost),
        totalAnnualizedFrictionUsd: Math.round(calculations.totalAnnualFriction),
        frictionCostPerMillionUsd: calculations.costPerMillion.toFixed(2),
        meanSettlementVelocityMinutes: calculations.averageSettlementMinutes
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bullmonk-iso20022-clearing-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported ISO 20022 Clearing Audit Dossier (.json)');
  };

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-lg)',
      padding: 'clamp(1.25rem, 3vw, 2.25rem)',
      boxShadow: '0 8px 30px -4px rgba(15, 23, 42, 0.05)',
      marginBottom: '3rem'
    }}>
      {/* Top Configuration Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
        
        {/* Clearing Corridor */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Cross-Border Clearing Corridor
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {[
              { id: 'USD-EUR', label: 'Fedwire ⇄ TARGET2' },
              { id: 'USD-GBP', label: 'CHIPS ⇄ CHAPS' },
              { id: 'USD-INR', label: 'Fedwire ⇄ NEFT/RTGS' },
              { id: 'EUR-AED', label: 'TARGET2 ⇄ CBUAE' },
              { id: 'USD-SGD', label: 'CHIPS ⇄ MEPS+' }
            ].map(item => {
              const isActive = corridor === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCorridor(item.id as ClearingCorridor)}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isActive ? 'var(--accent-bronze)' : 'var(--border-medium)'}`,
                    background: isActive ? 'rgba(180, 83, 9, 0.08)' : 'var(--bg-surface-elevated)',
                    color: isActive ? 'var(--accent-bronze)' : 'var(--text-primary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Messaging Protocol */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Financial Telecommunication Standard
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              onClick={() => setFormat('legacy-mt103')}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${format === 'legacy-mt103' ? '#EF4444' : 'var(--border-medium)'}`,
                background: format === 'legacy-mt103' ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface-elevated)',
                color: format === 'legacy-mt103' ? '#EF4444' : 'var(--text-primary)',
                fontWeight: format === 'legacy-mt103' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontWeight: 700 }}>Legacy SWIFT MT103</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Unstructured tags, 9.2% error rate</div>
            </button>

            <button
              onClick={() => setFormat('iso20022-pacs008')}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${format === 'iso20022-pacs008' ? 'var(--accent-green)' : 'var(--border-medium)'}`,
                background: format === 'iso20022-pacs008' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-elevated)',
                color: format === 'iso20022-pacs008' ? 'var(--accent-green)' : 'var(--text-primary)',
                fontWeight: format === 'iso20022-pacs008' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontWeight: 700 }}>ISO 20022 (pacs.008)</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Structured XML, 0.4% error rate</div>
            </button>
          </div>
        </div>

        {/* Cost of Capital / SOFR Rate */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Nostro Liquidity Cost of Capital (SOFR / EURSTR)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="number"
              step="0.05"
              min="1.0"
              max="10.0"
              value={interestRatePct}
              onChange={(e) => setInterestRatePct(Number(e.target.value))}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '1rem',
                width: '100px'
              }}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>% Annual Yield Drag on Trapped Cash</span>
          </div>

          <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="var(--accent-green)" />
            <span>Bank for International Settlements (BIS) Committee on Payments</span>
          </div>
        </div>

      </div>

      {/* Sliders: Daily Volume and Transaction Count */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.75rem', 
        padding: '1.5rem',
        background: 'var(--bg-surface-elevated)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '2.5rem',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Daily Volume Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Daily Cross-Border Gross Clearing Volume
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-bronze)' }}>
              ${dailyVolumeMillion.toLocaleString()} Million / day
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={2000}
            step={10}
            value={dailyVolumeMillion}
            onChange={(e) => setDailyVolumeMillion(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-bronze)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            <span>$10M</span>
            <span>Annual Run-Rate: ${(dailyVolumeMillion * 252 / 1000).toFixed(1)} Billion</span>
            <span>$2.0B / day</span>
          </div>
        </div>

        {/* Transaction Count Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Daily Wire Messages Sent
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-bronze)' }}>
              {txCountDaily.toLocaleString()} wires / day
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={10000}
            step={50}
            value={txCountDaily}
            onChange={(e) => setTxCountDaily(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-bronze)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            <span>100</span>
            <span>Est. Daily Exceptions: {calculations.dailyExceptions} wires</span>
            <span>10,000 wires</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        
        {/* Trapped Nostro Buffer */}
        <div style={{ 
          background: 'var(--bg-surface-elevated)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.25rem',
          borderLeft: '4px solid #EF4444'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            REQUIRED NOSTRO BUFFER
          </span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ${Math.round(calculations.trappedLiquidity / 1000000).toLocaleString()}M
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            {calculations.bufferPct}% of daily volume locked in clearing banks
          </span>
        </div>

        {/* Annual Drag */}
        <div style={{ 
          background: 'var(--bg-surface-elevated)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.25rem',
          borderLeft: '4px solid var(--accent-bronze)'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            TOTAL ANNUAL FRICTION
          </span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ${Math.round(calculations.totalAnnualFriction / 1000).toLocaleString()}k
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Capital drag + manual STP repair costs
          </span>
        </div>

        {/* Cost per Million */}
        <div style={{ 
          background: 'var(--bg-surface-elevated)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.25rem',
          borderLeft: '4px solid var(--accent-green)'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            CLEARING FRICTION / $1M
          </span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-green)' }}>
            ${calculations.costPerMillion.toFixed(2)}
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Comprehensive cost per million cleared
          </span>
        </div>

        {/* Settlement Velocity */}
        <div style={{ 
          background: 'var(--bg-surface-elevated)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.25rem',
          borderLeft: '4px solid #0284c7'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            SETTLEMENT VELOCITY
          </span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {calculations.averageSettlementMinutes} Min
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            {format === 'iso20022-pacs008' ? 'Near-instant straight-through execution' : 'T+0 End-of-day batch settlement lag'}
          </span>
        </div>

      </div>

      {/* Export Button & Action */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(180, 83, 9, 0.05) 100%)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
            🏦 ISO 20022 Efficiency Dividend: <span style={{ color: 'var(--accent-green)' }}>+75% Liquidity Release</span>
          </span>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Switching from truncated MT103 to rich-data pacs.008 eliminates KYC false positives and releases over ${Math.round(dailyVolumeMillion * 0.135)}M in pre-funded capital.
          </span>
        </div>

        <button
          onClick={handleExportJson}
          className="btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--accent-bronze)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.85rem',
            padding: '0.65rem 1.15rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Download size={14} /> Export Clearing Dossier (.json)
        </button>
      </div>

      {/* Internal Backlink Cards to Dispatches */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.75rem' }}>
          Related Investigative Research Dispatches
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          <a
            href="#article/iso-20022-swift-mt103-migration-chaps-fedwire-liquidity-squeeze"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              fontWeight: 600
            }}
          >
            <span>The ISO 20022 Migration Chokepoint: Trapped Nostros</span>
            <ArrowUpRight size={14} color="var(--accent-bronze)" />
          </a>
          <a
            href="#tools/repo-spread"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              fontWeight: 600
            }}
          >
            <span>Model Collateral & SOFR in Treasury Basis Terminal</span>
            <ArrowUpRight size={14} color="var(--accent-bronze)" />
          </a>
        </div>
      </div>

    </div>
  );
};
