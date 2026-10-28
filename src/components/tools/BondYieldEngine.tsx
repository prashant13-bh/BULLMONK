import React, { useState, useMemo } from 'react';
import { Sliders, BarChart2, Copy, Check, Info } from 'lucide-react';

interface BondYieldEngineProps {
  showToast: (msg: string) => void;
}

export const BondYieldEngine: React.FC<BondYieldEngineProps> = ({ showToast }) => {
  const [bondPar, setBondPar] = useState<number>(1000);
  const [bondCoupon, setBondCoupon] = useState<number>(4.25);
  const [bondYtm, setBondYtm] = useState<number>(4.50);
  const [bondYears, setBondYears] = useState<number>(10);
  const [bondShiftBps, setBondShiftBps] = useState<number>(50); // +/- basis points shock
  const [copied, setCopied] = useState(false);

  const bondMetrics = useMemo(() => {
    const couponRate = bondCoupon / 100;
    const ytmRate = bondYtm / 100;
    const annualCoupon = bondPar * couponRate;
    const n = Math.max(1, bondYears);

    // Clean price estimation
    let pvCoupons = 0;
    let macDurationSum = 0;
    for (let t = 1; t <= n; t++) {
      const discount = Math.pow(1 + ytmRate, t);
      const pvCashFlow = (t === n ? annualCoupon + bondPar : annualCoupon) / discount;
      pvCoupons += annualCoupon / discount;
      macDurationSum += (t * (t === n ? annualCoupon + bondPar : annualCoupon)) / discount;
    }
    const pvPrincipal = bondPar / Math.pow(1 + ytmRate, n);
    const cleanPrice = pvCoupons + pvPrincipal;

    const macDuration = cleanPrice > 0 ? macDurationSum / cleanPrice : n;
    const modDuration = macDuration / (1 + ytmRate);
    const convexity = (macDuration * (macDuration + 1)) / Math.pow(1 + ytmRate, 2);

    // Yield shock impact (Duration-Convexity approximation)
    const dy = bondShiftBps / 10000;
    const pctPriceChange = (-modDuration * dy + 0.5 * convexity * Math.pow(dy, 2)) * 100;
    const dollarPriceChange = (cleanPrice * pctPriceChange) / 100;
    const postShockPrice = cleanPrice + dollarPriceChange;

    return {
      annualCoupon,
      cleanPrice: Number(cleanPrice.toFixed(2)),
      currentYield: Number(((annualCoupon / cleanPrice) * 100).toFixed(2)),
      macDuration: Number(macDuration.toFixed(2)),
      modDuration: Number(modDuration.toFixed(2)),
      convexity: Number(convexity.toFixed(2)),
      pctPriceChange: Number(pctPriceChange.toFixed(2)),
      dollarPriceChange: Number(dollarPriceChange.toFixed(2)),
      postShockPrice: Number(postShockPrice.toFixed(2))
    };
  }, [bondPar, bondCoupon, bondYtm, bondYears, bondShiftBps]);

  const setBondPreset = (name: string) => {
    if (name === 'us10y') {
      setBondPar(1000); setBondCoupon(4.25); setBondYtm(4.45); setBondYears(10); setBondShiftBps(50);
      showToast('Loaded US 10-Year Treasury Benchmark');
    } else if (name === 'bund10y') {
      setBondPar(1000); setBondCoupon(2.30); setBondYtm(2.45); setBondYears(10); setBondShiftBps(25);
      showToast('Loaded German 10-Year Bund Profile');
    } else if (name === 'gilt10y') {
      setBondPar(1000); setBondCoupon(4.10); setBondYtm(4.30); setBondYears(10); setBondShiftBps(75);
      showToast('Loaded UK 10-Year Gilt Profile');
    } else if (name === 'em5y') {
      setBondPar(1000); setBondCoupon(7.50); setBondYtm(8.10); setBondYears(5); setBondShiftBps(100);
      showToast('Loaded Emerging Market High-Yield Sovereign Profile');
    }
  };

  const handleCopy = () => {
    const text = `BULLMONK SOVEREIGN BOND ANALYSIS REPORT
Par: $${bondPar} | Coupon: ${bondCoupon}% | YTM: ${bondYtm}% | Horizon: ${bondYears}Y
Clean Price: $${bondMetrics.cleanPrice}
Modified Duration: ${bondMetrics.modDuration} yrs | Macaulay Duration: ${bondMetrics.macDuration} yrs
Convexity: ${bondMetrics.convexity}
Yield Shock (${bondShiftBps > 0 ? '+' : ''}${bondShiftBps} bps): ${bondMetrics.pctPriceChange}% ($${bondMetrics.dollarPriceChange})
Post-Shock Price: $${bondMetrics.postShockPrice}
Generated via BullMonk Financial Intelligence Suite (bullmonk.live)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Bond dossier copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(180, 83, 9, 0.12)', color: 'var(--accent-gold)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <BarChart2 size={14} /> Fixed Income & Sovereign Debt
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>Sovereign Bond Yield & Duration Engine</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '720px', margin: 0 }}>
            Model clean prices, Macaulay & Modified duration, second-order convexity curvature, and basis point yield shock sensitivities across global benchmark sovereigns.
          </p>
        </div>
        <button onClick={handleCopy} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
          {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
          {copied ? 'Dossier Copied' : 'Export Bond Dossier'}
        </button>
      </div>

      {/* Quick Presets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Institutional Benchmarks:
        </span>
        <button type="button" className="btn btn-secondary" style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }} onClick={() => setBondPreset('us10y')}>
          🇺🇸 US 10Y Benchmark (4.45% YTM)
        </button>
        <button type="button" className="btn btn-secondary" style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }} onClick={() => setBondPreset('bund10y')}>
          🇩🇪 German 10Y Bund (2.45% YTM)
        </button>
        <button type="button" className="btn btn-secondary" style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }} onClick={() => setBondPreset('gilt10y')}>
          🇬🇧 UK 10Y Gilt (4.30% YTM)
        </button>
        <button type="button" className="btn btn-secondary" style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }} onClick={() => setBondPreset('em5y')}>
          🌐 EM High Yield 5Y (8.10% YTM)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Input Parameters Box */}
        <div style={{ 
          background: 'var(--bg-surface)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.75rem' 
        }}>
          <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--accent-gold)" /> Terminal Parameters
          </h3>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="bond-par" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Face / Par Value ($)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>${bondPar.toLocaleString()}</span>
              </label>
              <input
                id="bond-par"
                type="number"
                min={100}
                max={1000000}
                step={100}
                value={bondPar}
                onChange={(e) => setBondPar(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="bond-coupon" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Annual Coupon Rate (%)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{bondCoupon}%</span>
              </label>
              <input
                id="bond-coupon"
                type="number"
                step={0.05}
                value={bondCoupon}
                onChange={(e) => setBondCoupon(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="bond-ytm" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Yield to Maturity (YTM %)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{bondYtm}%</span>
              </label>
              <input
                id="bond-ytm"
                type="number"
                step={0.05}
                value={bondYtm}
                onChange={(e) => setBondYtm(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="bond-years" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Tenor / Maturity (Years)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{bondYears} Years</span>
              </label>
              <input
                id="bond-years"
                type="range"
                min={1}
                max={30}
                step={1}
                value={bondYears}
                onChange={(e) => setBondYears(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label htmlFor="bond-shift" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Hypothetical Yield Shock</span>
                <span style={{ color: bondShiftBps > 0 ? '#EF4444' : '#10B981', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {bondShiftBps > 0 ? `+${bondShiftBps}` : bondShiftBps} bps ({bondShiftBps / 100}%)
                </span>
              </label>
              <input
                id="bond-shift"
                type="range"
                min={-200}
                max={200}
                step={10}
                value={bondShiftBps}
                onChange={(e) => setBondShiftBps(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>-200 bps (Dovish Easing)</span>
                <span>0 bps</span>
                <span>+200 bps (Hawkish Tightening)</span>
              </div>
            </div>
          </form>
        </div>

        {/* Live Analytics Dashboard */}
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
              <BarChart2 size={18} color="var(--accent-gold)" /> Forensic Bond Pricing & Sensitivity
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Clean Bond Price</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>${bondMetrics.cleanPrice}</div>
                <div style={{ fontSize: '0.72rem', color: bondMetrics.cleanPrice >= bondPar ? '#10B981' : '#EF4444' }}>
                  {bondMetrics.cleanPrice >= bondPar ? 'Trading at Premium' : 'Trading at Discount'}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Current Yield</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>{bondMetrics.currentYield}%</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Coupon: ${bondMetrics.annualCoupon}/yr</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Modified Duration</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{bondMetrics.modDuration} yrs</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Macaulay: {bondMetrics.macDuration} yrs</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Convexity Measure</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{bondMetrics.convexity}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Curvature Cushion</div>
              </div>
            </div>

            {/* Yield Shock Forensic Box */}
            <div style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-medium)', 
              borderLeft: `4px solid ${bondShiftBps > 0 ? '#EF4444' : '#10B981'}`,
              borderRadius: 'var(--radius-sm)', 
              padding: '1.25rem', 
              marginBottom: '1rem' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>
                  Portfolio Impact for {bondShiftBps > 0 ? `+${bondShiftBps}` : bondShiftBps} bps Shock:
                </span>
                <span style={{ 
                  fontSize: '1.15rem', 
                  fontWeight: 800, 
                  fontFamily: 'var(--font-mono)', 
                  color: bondMetrics.pctPriceChange >= 0 ? '#10B981' : '#EF4444' 
                }}>
                  {bondMetrics.pctPriceChange >= 0 ? `+${bondMetrics.pctPriceChange}%` : `${bondMetrics.pctPriceChange}%`}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Capital change of <strong>{bondMetrics.dollarPriceChange >= 0 ? `+$${bondMetrics.dollarPriceChange}` : `-$${Math.abs(bondMetrics.dollarPriceChange)}`}</strong> per bond. Estimated post-shock price: <strong>${bondMetrics.postShockPrice}</strong>.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <Info size={14} />
            <span>
              Calculations use standard second-order Taylor series duration & convexity expansion. Actual market settlement may vary based on day-count conventions (30/360 vs Actual/Actual).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
