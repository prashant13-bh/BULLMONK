import React, { useState, useMemo } from 'react';
import { DollarSign, Layers, Copy, Check, Info } from 'lucide-react';

interface CompoundCapitalEngineProps {
  showToast: (msg: string) => void;
}

export const CompoundCapitalEngine: React.FC<CompoundCapitalEngineProps> = ({ showToast }) => {
  const [compInitial, setCompInitial] = useState<number>(25000);
  const [compMonthly, setCompMonthly] = useState<number>(1000);
  const [compGrowthRate, setCompGrowthRate] = useState<number>(8.5);
  const [compDividendYield, setCompDividendYield] = useState<number>(2.0);
  const [compReinvestDiv, setCompReinvestDiv] = useState<boolean>(true);
  const [compYears, setCompYears] = useState<number>(20);
  const [copied, setCopied] = useState(false);

  const compoundMetrics = useMemo(() => {
    const p = Math.max(0, compInitial);
    const pmt = Math.max(0, compMonthly);
    const effectiveAnnualRate = (compGrowthRate + (compReinvestDiv ? compDividendYield : 0)) / 100;
    const monthlyRate = effectiveAnnualRate / 12;
    const totalMonths = Math.max(1, compYears * 12);

    let balance = p;
    let totalDeposited = p;
    const milestones: { year: number; balance: number; interestEarned: number }[] = [];

    for (let m = 1; m <= totalMonths; m++) {
      balance = (balance + pmt) * (1 + monthlyRate);
      totalDeposited += pmt;

      if (m % 12 === 0 || m === totalMonths) {
        milestones.push({
          year: Math.round(m / 12),
          balance: Math.round(balance),
          interestEarned: Math.round(balance - totalDeposited)
        });
      }
    }

    const totalInterestEarned = balance - totalDeposited;

    return {
      finalBalance: Math.round(balance),
      totalDeposited: Math.round(totalDeposited),
      totalInterestEarned: Math.round(totalInterestEarned),
      milestones
    };
  }, [compInitial, compMonthly, compGrowthRate, compDividendYield, compReinvestDiv, compYears]);

  const handleCopy = () => {
    const text = `BULLMONK COMPOUND CAPITAL FORECAST
Starting Capital: $${compInitial.toLocaleString()} | Monthly Addition: $${compMonthly.toLocaleString()}
Duration: ${compYears} Years | Net Compounding Rate: ${(compGrowthRate + (compReinvestDiv ? compDividendYield : 0)).toFixed(1)}%
Final Portfolio Value: $${compoundMetrics.finalBalance.toLocaleString()}
Total Capital Deposited: $${compoundMetrics.totalDeposited.toLocaleString()}
Total Compound Growth Earned: $${compoundMetrics.totalInterestEarned.toLocaleString()}
Generated via BullMonk Financial Intelligence Suite (bullmonk.live)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Compound audit copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <Layers size={14} /> Multi-Decade Reserve Accumulation
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>Compound Capital & Reserve Forecaster</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '720px', margin: 0 }}>
            Model multi-decade sovereign wealth compounding, DRIP dividend reinvestment acceleration, and long-term capital inflow trajectories.
          </p>
        </div>
        <button onClick={handleCopy} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
          {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
          {copied ? 'Dossier Copied' : 'Export Compound Dossier'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Input Controls */}
        <div style={{ 
          background: 'var(--bg-surface)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.75rem' 
        }}>
          <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--accent-gold)" /> Compound Accumulation Setup
          </h3>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="comp-initial" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Initial Reserve Deposit ($)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>${compInitial.toLocaleString()}</span>
              </label>
              <input
                id="comp-initial"
                type="number"
                min={0}
                step={2500}
                value={compInitial}
                onChange={(e) => setCompInitial(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="comp-monthly" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Monthly Capital Injection ($)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>${compMonthly.toLocaleString()}/mo</span>
              </label>
              <input
                id="comp-monthly"
                type="number"
                min={0}
                step={100}
                value={compMonthly}
                onChange={(e) => setCompMonthly(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="comp-growth" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Annual Capital Appreciation Rate (%)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{compGrowthRate}%</span>
              </label>
              <input
                id="comp-growth"
                type="number"
                step={0.25}
                value={compGrowthRate}
                onChange={(e) => setCompGrowthRate(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="comp-dividend" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Annual Dividend Yield (%)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{compDividendYield}%</span>
              </label>
              <input
                id="comp-dividend"
                type="number"
                step={0.1}
                value={compDividendYield}
                onChange={(e) => setCompDividendYield(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>Reinvest Dividends (DRIP):</span>
              <input 
                type="checkbox"
                checked={compReinvestDiv}
                onChange={(e) => setCompReinvestDiv(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label htmlFor="comp-years" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Accumulation Horizon (Years)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{compYears} Years</span>
              </label>
              <input
                id="comp-years"
                type="range"
                min={5}
                max={40}
                step={1}
                value={compYears}
                onChange={(e) => setCompYears(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
              />
            </div>
          </form>
        </div>

        {/* Live Accumulation Results */}
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
              <DollarSign size={18} color="var(--accent-gold)" /> Projected Reserve Capital Wealth
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Final Portfolio Value</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>
                  ${compoundMetrics.finalBalance.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>At Year {compYears}</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Compound Gains Earned</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>
                  +${compoundMetrics.totalInterestEarned.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pure Compounded Interest</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Principal Deposited</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  ${compoundMetrics.totalDeposited.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Your Out-of-Pocket Inflow</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Compounding Ratio</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {((compoundMetrics.finalBalance / Math.max(1, compoundMetrics.totalDeposited))).toFixed(1)}x
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Multiple on Capital Inflow</div>
              </div>
            </div>

            {/* Milestones Card */}
            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Key Trajectory Benchmarks:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                {compoundMetrics.milestones.filter((m) => m.year === 5 || m.year === 10 || m.year === 15 || m.year === 20 || m.year === compYears).map((m) => (
                  <div key={m.year} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px dashed var(--border-subtle)' }}>
                    <span>Year {m.year} Milestone:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      ${m.balance.toLocaleString()} <span style={{ color: 'var(--accent-green)', fontSize: '0.75rem' }}>(+${m.interestEarned.toLocaleString()} growth)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <Info size={14} />
            <span>
              Compound calculation assumes monthly compounding periodicity. Returns do not account for trading commissions or annual advisory drag.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
