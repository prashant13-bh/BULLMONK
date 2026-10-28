import React, { useState, useMemo } from 'react';
import { TrendingUp, ShieldAlert, Copy, Check, Info } from 'lucide-react';

interface InflationForecasterProps {
  showToast: (msg: string) => void;
}

export const InflationForecaster: React.FC<InflationForecasterProps> = ({ showToast }) => {
  const [infPrincipal, setInfPrincipal] = useState<number>(100000);
  const [infNominalReturn, setInfNominalReturn] = useState<number>(9.5);
  const [infCpiRate, setInfCpiRate] = useState<number>(3.2);
  const [infTaxRate, setInfTaxRate] = useState<number>(15);
  const [infHorizonYears, setInfHorizonYears] = useState<number>(15);
  const [copied, setCopied] = useState(false);

  const inflationMetrics = useMemo(() => {
    const p = Math.max(1000, infPrincipal);
    const n = Math.max(1, infHorizonYears);
    const grossR = infNominalReturn / 100;
    const tax = infTaxRate / 100;
    const cpi = infCpiRate / 100;

    // After-tax nominal return
    const afterTaxR = grossR * (1 - tax);
    // Real rate of return using Fisher Equation: (1 + r_after_tax) / (1 + cpi) - 1
    const realReturnRate = ((1 + afterTaxR) / (1 + cpi)) - 1;

    const nominalPreTaxFinal = p * Math.pow(1 + grossR, n);
    const nominalAfterTaxFinal = p * Math.pow(1 + afterTaxR, n);
    const realPurchasingPowerFinal = p * Math.pow(1 + realReturnRate, n);

    const taxDrag = nominalPreTaxFinal - nominalAfterTaxFinal;
    const inflationDrag = nominalAfterTaxFinal - realPurchasingPowerFinal;

    return {
      nominalPreTaxFinal: Math.round(nominalPreTaxFinal),
      nominalAfterTaxFinal: Math.round(nominalAfterTaxFinal),
      realPurchasingPowerFinal: Math.round(realPurchasingPowerFinal),
      taxDrag: Math.round(taxDrag),
      inflationDrag: Math.round(inflationDrag),
      realCAGR: Number((realReturnRate * 100).toFixed(2))
    };
  }, [infPrincipal, infNominalReturn, infCpiRate, infTaxRate, infHorizonYears]);

  const handleCopy = () => {
    const text = `BULLMONK REAL PURCHASING POWER FORECAST
Principal: $${infPrincipal.toLocaleString()} | Horizon: ${infHorizonYears} Years
Gross Return: ${infNominalReturn}% | CPI Inflation: ${infCpiRate}% | Tax Drag: ${infTaxRate}%
Nominal Pre-Tax Value: $${inflationMetrics.nominalPreTaxFinal.toLocaleString()}
Nominal After-Tax Value: $${inflationMetrics.nominalAfterTaxFinal.toLocaleString()}
Real Purchasing Power: $${inflationMetrics.realPurchasingPowerFinal.toLocaleString()}
Inflation Drag (Purchasing Power Lost): $${inflationMetrics.inflationDrag.toLocaleString()}
Tax Drag: $${inflationMetrics.taxDrag.toLocaleString()}
Effective Real Annualized CAGR: ${inflationMetrics.realCAGR}%
Generated via BullMonk Financial Intelligence Suite (bullmonk.live)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Inflation audit copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <TrendingUp size={14} /> Monetary Policy & Wealth Preservation
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>Inflation Drag & Real Return Forecaster</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '720px', margin: 0 }}>
            Model real capital purchasing power degradation, cumulative monetary inflation drag, and after-tax capital erosion across multi-decade accumulation horizons.
          </p>
        </div>
        <button onClick={handleCopy} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
          {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
          {copied ? 'Dossier Copied' : 'Export Inflation Audit'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Inputs Box */}
        <div style={{ 
          background: 'var(--bg-surface)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.75rem' 
        }}>
          <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--accent-gold)" /> Portfolio & Inflation Parameters
          </h3>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="inf-principal" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Initial Capital Portfolio ($)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>${infPrincipal.toLocaleString()}</span>
              </label>
              <input
                id="inf-principal"
                type="number"
                min={1000}
                max={50000000}
                step={5000}
                value={infPrincipal}
                onChange={(e) => setInfPrincipal(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="inf-return" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Nominal Annual Gross Return (%)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{infNominalReturn}%</span>
              </label>
              <input
                id="inf-return"
                type="number"
                step={0.1}
                value={infNominalReturn}
                onChange={(e) => setInfNominalReturn(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="inf-cpi" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Projected Annual CPI Inflation (%)</span>
                <span style={{ color: '#EF4444', fontFamily: 'var(--font-mono)' }}>{infCpiRate}%</span>
              </label>
              <input
                id="inf-cpi"
                type="number"
                step={0.1}
                value={infCpiRate}
                onChange={(e) => setInfCpiRate(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="inf-tax" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Capital Gains / Income Tax Rate (%)</span>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{infTaxRate}%</span>
              </label>
              <input
                id="inf-tax"
                type="number"
                step={1}
                value={infTaxRate}
                onChange={(e) => setInfTaxRate(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="inf-horizon" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Time Horizon (Years)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{infHorizonYears} Years</span>
              </label>
              <input
                id="inf-horizon"
                type="range"
                min={1}
                max={35}
                step={1}
                value={infHorizonYears}
                onChange={(e) => setInfHorizonYears(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
              />
            </div>
          </form>
        </div>

        {/* Results Output */}
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
              <ShieldAlert size={18} color="var(--accent-gold)" /> Purchasing Power & Monetary Debasement Audit
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Nominal Future Value</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>${inflationMetrics.nominalAfterTaxFinal.toLocaleString()}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pre-tax: ${inflationMetrics.nominalPreTaxFinal.toLocaleString()}</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Real Purchasing Power</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>
                  ${inflationMetrics.realPurchasingPowerFinal.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>In Today's Purchasing Dollars</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Inflation Drag (Debasement)</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#EF4444' }}>
                  -${inflationMetrics.inflationDrag.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Purchasing Power Evaporation</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Real CAGR (Net of CPI)</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>
                  {inflationMetrics.realCAGR}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>True Compounding Rate</div>
              </div>
            </div>

            {/* Visual Drag Comparison */}
            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Capital Distribution at Year {infHorizonYears}:
              </div>
              <div style={{ display: 'flex', height: '24px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                <div 
                  style={{ 
                    width: `${Math.max(5, (inflationMetrics.realPurchasingPowerFinal / inflationMetrics.nominalPreTaxFinal) * 100)}%`, 
                    background: '#10B981' 
                  }} 
                  title="Real Purchasing Power"
                />
                <div 
                  style={{ 
                    width: `${Math.max(5, (inflationMetrics.inflationDrag / inflationMetrics.nominalPreTaxFinal) * 100)}%`, 
                    background: '#EF4444' 
                  }} 
                  title="Inflation Loss"
                />
                <div 
                  style={{ 
                    width: `${Math.max(5, (inflationMetrics.taxDrag / inflationMetrics.nominalPreTaxFinal) * 100)}%`, 
                    background: '#64748B' 
                  }} 
                  title="Tax Drag"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '2px' }}></span> Real Purchasing Power
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#EF4444', borderRadius: '2px' }}></span> Inflation Drag
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#64748B', borderRadius: '2px' }}></span> Tax Drag
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <Info size={14} />
            <span>
              Uses standard macroeconomic Fisher Equation for inflation adjustment: (1 + r_real) = (1 + r_nominal) / (1 + i).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
