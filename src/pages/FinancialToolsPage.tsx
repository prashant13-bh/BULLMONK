import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdBanner } from '../components/AdBanner';
import { 
  Calculator, TrendingUp, ShieldAlert, DollarSign, Percent, 
  ArrowRight, RefreshCw, Copy, Check, BarChart2, Globe, 
  Sliders, Layers, ArrowUpRight, ArrowDownRight, Clock, Info, ShieldCheck
} from 'lucide-react';

interface FinancialToolsPageProps {
  setCurrentPage: (page: any) => void;
  showToast: (msg: string) => void;
  initialTab?: 'bond' | 'inflation' | 'fx' | 'compound';
}

export const FinancialToolsPage: React.FC<FinancialToolsPageProps> = ({
  setCurrentPage,
  showToast,
  initialTab = 'bond'
}) => {
  const [activeTab, setActiveTab] = useState<'bond' | 'inflation' | 'fx' | 'compound'>(initialTab);
  const [copied, setCopied] = useState(false);

  // -------------------------------------------------------------
  // TOOL 1: SOVEREIGN BOND YIELD & DURATION ENGINE
  // -------------------------------------------------------------
  const [bondPar, setBondPar] = useState<number>(1000);
  const [bondCoupon, setBondCoupon] = useState<number>(4.25);
  const [bondYtm, setBondYtm] = useState<number>(4.50);
  const [bondYears, setBondYears] = useState<number>(10);
  const [bondShiftBps, setBondShiftBps] = useState<number>(50); // +/- basis points shock

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

  // Bond Presets
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

  // -------------------------------------------------------------
  // TOOL 2: INFLATION-ADJUSTED REAL WEALTH FORECASTER
  // -------------------------------------------------------------
  const [infPrincipal, setInfPrincipal] = useState<number>(100000);
  const [infNominalReturn, setInfNominalReturn] = useState<number>(9.5);
  const [infCpiRate, setInfCpiRate] = useState<number>(3.2);
  const [infTaxRate, setInfTaxRate] = useState<number>(15);
  const [infHorizonYears, setInfHorizonYears] = useState<number>(15);

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

    // Yearly trajectory data for SVG sparkline
    const yearlyData: { year: number; nominal: number; real: number }[] = [];
    for (let yr = 0; yr <= n; yr++) {
      yearlyData.push({
        year: yr,
        nominal: Math.round(p * Math.pow(1 + afterTaxR, yr)),
        real: Math.round(p * Math.pow(1 + realReturnRate, yr))
      });
    }

    return {
      nominalPreTaxFinal: Math.round(nominalPreTaxFinal),
      nominalAfterTaxFinal: Math.round(nominalAfterTaxFinal),
      realPurchasingPowerFinal: Math.round(realPurchasingPowerFinal),
      taxDrag: Math.round(taxDrag),
      inflationDrag: Math.round(inflationDrag),
      realCAGR: Number((realReturnRate * 100).toFixed(2)),
      yearlyData
    };
  }, [infPrincipal, infNominalReturn, infCpiRate, infTaxRate, infHorizonYears]);

  // -------------------------------------------------------------
  // TOOL 3: GLOBAL FX ARBITRAGE & PPP VALUATION MATRIX
  // -------------------------------------------------------------
  const [fxAmount, setFxAmount] = useState<number>(10000);
  const [fxBase, setFxBase] = useState<string>('USD');
  const [fxTarget, setFxTarget] = useState<string>('EUR');

  // Benchmark exchange rates vs USD
  const fxRates: Record<string, { rateVsUsd: number; pppImplied: number; name: string; flag: string; centralBank: string; policyRate: number; cpi: number }> = {
    USD: { rateVsUsd: 1.0, pppImplied: 1.0, name: 'US Dollar', flag: '🇺🇸', centralBank: 'Federal Reserve', policyRate: 4.875, cpi: 2.8 },
    EUR: { rateVsUsd: 0.92, pppImplied: 0.84, name: 'Euro', flag: '🇪🇺', centralBank: 'European Central Bank', policyRate: 3.25, cpi: 2.2 },
    GBP: { rateVsUsd: 0.77, pppImplied: 0.71, name: 'British Pound', flag: '🇬🇧', centralBank: 'Bank of England', policyRate: 4.75, cpi: 2.4 },
    INR: { rateVsUsd: 84.15, pppImplied: 24.50, name: 'Indian Rupee', flag: '🇮🇳', centralBank: 'Reserve Bank of India', policyRate: 6.50, cpi: 4.8 },
    JPY: { rateVsUsd: 153.20, pppImplied: 108.0, name: 'Japanese Yen', flag: '🇯🇵', centralBank: 'Bank of Japan', policyRate: 0.25, cpi: 2.5 },
    CHF: { rateVsUsd: 0.87, pppImplied: 1.15, name: 'Swiss Franc', flag: '🇨🇭', centralBank: 'Swiss National Bank', policyRate: 1.00, cpi: 1.1 },
    CAD: { rateVsUsd: 1.39, pppImplied: 1.25, name: 'Canadian Dollar', flag: '🇨🇦', centralBank: 'Bank of Canada', policyRate: 3.75, cpi: 2.0 },
    AUD: { rateVsUsd: 1.52, pppImplied: 1.40, name: 'Australian Dollar', flag: '🇦🇺', centralBank: 'Reserve Bank of Australia', policyRate: 4.35, cpi: 2.8 },
  };

  const fxConversion = useMemo(() => {
    const baseObj = fxRates[fxBase] || fxRates.USD;
    const targetObj = fxRates[fxTarget] || fxRates.EUR;

    // Direct exchange rate
    const directRate = (1 / baseObj.rateVsUsd) * targetObj.rateVsUsd;
    const convertedAmount = fxAmount * directRate;

    // Implied PPP exchange rate
    const pppRate = (1 / baseObj.pppImplied) * targetObj.pppImplied;
    // Valuation differential %: ((Market Rate - PPP Rate) / PPP Rate) * 100
    const valuationDiff = ((directRate - pppRate) / pppRate) * 100;

    // Real policy rate differential
    const baseRealRate = baseObj.policyRate - baseObj.cpi;
    const targetRealRate = targetObj.policyRate - targetObj.cpi;
    const realRateSpread = targetRealRate - baseRealRate;

    return {
      directRate: Number(directRate.toFixed(4)),
      convertedAmount: Number(convertedAmount.toFixed(2)),
      pppRate: Number(pppRate.toFixed(4)),
      valuationDiff: Number(valuationDiff.toFixed(2)),
      isOvervalued: valuationDiff > 0,
      baseRealRate: Number(baseRealRate.toFixed(2)),
      targetRealRate: Number(targetRealRate.toFixed(2)),
      realRateSpread: Number(realRateSpread.toFixed(2))
    };
  }, [fxAmount, fxBase, fxTarget]);

  // -------------------------------------------------------------
  // TOOL 4: COMPOUND CAPITAL & SOVEREIGN RESERVE FORECASTER
  // -------------------------------------------------------------
  const [compInitial, setCompInitial] = useState<number>(50000);
  const [compMonthly, setCompMonthly] = useState<number>(1500);
  const [compGrowthRate, setCompGrowthRate] = useState<number>(8.5);
  const [compDividendYield, setCompDividendYield] = useState<number>(2.0);
  const [compReinvestDiv, setCompReinvestDiv] = useState<boolean>(true);
  const [compYears, setCompYears] = useState<number>(20);

  const compoundMetrics = useMemo(() => {
    const p = Math.max(0, compInitial);
    const pmt = Math.max(0, compMonthly);
    const effectiveAnnualRate = (compGrowthRate + (compReinvestDiv ? compDividendYield : 0)) / 100;
    const monthlyRate = effectiveAnnualRate / 12;
    const totalMonths = compYears * 12;

    let balance = p;
    let totalDeposited = p;
    const yearlyBreakdown: { year: number; balance: number; deposits: number; interest: number }[] = [];

    for (let m = 1; m <= totalMonths; m++) {
      balance = balance * (1 + monthlyRate) + pmt;
      totalDeposited += pmt;

      if (m % 12 === 0) {
        const year = m / 12;
        yearlyBreakdown.push({
          year,
          balance: Math.round(balance),
          deposits: Math.round(totalDeposited),
          interest: Math.round(balance - totalDeposited)
        });
      }
    }

    const totalInterestEarned = balance - totalDeposited;

    // Milestones
    const milestones = [
      { target: 250000, label: '$250K Liquid Reserve' },
      { target: 500000, label: '$500K Institutional Tier' },
      { target: 1000000, label: '$1.0M Sovereign Portfolio' },
      { target: 2500000, label: '$2.5M Endowment Milestone' }
    ].map(m => {
      const hitYear = yearlyBreakdown.find(y => y.balance >= m.target)?.year;
      return {
        ...m,
        yearAchieved: hitYear ? `Year ${hitYear}` : `Beyond ${compYears}Y`
      };
    });

    return {
      finalBalance: Math.round(balance),
      totalDeposited: Math.round(totalDeposited),
      totalInterestEarned: Math.round(totalInterestEarned),
      yearlyBreakdown,
      milestones
    };
  }, [compInitial, compMonthly, compGrowthRate, compDividendYield, compReinvestDiv, compYears]);

  // Copy Summary to Clipboard
  const handleCopySummary = () => {
    let summaryText = '';
    if (activeTab === 'bond') {
      summaryText = `BULLMONK SOVEREIGN BOND ANALYSIS REPORT
Par: $${bondPar} | Coupon: ${bondCoupon}% | YTM: ${bondYtm}% | Horizon: ${bondYears}Y
Clean Price: $${bondMetrics.cleanPrice}
Modified Duration: ${bondMetrics.modDuration} yrs | Macaulay Duration: ${bondMetrics.macDuration} yrs
Convexity: ${bondMetrics.convexity}
Yield Shock (${bondShiftBps > 0 ? '+' : ''}${bondShiftBps} bps): ${bondMetrics.pctPriceChange}% ($${bondMetrics.dollarPriceChange})
Post-Shock Price: $${bondMetrics.postShockPrice}
Generated via BullMonk Financial Intelligence Suite (bullmonk.org)`;
    } else if (activeTab === 'inflation') {
      summaryText = `BULLMONK REAL PURCHASING POWER FORECAST
Principal: $${infPrincipal.toLocaleString()} | Horizon: ${infHorizonYears} Years
Gross Return: ${infNominalReturn}% | CPI Inflation: ${infCpiRate}% | Tax Drag: ${infTaxRate}%
Nominal Pre-Tax Value: $${inflationMetrics.nominalPreTaxFinal.toLocaleString()}
Nominal After-Tax Value: $${inflationMetrics.nominalAfterTaxFinal.toLocaleString()}
Real Purchasing Power: $${inflationMetrics.realPurchasingPowerFinal.toLocaleString()}
Inflation Drag (Purchasing Power Lost): $${inflationMetrics.inflationDrag.toLocaleString()}
Tax Drag: $${inflationMetrics.taxDrag.toLocaleString()}
Effective Real Annualized CAGR: ${inflationMetrics.realCAGR}%
Generated via BullMonk Financial Intelligence Suite (bullmonk.org)`;
    } else if (activeTab === 'fx') {
      summaryText = `BULLMONK FX ARBITRAGE & PPP VALUATION DOSSIER
Exchange: ${fxAmount.toLocaleString()} ${fxBase} ➔ ${fxConversion.convertedAmount.toLocaleString()} ${fxTarget}
Spot Rate: 1 ${fxBase} = ${fxConversion.directRate} ${fxTarget}
Implied PPP Benchmark Rate: 1 ${fxBase} = ${fxConversion.pppRate} ${fxTarget}
Valuation Assessment: ${fxTarget} is ${Math.abs(fxConversion.valuationDiff)}% ${fxConversion.isOvervalued ? 'OVERVALUED' : 'UNDERVALUED'} vs ${fxBase}
Real Policy Rate Spread: ${fxConversion.realRateSpread}%
Generated via BullMonk Financial Intelligence Suite (bullmonk.org)`;
    } else {
      summaryText = `BULLMONK COMPOUND CAPITAL FORECAST
Starting Capital: $${compInitial.toLocaleString()} | Monthly Addition: $${compMonthly.toLocaleString()}
Duration: ${compYears} Years | Net Compounding Rate: ${(compGrowthRate + (compReinvestDiv ? compDividendYield : 0)).toFixed(1)}%
Final Portfolio Value: $${compoundMetrics.finalBalance.toLocaleString()}
Total Capital Deposited: $${compoundMetrics.totalDeposited.toLocaleString()}
Total Compound Growth Earned: $${compoundMetrics.totalInterestEarned.toLocaleString()}
Generated via BullMonk Financial Intelligence Suite (bullmonk.org)`;
    }

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    showToast('Analytical Dossier copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
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
            <Calculator size={13} /> INSTITUTIONAL QUANTITATIVE SUITE
          </span>
          <span style={{ fontSize: '0.76rem', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.06em' }}>
            REAL-TIME FORENSICS • 0% LATENCY
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            <ShieldCheck size={14} color="var(--accent-green)" /> Fiduciary Algorithm Verified
          </span>
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-brand)', 
          fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', 
          letterSpacing: '-0.02em', 
          lineHeight: '1.15',
          marginBottom: '0.85rem'
        }}>
          Financial Intelligence & Macro Calculators
        </h1>

        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)', 
          maxWidth: '820px', 
          lineHeight: '1.6' 
        }}>
          Institutional-grade computational engines for sovereign bond duration sensitivity, monetary inflation drag, purchasing power parity (PPP) foreign exchange deviations, and multi-decade reserve accumulation.
        </p>

        {/* Action Tools Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleCopySummary}
            style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
          >
            {copied ? <Check size={14} color="var(--accent-green)" /> : <Copy size={14} />}
            <span>{copied ? 'Dossier Copied' : 'Export Calculation Dossier'}</span>
          </button>

          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Selected Engine: <strong>{activeTab === 'bond' ? 'Sovereign Bond Terminal' : activeTab === 'inflation' ? 'Real Inflation Forecaster' : activeTab === 'fx' ? 'FX & PPP Matrix' : 'Compound Capital Forecaster'}</strong>
          </span>
        </div>
      </header>

      {/* Responsive AdSense Placement */}
      <div className="hide-on-mobile" style={{ marginBottom: '2rem' }}>
        <AdBanner slotType="leaderboard" slotId="tools-top-leaderboard" />
      </div>

      {/* Tool Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        overflowX: 'auto', 
        paddingBottom: '0.5rem', 
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('bond')}
          className={`cat-tab ${activeTab === 'bond' ? 'active' : ''}`}
          style={{ fontSize: '0.85rem', padding: '0.65rem 1.1rem', whiteSpace: 'nowrap' }}
        >
          <BarChart2 size={15} />
          <span>1. Sovereign Bond & Duration</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inflation')}
          className={`cat-tab ${activeTab === 'inflation' ? 'active' : ''}`}
          style={{ fontSize: '0.85rem', padding: '0.65rem 1.1rem', whiteSpace: 'nowrap' }}
        >
          <TrendingUp size={15} />
          <span>2. Inflation Drag & Real CAGR</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fx')}
          className={`cat-tab ${activeTab === 'fx' ? 'active' : ''}`}
          style={{ fontSize: '0.85rem', padding: '0.65rem 1.1rem', whiteSpace: 'nowrap' }}
        >
          <Globe size={15} />
          <span>3. FX Arbitrage & PPP Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compound')}
          className={`cat-tab ${activeTab === 'compound' ? 'active' : ''}`}
          style={{ fontSize: '0.85rem', padding: '0.65rem 1.1rem', whiteSpace: 'nowrap' }}
        >
          <Layers size={15} />
          <span>4. Compound Capital Forecaster</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 1. SOVEREIGN BOND ENGINE TAB */}
      {/* ============================================================ */}
      {activeTab === 'bond' && (
        <section style={{ animation: 'fadeIn 0.25s ease' }}>
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
              <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="var(--accent-gold)" /> Terminal Parameters
              </h2>

              <form 
                toolname="bond_duration_calculator"
                tooldescription="Calculate sovereign bond duration, convexity, and hypothetical yield shocks"
                data-webmcp-tool="bond_duration_calculator"
                data-webmcp-description="Calculate sovereign bond duration, convexity, and hypothetical yield shocks"
                onSubmit={(e) => e.preventDefault()}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
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
                <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart2 size={18} color="var(--accent-gold)" /> Forensic Bond Pricing & Sensitivity
                </h2>

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

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                Note: Calculations use standard analytical second-order Taylor series duration & convexity expansion. Actual market settlement may vary based on day-count conventions (30/360 vs Actual/Actual).
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 2. INFLATION DRAG & REAL RETURN TAB */}
      {/* ============================================================ */}
      {activeTab === 'inflation' && (
        <section style={{ animation: 'fadeIn 0.25s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Inputs Box */}
            <div style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-medium)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.75rem' 
            }}>
              <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="var(--accent-gold)" /> Portfolio & Inflation Parameters
              </h2>

              <form 
                toolname="inflation_drag_calculator"
                tooldescription="Calculate real capital purchasing power net of inflation drag and capital taxes"
                data-webmcp-tool="inflation_drag_calculator"
                data-webmcp-description="Calculate real capital purchasing power net of inflation drag and capital taxes"
                onSubmit={(e) => e.preventDefault()}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
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
                <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} color="var(--accent-gold)" /> Purchasing Power & Monetary Debasement Audit
                </h2>

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

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                Note: Uses standard macroeconomic Fisher Equation for inflation adjustment. Real returns do not guarantee future sovereign liquidity or sovereign currency peg sustainability.
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 3. FX ARBITRAGE & PPP MATRIX TAB */}
      {/* ============================================================ */}
      {activeTab === 'fx' && (
        <section style={{ animation: 'fadeIn 0.25s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            
            {/* Interactive Currency Conversion */}
            <div style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-medium)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.75rem' 
            }}>
              <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} color="var(--accent-gold)" /> Cross-Border FX Remittance & Arbitrage
              </h2>

              <form 
                toolname="fx_remittance_calculator"
                tooldescription="Calculate cross-border foreign exchange conversion, spreads, and purchasing power parity"
                data-webmcp-tool="fx_remittance_calculator"
                data-webmcp-description="Calculate cross-border foreign exchange conversion, spreads, and purchasing power parity"
                onSubmit={(e) => e.preventDefault()}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
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
                <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart2 size={18} color="var(--accent-gold)" /> Purchasing Power Parity (PPP) Valuation
                </h2>

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

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                Note: Implied PPP rates derived from OECD benchmark price indices and Big Mac PPP forensic studies.
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
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-medium)', textAlign: 'left' }}>
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
        </section>
      )}

      {/* ============================================================ */}
      {/* 4. COMPOUND CAPITAL FORECASTER TAB */}
      {/* ============================================================ */}
      {activeTab === 'compound' && (
        <section style={{ animation: 'fadeIn 0.25s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Input Controls */}
            <div style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-medium)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.75rem' 
            }}>
              <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--accent-gold)" /> Compound Accumulation Setup
              </h2>

              <form 
                toolname="compound_capital_calculator"
                tooldescription="Forecast sovereign compound capital growth and periodic institutional allocations"
                data-webmcp-tool="compound_capital_calculator"
                data-webmcp-description="Forecast sovereign compound capital growth and periodic institutional allocations"
                onSubmit={(e) => e.preventDefault()}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
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
                <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={18} color="var(--accent-gold)" /> Projected Reserve Capital Wealth
                </h2>

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
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.75rem' }}>Institutional Wealth Milestones:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {compoundMetrics.milestones.map((m, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                        <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: m.yearAchieved.includes('Year') ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                          {m.yearAchieved}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                Note: Assumes monthly compounding intervals and stable capital reinvestment. Market volatility and asset drawdown risk are not modeled in static compound approximations.
              </div>
            </div>

          </div>
        </section>
      )}

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
          The calculators, duration sensitivity matrices, inflation models, and currency arbitrage engines provided in this BullMonk Quantitative Suite are intended exclusively for academic, informational, and journalistic reference. BULLMONK does not provide personal financial advisory, asset custody, broker-dealer execution, or fiduciary guidance. Past historical returns or mathematical duration calculations do not guarantee future sovereign debt performance or currency stability. Consult an accredited CFA/fiduciary prior to executing transactions.
        </p>
      </div>
    </main>
  );
};
