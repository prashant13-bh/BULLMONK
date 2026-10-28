import React, { useState, useMemo } from 'react';
import { GitCompare, Activity, Copy, Check, ShieldCheck, ArrowRight, Info } from 'lucide-react';

interface TreasuryBasisArbitrageProps {
  showToast: (msg: string) => void;
}

export const TreasuryBasisArbitrage: React.FC<TreasuryBasisArbitrageProps> = ({ showToast }) => {
  const [cashPrice, setCashPrice] = useState<number>(99.45);
  const [futuresPrice, setFuturesPrice] = useState<number>(108.20);
  const [conversionFactor, setConversionFactor] = useState<number>(0.9142);
  const [daysToDelivery, setDaysToDelivery] = useState<number>(45);
  const [sofrRate, setSofrRate] = useState<number>(4.85); // %
  const [couponRate, setCouponRate] = useState<number>(4.25); // %
  const [copied, setCopied] = useState(false);

  // Benchmarks
  const loadPreset = (preset: 'zn10' | 'tn10u' | 'zb30' | 'zf5') => {
    if (preset === 'zn10') {
      setCashPrice(99.45); setFuturesPrice(108.20); setConversionFactor(0.9142); setDaysToDelivery(45); setCouponRate(4.25);
      showToast('Loaded 10Y Benchmark (ZN Futures) Basis');
    } else if (preset === 'tn10u') {
      setCashPrice(112.30); setFuturesPrice(122.50); setConversionFactor(0.9120); setDaysToDelivery(50); setCouponRate(4.50);
      showToast('Loaded Ultra 10Y (TN Futures) Basis');
    } else if (preset === 'zb30') {
      setCashPrice(96.80); setFuturesPrice(118.60); setConversionFactor(0.8125); setDaysToDelivery(60); setCouponRate(4.625);
      showToast('Loaded 30Y Long Bond (ZB Futures) Basis');
    } else if (preset === 'zf5') {
      setCashPrice(101.10); setFuturesPrice(106.85); setConversionFactor(0.9450); setDaysToDelivery(30); setCouponRate(4.00);
      showToast('Loaded 5Y Note (ZF Futures) Basis');
    }
  };

  const metrics = useMemo(() => {
    const impliedInvoice = futuresPrice * conversionFactor;
    const grossBasis = cashPrice - impliedInvoice;
    const grossBasisBps = grossBasis * 100;
    const days = Math.max(1, daysToDelivery);
    const dailyCouponIncome = (cashPrice * (couponRate / 100) / 365) * days;
    const financingCost = (cashPrice * (sofrRate / 100) / 360) * days;
    const netCarry = dailyCouponIncome - financingCost;
    const netBasis = grossBasis - netCarry;
    const netBasisBps = netBasis * 100;

    // Implied Repo Rate (IRR) annualized (Act/360)
    const irr = ((impliedInvoice + dailyCouponIncome - cashPrice) / cashPrice) * (360 / days) * 100;
    const spreadVsSofrBps = (irr - sofrRate) * 100;

    let tradeSignal = 'Fair Value Equilibrium';
    let signalColor = 'var(--text-muted)';
    if (spreadVsSofrBps > 8) {
      tradeSignal = 'Long Cash / Short Futures (Positive Basis Arbitrage)';
      signalColor = 'var(--accent-green)';
    } else if (spreadVsSofrBps < -8) {
      tradeSignal = 'Short Cash / Long Futures (Reverse Basis Squeeze)';
      signalColor = 'var(--accent-red)';
    }

    return {
      impliedInvoice: Number(impliedInvoice.toFixed(3)),
      grossBasis: Number(grossBasis.toFixed(3)),
      grossBasisBps: Math.round(grossBasisBps),
      netBasis: Number(netBasis.toFixed(3)),
      netBasisBps: Math.round(netBasisBps),
      dailyCouponIncome: Number(dailyCouponIncome.toFixed(2)),
      financingCost: Number(financingCost.toFixed(2)),
      irr: Number(irr.toFixed(2)),
      spreadVsSofrBps: Math.round(spreadVsSofrBps),
      tradeSignal,
      signalColor
    };
  }, [cashPrice, futuresPrice, conversionFactor, daysToDelivery, sofrRate, couponRate]);

  const handleCopy = () => {
    const text = `BULLMONK TREASURY BASIS & REPO ARBITRAGE REPORT
Cash Price: ${cashPrice} | Futures Price: ${futuresPrice} (CF: ${conversionFactor})
Horizon: ${daysToDelivery} Days | SOFR Financing Rate: ${sofrRate}% | Coupon: ${couponRate}%
Gross Basis: ${metrics.grossBasis} (${metrics.grossBasisBps} bps)
Net Basis: ${metrics.netBasis} (${metrics.netBasisBps} bps)
Implied Repo Rate (IRR): ${metrics.irr}%
Spread vs SOFR: ${metrics.spreadVsSofrBps > 0 ? '+' : ''}${metrics.spreadVsSofrBps} bps
Arbitrage Recommendation: ${metrics.tradeSignal}
Generated via BullMonk Financial Intelligence Suite (bullmonk.live)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Basis Arbitrage Dossier copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section style={{ animation: 'fadeIn 0.25s ease' }}>
      {/* Benchmark Presets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Futures Delivery Contracts:
        </span>
        <button
          type="button"
          onClick={() => loadPreset('zn10')}
          style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-medium)', background: 'var(--bg-surface)', cursor: 'pointer' }}
        >
          10Y Note (ZN)
        </button>
        <button
          type="button"
          onClick={() => loadPreset('tn10u')}
          style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-medium)', background: 'var(--bg-surface)', cursor: 'pointer' }}
        >
          Ultra 10Y (TN)
        </button>
        <button
          type="button"
          onClick={() => loadPreset('zb30')}
          style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-medium)', background: 'var(--bg-surface)', cursor: 'pointer' }}
        >
          30Y Bond (ZB)
        </button>
        <button
          type="button"
          onClick={() => loadPreset('zf5')}
          style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-medium)', background: 'var(--bg-surface)', cursor: 'pointer' }}
        >
          5Y Note (ZF)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Input Parameters Card */}
        <div className="card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitCompare size={18} color="var(--accent-gold)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Basis Trade Parameters</h2>
            </div>
            <span className="badge" style={{ background: 'rgba(4, 120, 87, 0.1)', color: 'var(--accent-green)', fontSize: '0.72rem', fontWeight: 700 }}>
              Fixed Income Arbitrage
            </span>
          </div>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="tb-cash-price" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Cash Treasury Clean Price</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{cashPrice}</span>
              </label>
              <input
                id="tb-cash-price"
                type="number"
                step={0.05}
                value={cashPrice}
                onChange={(e) => setCashPrice(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="tb-fut-price" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Futures Contract Quote Price</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{futuresPrice}</span>
              </label>
              <input
                id="tb-fut-price"
                type="number"
                step={0.05}
                value={futuresPrice}
                onChange={(e) => setFuturesPrice(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="tb-cf-input" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>CME Conversion Factor (CF)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{conversionFactor}</span>
              </label>
              <input
                id="tb-cf-input"
                type="number"
                step={0.0001}
                value={conversionFactor}
                onChange={(e) => setConversionFactor(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="tb-days-input" style={{ fontSize: '0.84rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                  Days to Delivery
                </label>
                <input
                  id="tb-days-input"
                  type="number"
                  min={1}
                  max={180}
                  value={daysToDelivery}
                  onChange={(e) => setDaysToDelivery(Number(e.target.value))}
                  className="form-control"
                />
              </div>

              <div>
                <label htmlFor="tb-coupon-input" style={{ fontSize: '0.84rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                  Coupon Rate (%)
                </label>
                <input
                  id="tb-coupon-input"
                  type="number"
                  step={0.05}
                  value={couponRate}
                  onChange={(e) => setCouponRate(Number(e.target.value))}
                  className="form-control"
                />
              </div>
            </div>

            <div>
              <label htmlFor="tb-sofr-input" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>SOFR Overnight Financing Rate (%)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{sofrRate}%</span>
              </label>
              <input
                id="tb-sofr-input"
                type="number"
                step={0.05}
                value={sofrRate}
                onChange={(e) => setSofrRate(Number(e.target.value))}
                className="form-control"
              />
            </div>
          </form>
        </div>

        {/* Analytics Card */}
        <div className="card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-surface-elevated) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="var(--accent-green)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Arbitrage Spread Analytics</h2>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 600 }}>
              <ShieldCheck size={14} /> CME Standard Pricing Model
            </span>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.3rem' }}>
              Execution Strategy Signal
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: metrics.signalColor }}>
              {metrics.tradeSignal}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
              Implied Repo Rate: <strong>{metrics.irr}%</strong> vs SOFR Repo <strong>{sofrRate}%</strong>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Gross Basis</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                {metrics.grossBasis}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{metrics.grossBasisBps} bps</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Net Basis (BNOC)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: metrics.netBasisBps >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {metrics.netBasisBps} <span style={{ fontSize: '0.8rem' }}>bps</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Basis Net of Carry</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Arbitrage Spread</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: metrics.spreadVsSofrBps >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {metrics.spreadVsSofrBps > 0 ? '+' : ''}{metrics.spreadVsSofrBps} <span style={{ fontSize: '0.8rem' }}>bps</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Spread Over SOFR</div>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Futures invoice price settles at <strong>{metrics.impliedInvoice}</strong>. Holding this bond to delivery collects <strong>${metrics.dailyCouponIncome}</strong> coupon accrual against <strong>${metrics.financingCost}</strong> in overnight SOFR repo interest.
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCopy}
            style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
          >
            {copied ? <Check size={14} color="var(--accent-green)" /> : <Copy size={14} />}
            <span>{copied ? 'Dossier Copied' : 'Export Basis Arbitrage Report'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
