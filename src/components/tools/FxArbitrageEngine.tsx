import React, { useState, useMemo } from 'react';
import { Globe, BarChart2, ArrowUpRight, ArrowDownRight, Copy, Check, Info } from 'lucide-react';

interface FxArbitrageEngineProps {
  showToast: (msg: string) => void;
}

export const FxArbitrageEngine: React.FC<FxArbitrageEngineProps> = ({ showToast }) => {
  const [fxAmount, setFxAmount] = useState<number>(10000);
  const [fxBase, setFxBase] = useState<string>('USD');
  const [fxTarget, setFxTarget] = useState<string>('EUR');
  const [copied, setCopied] = useState(false);

  // Benchmark exchange rates vs USD
  const fxRates: Record<string, { rateVsUsd: number; pppImplied: number; name: string; flag: string; centralBank: string; policyRate: number; cpi: number }> = {
    USD: { rateVsUsd: 1.0, pppImplied: 1.0, name: 'US Dollar', flag: '🇺🇸', centralBank: 'Federal Reserve', policyRate: 4.875, cpi: 2.8 },
    EUR: { rateVsUsd: 0.92, pppImplied: 0.84, name: 'Euro', flag: '🇪🇺', centralBank: 'European Central Bank', policyRate: 3.25, cpi: 2.2 },
    GBP: { rateVsUsd: 0.77, pppImplied: 0.71, name: 'British Pound', flag: '🇬🇧', centralBank: 'Bank of England', policyRate: 4.75, cpi: 2.4 },
    INR: { rateVsUsd: 84.15, pppImplied: 24.50, name: 'Indian Rupee', flag: '🇮🇳', centralBank: 'Reserve Bank of India', policyRate: 6.50, cpi: 4.8 },
    JPY: { rateVsUsd: 152.40, pppImplied: 110.0, name: 'Japanese Yen', flag: '🇯🇵', centralBank: 'Bank of Japan', policyRate: 0.25, cpi: 2.5 },
    CAD: { rateVsUsd: 1.38, pppImplied: 1.25, name: 'Canadian Dollar', flag: '🇨🇦', centralBank: 'Bank of Canada', policyRate: 3.75, cpi: 2.0 },
    AUD: { rateVsUsd: 1.51, pppImplied: 1.35, name: 'Australian Dollar', flag: '🇦🇺', centralBank: 'Reserve Bank of Australia', policyRate: 4.35, cpi: 3.6 },
    CHF: { rateVsUsd: 0.865, pppImplied: 1.05, name: 'Swiss Franc', flag: '🇨🇭', centralBank: 'Swiss National Bank', policyRate: 1.00, cpi: 1.1 }
  };

  const fxConversion = useMemo(() => {
    const baseData = fxRates[fxBase] || fxRates.USD;
    const targetData = fxRates[fxTarget] || fxRates.EUR;

    // Cross-rate calculation via USD
    const directRate = targetData.rateVsUsd / baseData.rateVsUsd;
    const convertedAmount = fxAmount * directRate;

    // Implied PPP Cross Rate
    const pppRate = targetData.pppImplied / baseData.pppImplied;
    // Valuation deviation: ((Market - PPP) / PPP) * 100
    const valuationDiff = ((directRate - pppRate) / pppRate) * 100;

    // Real interest rate spread
    const baseRealRate = baseData.policyRate - baseData.cpi;
    const targetRealRate = targetData.policyRate - targetData.cpi;
    const realRateSpread = targetRealRate - baseRealRate;

    return {
      directRate: Number(directRate.toFixed(4)),
      convertedAmount: Number(convertedAmount.toFixed(2)),
      pppRate: Number(pppRate.toFixed(4)),
      valuationDiff: Number(valuationDiff.toFixed(1)),
      isOvervalued: valuationDiff > 0,
      baseRealRate: Number(baseRealRate.toFixed(2)),
      targetRealRate: Number(targetRealRate.toFixed(2)),
      realRateSpread: Number(realRateSpread.toFixed(2))
    };
  }, [fxAmount, fxBase, fxTarget]);

  const handleCopy = () => {
    const text = `BULLMONK FX ARBITRAGE & PPP VALUATION DOSSIER
Exchange: ${fxAmount.toLocaleString()} ${fxBase} ➔ ${fxConversion.convertedAmount.toLocaleString()} ${fxTarget}
Spot Rate: 1 ${fxBase} = ${fxConversion.directRate} ${fxTarget}
Implied PPP Benchmark Rate: 1 ${fxBase} = ${fxConversion.pppRate} ${fxTarget}
Valuation Assessment: ${fxTarget} is ${Math.abs(fxConversion.valuationDiff)}% ${fxConversion.isOvervalued ? 'OVERVALUED' : 'UNDERVALUED'} vs ${fxBase}
Real Policy Rate Spread: ${fxConversion.realRateSpread}%
Generated via BullMonk Financial Intelligence Suite (bullmonk.live)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('FX dossier copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.12)', color: '#0284c7', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <Globe size={14} /> Global Forex & Central Banking
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>FX Arbitrage & PPP Valuation Matrix</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '720px', margin: 0 }}>
            Analyze spot foreign exchange cross-rates, Purchasing Power Parity (PPP) valuation mispricings, central bank real policy rate spreads, and carry trade yield differentials.
          </p>
        </div>
        <button onClick={handleCopy} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
          {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
          {copied ? 'Dossier Copied' : 'Export FX Dossier'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Interactive Currency Conversion */}
        <div style={{ 
          background: 'var(--bg-surface)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.75rem' 
        }}>
          <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="var(--accent-gold)" /> Cross-Border FX Remittance & Arbitrage
          </h3>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="fx-amount" style={{ fontSize: '0.84rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                Capital Amount to Convert:
              </label>
              <input
                id="fx-amount"
                type="number"
                min={1}
                value={fxAmount}
                onChange={(e) => setFxAmount(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="fx-base" style={{ fontSize: '0.84rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Base Currency:</label>
                <select
                  id="fx-base"
                  value={fxBase}
                  onChange={(e) => setFxBase(e.target.value)}
                  className="form-control"
                >
                  {Object.keys(fxRates).map((cur) => (
                    <option key={cur} value={cur}>
                      {fxRates[cur].flag} {cur} ({fxRates[cur].name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fx-target" style={{ fontSize: '0.84rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Target Currency:</label>
                <select
                  id="fx-target"
                  value={fxTarget}
                  onChange={(e) => setFxTarget(e.target.value)}
                  className="form-control"
                >
                  {Object.keys(fxRates).map((cur) => (
                    <option key={cur} value={cur}>
                      {fxRates[cur].flag} {cur} ({fxRates[cur].name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conversion Summary Display */}
            <div style={{ 
              background: 'var(--bg-surface-elevated)', 
              padding: '1.25rem', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border-medium)',
              marginTop: '0.5rem'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Market Spot Settlement:</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>
                {fxConversion.convertedAmount.toLocaleString()} {fxTarget}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                1 {fxBase} = {fxConversion.directRate} {fxTarget}
              </div>
            </div>
          </form>
        </div>

        {/* Implied PPP Valuation Card */}
        <div style={{ 
          background: 'var(--bg-surface-elevated)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={18} color="var(--accent-gold)" /> Purchasing Power Parity (PPP) Valuation
            </h3>

            <div style={{ marginBottom: '1.5rem', background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>PPP Implied Exchange Rate:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  1 {fxBase} = {fxConversion.pppRate} {fxTarget}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Valuation Deviation:</span>
                <span style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontWeight: 800, 
                  color: fxConversion.isOvervalued ? '#EF4444' : '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {fxConversion.isOvervalued ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(fxConversion.valuationDiff)}% {fxConversion.isOvervalued ? 'OVERVALUED' : 'UNDERVALUED'}
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                Based on relative price level parity, the {fxTarget} appears <strong>{fxConversion.isOvervalued ? 'rich (overvalued)' : 'cheap (undervalued)'}</strong> against the {fxBase} by {Math.abs(fxConversion.valuationDiff)}%. Over multi-year horizons, currencies frequently exhibit mean-reversion toward their purchasing power baseline.
              </p>
            </div>

            {/* Real Interest Rate Differential */}
            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.65rem' }}>Central Bank Real Policy Spread:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>{fxBase} Real Rate:</div>
                  <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{fxConversion.baseRealRate}%</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>{fxTarget} Real Rate:</div>
                  <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{fxConversion.targetRealRate}%</div>
                </div>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Carry trade yield spread: <strong>{fxConversion.realRateSpread > 0 ? `+${fxConversion.realRateSpread}%` : `${fxConversion.realRateSpread}%`}</strong> favoring {fxConversion.realRateSpread > 0 ? fxTarget : fxBase}.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <Info size={14} />
            <span>
              Implied PPP rates derived from OECD benchmark price indices and Big Mac PPP forensic studies.
            </span>
          </div>
        </div>
      </div>

      {/* Central Bank Surveillance Table */}
      <div style={{ 
        background: 'var(--bg-surface)', 
        border: '1px solid var(--border-medium)', 
        borderRadius: 'var(--radius-md)', 
        padding: '1.75rem' 
      }}>
        <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.15rem', marginBottom: '1rem' }}>
          Global Central Bank Policy Benchmark Grid
        </h3>
        <div className="prose-table-wrapper" style={{ overflowX: 'auto' }}>
          <table className="prose-data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-medium)', textAlign: 'left', background: 'var(--bg-subtle)' }}>
                <th style={{ padding: '0.75rem' }}>Jurisdiction</th>
                <th style={{ padding: '0.75rem' }}>Central Bank</th>
                <th style={{ padding: '0.75rem' }}>Nominal Rate</th>
                <th style={{ padding: '0.75rem' }}>CPI Inflation</th>
                <th style={{ padding: '0.75rem' }}>Real Policy Rate</th>
                <th style={{ padding: '0.75rem' }}>Monetary Stance</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(fxRates).map(([cur, data]) => {
                const realRate = data.policyRate - data.cpi;
                return (
                  <tr key={cur} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>
                      {data.flag} {cur} ({data.name})
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                      {data.centralBank}
                    </td>
                    <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {data.policyRate}%
                    </td>
                    <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)', color: '#EF4444' }}>
                      {data.cpi}%
                    </td>
                    <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: realRate >= 0 ? '#10B981' : '#EF4444' }}>
                      {realRate >= 0 ? `+${realRate.toFixed(2)}%` : `${realRate.toFixed(2)}%`}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px',
                        background: realRate > 1.5 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: realRate > 1.5 ? '#10B981' : '#EF4444',
                        fontWeight: 700
                      }}>
                        {realRate > 1.5 ? 'Restrictive' : 'Accommodative'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
