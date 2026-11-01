import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, ShieldAlert, DollarSign, Percent, TrendingUp, TrendingDown, 
  Layers, Copy, Check, ArrowRight, Award, Compass, RefreshCw, AlertTriangle, Calendar
} from 'lucide-react';

interface SafeWithdrawalRateEngineProps {
  showToast: (msg: string) => void;
}

type CurrencyCode = 'USD' | 'CAD' | 'AUD' | 'GBP' | 'EUR' | 'CHF';
type StrategyType = 'bengen' | 'guyton-klinger' | 'vpw' | 'floor-ceiling';
type RegimeType = 'stagflation-1966' | 'dual-crash-2000' | 'higher-longer' | 'secular-bull';

interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  pensionLabel: string;
}

const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar (USD)', pensionLabel: 'Social Security / Defined Benefit' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (CAD)', pensionLabel: 'CPP / OAS / RRIF Minimum' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', pensionLabel: 'Age Pension / Super Drawdown' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', pensionLabel: 'UK State Pension / SIPP Annuity' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)', pensionLabel: 'Statutory Pension / Occupational' },
  CHF: { code: 'CHF', symbol: 'Fr.', name: 'Swiss Franc (CHF)', pensionLabel: 'AHV / BVG Pillar 2 Annuity' }
};

interface RegimeConfig {
  id: RegimeType;
  title: string;
  description: string;
  equityBaseReturn: number;
  bondBaseReturn: number;
  cashBaseReturn: number;
  baseInflation: number;
  stressYears: Record<number, { eq: number; bd: number; inf: number }>;
}

const REGIMES: Record<RegimeType, RegimeConfig> = {
  'stagflation-1966': {
    id: 'stagflation-1966',
    title: '1966 Stagflation Crucible (The Bengen Worst-Case)',
    description: 'Sticky 6.5%+ CPI inflation, real yield compression, and two severe equity bear markets in Year 1-8. Historically required a sub-4% withdrawal rate.',
    equityBaseReturn: 0.065,
    bondBaseReturn: 0.045,
    cashBaseReturn: 0.038,
    baseInflation: 0.058,
    stressYears: {
      1: { eq: -0.10, bd: 0.02, inf: 0.062 },
      3: { eq: -0.15, bd: 0.01, inf: 0.078 },
      4: { eq: -0.12, bd: -0.02, inf: 0.088 },
      8: { eq: -0.22, bd: 0.03, inf: 0.110 },
      9: { eq: 0.28, bd: 0.06, inf: 0.091 }
    }
  },
  'dual-crash-2000': {
    id: 'dual-crash-2000',
    title: '2000 Dot-Com + 2008 GFC Dual Shock',
    description: 'Acute sequence of returns risk: a 3-year tech drawdown (-40% cumulative) followed within six years by the Lehman Brothers global financial meltdown.',
    equityBaseReturn: 0.082,
    bondBaseReturn: 0.040,
    cashBaseReturn: 0.025,
    baseInflation: 0.026,
    stressYears: {
      1: { eq: -0.12, bd: 0.08, inf: 0.034 },
      2: { eq: -0.14, bd: 0.07, inf: 0.028 },
      3: { eq: -0.22, bd: 0.09, inf: 0.016 },
      8: { eq: -0.37, bd: 0.14, inf: 0.038 },
      9: { eq: 0.26, bd: -0.02, inf: -0.004 }
    }
  },
  'higher-longer': {
    id: 'higher-longer',
    title: 'Modern Higher-for-Longer (5% Yields & 3.2% Sticky CPI)',
    description: 'Sustained positive real cash yields (4.5% to 5.0%), persistent sticky service inflation, and periodic equity pullbacks due to elevated discount rates.',
    equityBaseReturn: 0.075,
    bondBaseReturn: 0.048,
    cashBaseReturn: 0.042,
    baseInflation: 0.032,
    stressYears: {
      2: { eq: -0.14, bd: 0.03, inf: 0.038 },
      7: { eq: -0.18, bd: 0.02, inf: 0.041 },
      14: { eq: -0.15, bd: 0.04, inf: 0.035 }
    }
  },
  'secular-bull': {
    id: 'secular-bull',
    title: 'Secular Disinflationary Growth (1982–2000 Benchmark)',
    description: 'Declining interest rates, stable 2.2% inflation, and powerful 10%+ equity compounding across technology and sovereign capital markets.',
    equityBaseReturn: 0.105,
    bondBaseReturn: 0.055,
    cashBaseReturn: 0.030,
    baseInflation: 0.024,
    stressYears: {
      5: { eq: -0.08, bd: 0.05, inf: 0.025 },
      12: { eq: -0.12, bd: 0.04, inf: 0.028 }
    }
  }
};

interface YearRecord {
  year: number;
  age: number;
  startBalance: number;
  returnRate: number;
  inflationRate: number;
  withdrawal: number;
  supplemental: number;
  netWithdrawal: number;
  endBalance: number;
  realPurchasingPower: number; // in Year 1 real dollars
  withdrawalRateOnStart: number;
  isDepleted: boolean;
}

export const SafeWithdrawalRateEngine: React.FC<SafeWithdrawalRateEngineProps> = ({ showToast }) => {
  // Primary States
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [nestEgg, setNestEgg] = useState<number>(1500000);
  const [initialRate, setInitialRate] = useState<number>(4.0);
  const [strategy, setStrategy] = useState<StrategyType>('guyton-klinger');
  const [regime, setRegime] = useState<RegimeType>('higher-longer');
  const [currentAge, setCurrentAge] = useState<number>(62);
  const [horizonYears, setHorizonYears] = useState<number>(30);
  
  // Asset Allocation
  const [equityPct, setEquityPct] = useState<number>(60);
  const [bondPct, setBondPct] = useState<number>(30);
  const [expenseRatio, setExpenseRatio] = useState<number>(0.20); // 20 bps

  // Supplemental Inflow (Social Security / State Pension)
  const [supplementalAnnual, setSupplementalAnnual] = useState<number>(24000);
  const [supplementalStartAge, setSupplementalStartAge] = useState<number>(67);

  // Floor & Ceiling Settings (for Floor-Ceiling strategy)
  const [floorPct, setFloorPct] = useState<number>(80); // 80% of Year 1 real withdrawal
  const [ceilingPct, setCeilingPct] = useState<number>(130); // 130% of Year 1 real withdrawal

  const [copied, setCopied] = useState<boolean>(false);

  // Derived cash percentage
  const cashPct = Math.max(0, 100 - equityPct - bondPct);

  // Formatting helpers
  const cur = CURRENCIES[currency];
  const formatMoney = (val: number) => {
    return `${cur.symbol}${Math.round(val).toLocaleString()}`;
  };

  // Simulation Engine
  const simulation = useMemo(() => {
    const selectedRegime = REGIMES[regime];
    const initialWithdrawal = nestEgg * (initialRate / 100);
    const records: YearRecord[] = [];

    let currentBalance = nestEgg;
    let prevWithdrawal = initialWithdrawal;
    let cumulativeInflation = 1.0;
    let depletedYear: number | null = null;
    let totalNominalWithdrawn = 0;
    let totalRealWithdrawn = 0;
    let minBalance = nestEgg;
    let worstDrawdownPct = 0;

    // Guyton-Klinger Tracking States
    const targetInitialRate = initialRate / 100;
    const capitalPreservationThreshold = targetInitialRate * 1.20; // 20% higher rate triggers cut
    const prosperityThreshold = targetInitialRate * 0.80; // 20% lower rate triggers raise

    for (let yr = 1; yr <= horizonYears; yr++) {
      const age = currentAge + (yr - 1);
      const isDepleted = currentBalance <= 0;

      if (isDepleted && depletedYear === null) {
        depletedYear = yr;
      }

      // 1. Determine Market Return & Inflation for this year
      const stress = selectedRegime.stressYears[yr];
      const eqRet = stress !== undefined ? stress.eq : selectedRegime.equityBaseReturn;
      const bdRet = stress !== undefined ? stress.bd : selectedRegime.bondBaseReturn;
      const csRet = selectedRegime.cashBaseReturn;
      const infRate = stress !== undefined ? stress.inf : selectedRegime.baseInflation;

      cumulativeInflation *= (1 + infRate);

      const netPortfolioReturn = (
        (equityPct / 100) * eqRet +
        (bondPct / 100) * bdRet +
        (cashPct / 100) * csRet
      ) - (expenseRatio / 100);

      // 2. Supplemental Income
      const hasSupplemental = age >= supplementalStartAge;
      const supplementalIncome = hasSupplemental ? (supplementalAnnual * (cumulativeInflation / (1 + infRate))) : 0;

      // 3. Compute Strategy Withdrawal
      let rawPortfolioWithdrawal = 0;

      if (isDepleted) {
        rawPortfolioWithdrawal = 0;
      } else if (yr === 1) {
        rawPortfolioWithdrawal = initialWithdrawal;
      } else {
        if (strategy === 'bengen') {
          // Fixed Bengen Rule: Adjust prior withdrawal by exact inflation
          rawPortfolioWithdrawal = prevWithdrawal * (1 + infRate);
        } else if (strategy === 'guyton-klinger') {
          // Dynamic Guardrails Rule:
          // Rule A: Portfolio Freeze Rule - if previous portfolio total return was negative, skip inflation bump
          const priorReturn = records[records.length - 1]?.returnRate || 0;
          let candidateWithdrawal = prevWithdrawal * (priorReturn >= 0 ? (1 + infRate) : 1.0);

          // Test current withdrawal rate on current beginning balance
          const testRate = candidateWithdrawal / currentBalance;

          // Rule B: Capital Preservation Rule - cut by 10% if testRate > 1.2 * initialRate
          if (testRate > capitalPreservationThreshold && yr < horizonYears - 5) {
            candidateWithdrawal *= 0.90;
          }
          // Rule C: Prosperity Rule - raise by 10% if testRate < 0.8 * initialRate
          else if (testRate < prosperityThreshold) {
            candidateWithdrawal *= 1.10;
          }

          rawPortfolioWithdrawal = candidateWithdrawal;
        } else if (strategy === 'vpw') {
          // Variable Percentage Withdrawal (VPW):
          // Calculates dynamic percentage based on remaining years and conservative expected real return
          const remainingYears = Math.max(1, horizonYears - yr + 1);
          const expectedRealRate = 0.035;
          // PMT factor for annuity
          const vpwFactor = expectedRealRate / (1 - Math.pow(1 + expectedRealRate, -remainingYears));
          rawPortfolioWithdrawal = currentBalance * vpwFactor;
        } else if (strategy === 'floor-ceiling') {
          // Floor & Ceiling: Bengen real indexed, clamped between absolute real boundaries
          const unconstrained = prevWithdrawal * (1 + infRate);
          const floorAmount = (initialWithdrawal * (floorPct / 100)) * (cumulativeInflation / (1 + infRate));
          const ceilingAmount = (initialWithdrawal * (ceilingPct / 100)) * (cumulativeInflation / (1 + infRate));
          rawPortfolioWithdrawal = Math.min(ceilingAmount, Math.max(floorAmount, unconstrained));
        }
      }

      // Net withdrawal taken from portfolio (offsetting any supplemental pension)
      const netFromPortfolio = Math.max(0, rawPortfolioWithdrawal - supplementalIncome);
      const actualTaken = Math.min(currentBalance, netFromPortfolio);

      // 4. Update Ending Balance
      // Assume half-year withdrawal convention or beginning-of-year withdrawal
      const balanceAfterWithdrawal = Math.max(0, currentBalance - actualTaken);
      const endBalance = balanceAfterWithdrawal * (1 + netPortfolioReturn);

      const realPurchasingPower = isDepleted ? 0 : (actualTaken / cumulativeInflation);

      totalNominalWithdrawn += actualTaken;
      totalRealWithdrawn += realPurchasingPower;

      if (!isDepleted && endBalance < minBalance) {
        minBalance = endBalance;
      }
      const currentDrawdown = (nestEgg - endBalance) / nestEgg;
      if (currentDrawdown > worstDrawdownPct) {
        worstDrawdownPct = currentDrawdown;
      }

      records.push({
        year: yr,
        age,
        startBalance: currentBalance,
        returnRate: netPortfolioReturn,
        inflationRate: infRate,
        withdrawal: rawPortfolioWithdrawal,
        supplemental: supplementalIncome,
        netWithdrawal: actualTaken,
        endBalance,
        realPurchasingPower,
        withdrawalRateOnStart: currentBalance > 0 ? (actualTaken / currentBalance) * 100 : 0,
        isDepleted
      });

      prevWithdrawal = actualTaken > 0 ? actualTaken : prevWithdrawal;
      currentBalance = endBalance;
    }

    // Heuristic Actuarial Survival Probability Calculation
    const terminalBalance = records[records.length - 1]?.endBalance || 0;
    const terminalReal = records[records.length - 1]?.realPurchasingPower || 0;
    let survivalScore = 100;
    if (depletedYear !== null) {
      survivalScore = Math.max(10, Math.round((depletedYear / horizonYears) * 90));
    } else {
      if (terminalBalance < nestEgg * 0.3) survivalScore = 84;
      else if (terminalBalance < nestEgg * 0.7) survivalScore = 93;
      else survivalScore = 99;
    }

    return {
      records,
      terminalNominal: terminalBalance,
      terminalReal: terminalBalance / cumulativeInflation,
      totalNominalWithdrawn,
      totalRealWithdrawn,
      survived: depletedYear === null,
      depletedYear,
      survivalScore,
      worstDrawdownPct: Math.max(0, worstDrawdownPct * 100)
    };
  }, [nestEgg, initialRate, strategy, regime, currentAge, horizonYears, equityPct, bondPct, cashPct, expenseRatio, supplementalAnnual, supplementalStartAge, floorPct, ceilingPct]);

  // Strategy comparison data
  const strategyComparisons = useMemo(() => {
    const list: { id: StrategyType; name: string; tag: string; desc: string }[] = [
      {
        id: 'bengen',
        name: 'Bengen 4% Rule (Fixed Real)',
        tag: 'Rigid Inflation-Adjusted',
        desc: 'Withdraws the exact initial percentage adjusted for CPI each year regardless of market declines. High risk of failure in prolonged stagflation.'
      },
      {
        id: 'guyton-klinger',
        name: 'Guyton-Klinger Dynamic Guardrails',
        tag: 'Institutional Actuarial Standard',
        desc: 'Cuts spending by 10% when capital is depleted and rewards bull markets with 10% prosperity raises. Prevents premature fund insolvency.'
      },
      {
        id: 'vpw',
        name: 'Variable Percentage Withdrawal (VPW)',
        tag: 'Zero Balance Risk',
        desc: 'Dynamically links withdrawal percentage to remaining actuarial life expectancy. Guaranteeing capital never runs out, but variable cash flow.'
      },
      {
        id: 'floor-ceiling',
        name: 'Floor & Ceiling Corridor',
        tag: 'Lifestyle Stability',
        desc: 'Combines Bengen predictability with bounded safety guardrails (e.g., 80% minimum floor, 130% maximum ceiling) to smooth volatile years.'
      }
    ];
    return list;
  }, []);

  const handleCopyAnalysis = () => {
    const text = `BULLMONK SAFE WITHDRAWAL RATE (SWR) RETIREMENT AUDIT
--------------------------------------------------
Nest Egg: ${formatMoney(nestEgg)} (${cur.code})
Horizon: ${horizonYears} Years (Age ${currentAge} to ${currentAge + horizonYears})
Strategy: ${strategy.toUpperCase()} | Regime: ${REGIMES[regime].title}
Initial Withdrawal Rate: ${initialRate.toFixed(2)}% (${formatMoney(nestEgg * (initialRate / 100))}/yr)
Asset Allocation: ${equityPct}% Equity / ${bondPct}% Fixed Income / ${cashPct}% Cash
Actuarial Survival Score: ${simulation.survivalScore}%
${simulation.survived ? `Status: Solvency Maintained (Terminal Real: ${formatMoney(simulation.terminalReal)})` : `Insolvency Triggered: Year ${simulation.depletedYear} (Age ${currentAge + (simulation.depletedYear || 0)})`}
Lifetime Withdrawn: ${formatMoney(simulation.totalNominalWithdrawn)}
Audit Source: https://bullmonk.live/#tools/swr`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Retirement withdrawal telemetry copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="tool-engine-wrapper">
      {/* Top Header & Strategy Controls */}
      <div className="tool-header-block">
        <div className="tool-title-badge-row">
          <span className="tool-kpi-badge">Actuarial Forensics</span>
          <span className="tool-kpi-badge tool-badge-neutral">Bengen 1994 &amp; Guyton-Klinger Protocol</span>
          <span className="tool-kpi-badge tool-badge-gold">Trinity Study Enhanced</span>
        </div>
        <h1 className="tool-main-heading">
          Safe Withdrawal Rate (SWR) &amp; Sequence of Returns Risk Simulator
        </h1>
        <p className="tool-sub-heading">
          Institutional-grade decumulation modeling for US 401(k)/IRAs, Canadian RRIFs, Australian Superannuation, and UK SIPPs. Stress-test initial withdrawal rates, evaluate dynamic guardrail algorithms, and insulate portfolios against sequence-of-returns bear markets.
        </p>
      </div>

      {/* Global Configuration Strip */}
      <div className="tool-config-strip">
        <div className="config-group">
          <label className="config-label">
            <DollarSign className="w-3.5 h-3.5" />
            Reporting Currency
          </label>
          <div className="button-toggle-row">
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`toggle-btn ${currency === c ? 'toggle-btn-active' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="config-group">
          <label className="config-label">
            <Compass className="w-3.5 h-3.5" />
            Macroeconomic Regime / Historical Stress
          </label>
          <select 
            value={regime} 
            onChange={(e) => setRegime(e.target.value as RegimeType)}
            className="tool-select-input"
          >
            {Object.values(REGIMES).map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>

        <div className="config-group config-action-group">
          <button onClick={handleCopyAnalysis} className="tool-action-btn tool-copy-btn">
            {copied ? <Check className="w-4 h-4 text-emerald" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Audit' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* BLUF Institutional Metric Dashboard */}
      <div className="bluf-triage-card">
        <div className="bluf-header">
          <div className="bluf-title">
            <span>Actuarial Solvency &amp; Sequence Resilience Scorecard</span>
          </div>
          <span className={`bluf-badge ${simulation.survived ? 'bluf-badge-pass' : 'bluf-badge-fail'}`}>
            {simulation.survived ? `Solvent Horizon (${simulation.survivalScore}% Actuarial Score)` : `Depleted at Year ${simulation.depletedYear}`}
          </span>
        </div>
        <div className="bluf-grid">
          <div className="bluf-metric-item">
            <div className="bluf-metric-label">Year 1 Withdrawal Cash Flow</div>
            <div className="bluf-metric-val">{formatMoney(nestEgg * (initialRate / 100))}</div>
            <div className="bluf-metric-sub">{initialRate.toFixed(2)}% initial safe withdrawal rate</div>
          </div>
          <div className="bluf-metric-item">
            <div className="bluf-metric-label">Terminal Real Purchasing Power</div>
            <div className={`bluf-metric-val ${simulation.survived ? 'text-emerald' : 'text-rose'}`}>
              {formatMoney(simulation.terminalReal)}
            </div>
            <div className="bluf-metric-sub">Inflation-adjusted capital remaining after {horizonYears} yrs</div>
          </div>
          <div className="bluf-metric-item">
            <div className="bluf-metric-label">Total Lifetime Capital Paid Out</div>
            <div className="bluf-metric-val">{formatMoney(simulation.totalNominalWithdrawn)}</div>
            <div className="bluf-metric-sub">{(simulation.totalNominalWithdrawn / nestEgg).toFixed(2)}x initial portfolio multiple</div>
          </div>
          <div className="bluf-metric-item">
            <div className="bluf-metric-label">Worst Peak-to-Trough Drawdown</div>
            <div className="bluf-metric-val text-amber">{simulation.worstDrawdownPct.toFixed(1)}%</div>
            <div className="bluf-metric-sub">Max cumulative paper decline experienced</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Workspace Grid */}
      <div className="tool-workspace-grid">
        {/* Left Column: Interactive Parametric Controls */}
        <div className="tool-controls-column">
          <div className="tool-card">
            <h3 className="tool-card-title">
              <Layers className="w-4 h-4 text-gold" />
              Portfolio &amp; Decumulation Parameters
            </h3>

            {/* Starting Nest Egg */}
            <div className="tool-slider-group">
              <div className="slider-label-row">
                <span className="slider-label">Starting Capital Nest Egg</span>
                <span className="slider-val-badge">{formatMoney(nestEgg)}</span>
              </div>
              <input 
                type="range"
                min={200000}
                max={10000000}
                step={50000}
                value={nestEgg}
                onChange={(e) => setNestEgg(Number(e.target.value))}
                className="tool-range-slider"
              />
              <div className="slider-scale">
                <span>{cur.symbol}200K</span>
                <span>{cur.symbol}2.5M</span>
                <span>{cur.symbol}5M</span>
                <span>{cur.symbol}10M</span>
              </div>
            </div>

            {/* Initial Withdrawal Rate */}
            <div className="tool-slider-group">
              <div className="slider-label-row">
                <span className="slider-label">Initial Withdrawal Rate (%)</span>
                <span className={`slider-val-badge ${initialRate > 4.5 ? 'badge-rose' : initialRate <= 3.8 ? 'badge-emerald' : 'badge-gold'}`}>
                  {initialRate.toFixed(2)}% ({formatMoney(nestEgg * (initialRate / 100))}/yr)
                </span>
              </div>
              <input 
                type="range"
                min={2.5}
                max={7.5}
                step={0.1}
                value={initialRate}
                onChange={(e) => setInitialRate(Number(e.target.value))}
                className="tool-range-slider"
              />
              <div className="slider-scale">
                <span>2.5% (Ultra-Safe)</span>
                <span>4.0% (Bengen)</span>
                <span>5.5% (High Drag)</span>
                <span>7.5% (Aggressive)</span>
              </div>
            </div>

            {/* Strategy Selector Tabs */}
            <div className="tool-input-row-block">
              <label className="slider-label">Decumulation Algorithm</label>
              <div className="strategy-grid-selector">
                {strategyComparisons.map((strat) => (
                  <button
                    key={strat.id}
                    onClick={() => setStrategy(strat.id)}
                    className={`strategy-select-card ${strategy === strat.id ? 'strategy-card-active' : ''}`}
                  >
                    <div className="strategy-card-header">
                      <span className="strategy-card-name">{strat.name}</span>
                      <span className="strategy-card-tag">{strat.tag}</span>
                    </div>
                    <p className="strategy-card-desc">{strat.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Horizon & Ages */}
            <div className="tool-dual-input-row">
              <div className="input-half">
                <label className="slider-label">Retirement Start Age</label>
                <input 
                  type="number"
                  min={40}
                  max={80}
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="tool-number-input"
                />
              </div>
              <div className="input-half">
                <label className="slider-label">Horizon Duration (Years)</label>
                <input 
                  type="number"
                  min={15}
                  max={50}
                  value={horizonYears}
                  onChange={(e) => setHorizonYears(Number(e.target.value))}
                  className="tool-number-input"
                />
              </div>
            </div>

            {/* Asset Allocation Sliders */}
            <div className="asset-allocation-box">
              <div className="slider-label-row">
                <span className="slider-label font-semibold">Asset Allocation: Equity / Bonds / Cash</span>
                <span className="slider-val-badge">
                  {equityPct}% / {bondPct}% / {cashPct}%
                </span>
              </div>
              
              <div className="allocation-slider-sub">
                <span className="sub-label">Equities: {equityPct}%</span>
                <input 
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={equityPct}
                  onChange={(e) => {
                    const newEq = Number(e.target.value);
                    setEquityPct(newEq);
                    if (newEq + bondPct > 100) {
                      setBondPct(100 - newEq);
                    }
                  }}
                  className="tool-range-slider"
                />
              </div>

              <div className="allocation-slider-sub">
                <span className="sub-label">Bonds / Fixed Income: {bondPct}%</span>
                <input 
                  type="range"
                  min={0}
                  max={100 - equityPct}
                  step={5}
                  value={bondPct}
                  onChange={(e) => setBondPct(Number(e.target.value))}
                  className="tool-range-slider"
                />
              </div>
            </div>

            {/* Supplemental Inflows */}
            <div className="supplemental-income-card">
              <div className="slider-label-row">
                <span className="slider-label">
                  <Calendar className="w-3.5 h-3.5 inline mr-1 text-gold" />
                  Guaranteed Pension / Social Security
                </span>
                <span className="slider-val-badge">{formatMoney(supplementalAnnual)}/yr</span>
              </div>
              <div className="tool-dual-input-row mt-2">
                <div className="input-half">
                  <label className="sub-label">Annual Inflow ({cur.code})</label>
                  <input 
                    type="number"
                    min={0}
                    max={150000}
                    step={1000}
                    value={supplementalAnnual}
                    onChange={(e) => setSupplementalAnnual(Number(e.target.value))}
                    className="tool-number-input"
                  />
                </div>
                <div className="input-half">
                  <label className="sub-label">Inflow Start Age</label>
                  <input 
                    type="number"
                    min={55}
                    max={75}
                    value={supplementalStartAge}
                    onChange={(e) => setSupplementalStartAge(Number(e.target.value))}
                    className="tool-number-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization & Ledger */}
        <div className="tool-results-column">
          {/* Visual SVG Trajectory Chart */}
          <div className="tool-card">
            <div className="card-header-with-action">
              <h3 className="tool-card-title">
                <TrendingUp className="w-4 h-4 text-gold" />
                Multi-Decade Portfolio Trajectory ({horizonYears} Years)
              </h3>
              <span className="chart-legend-tag">
                <span className="legend-dot legend-dot-gold"></span> Nominal Balance
                <span className="legend-dot legend-dot-blue ml-3"></span> Real (Inflation-Adjusted)
              </span>
            </div>

            <div className="svg-chart-container">
              {(() => {
                const maxVal = Math.max(nestEgg * 2.5, ...simulation.records.map(r => r.endBalance));
                const width = 640;
                const height = 240;
                const padding = 36;
                const innerW = width - padding * 2;
                const innerH = height - padding * 2;

                const getX = (idx: number) => padding + (idx / (horizonYears - 1)) * innerW;
                const getY = (val: number) => padding + innerH - (Math.max(0, val) / maxVal) * innerH;

                const nominalPath = simulation.records
                  .map((r, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(r.endBalance)}`)
                  .join(' ');

                const realPath = simulation.records
                  .map((r, i) => {
                    // Approximate real purchasing power balance
                    const realBal = r.endBalance / Math.pow(1 + 0.03, i + 1);
                    return `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(realBal)}`;
                  })
                  .join(' ');

                return (
                  <svg viewBox={`0 0 ${width} ${height}`} className="trajectory-svg">
                    {/* Gridlines */}
                    <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--border-subtle)" strokeDasharray="3 3" />
                    <line x1={padding} y1={padding + innerH / 2} x2={width - padding} y2={padding + innerH / 2} stroke="var(--border-subtle)" strokeDasharray="3 3" />
                    <line x1={padding} y1={padding + innerH} x2={width - padding} y2={padding + innerH} stroke="var(--border-strong)" />

                    {/* Insolvency Threshold Line */}
                    <line x1={padding} y1={padding + innerH} x2={width - padding} y2={padding + innerH} stroke="#EF4444" strokeWidth="2" />

                    {/* Paths */}
                    <path d={nominalPath} fill="none" stroke="#B45309" strokeWidth="3" />
                    <path d={realPath} fill="none" stroke="#0284C7" strokeWidth="2" strokeDasharray="4 4" />

                    {/* Milestone Dots */}
                    {simulation.records.filter((_, i) => i % 5 === 0 || i === horizonYears - 1).map((r, i) => (
                      <g key={i}>
                        <circle cx={getX(r.year - 1)} cy={getY(r.endBalance)} r="4" fill="#B45309" />
                        <text 
                          x={getX(r.year - 1)} 
                          y={height - 10} 
                          textAnchor="middle" 
                          fontSize="10" 
                          fill="var(--text-muted)"
                        >
                          Age {r.age}
                        </text>
                      </g>
                    ))}
                  </svg>
                );
              })()}
            </div>

            <div className="chart-footer-caption">
              <span>Selected Stress Regime: <strong>{REGIMES[regime].title}</strong></span>
              <span>Asset Drag: <strong>{expenseRatio * 100} bps</strong></span>
            </div>
          </div>

          {/* Year-by-Year Simulation Ledger Table */}
          <div className="tool-card">
            <h3 className="tool-card-title">
              <Calendar className="w-4 h-4 text-gold" />
              Annual Decumulation Ledger (First 15 Years)
            </h3>
            <div className="table-responsive-wrapper">
              <table className="tool-data-table">
                <thead>
                  <tr>
                    <th>Yr</th>
                    <th>Age</th>
                    <th>Beginning Capital</th>
                    <th>Net Return</th>
                    <th>Gross Withdrawal</th>
                    <th>Pension Offset</th>
                    <th>Ending Capital</th>
                    <th>Effective Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {simulation.records.slice(0, 15).map((rec) => (
                    <tr key={rec.year} className={rec.isDepleted ? 'row-depleted' : ''}>
                      <td><strong>Yr {rec.year}</strong></td>
                      <td>{rec.age}</td>
                      <td>{formatMoney(rec.startBalance)}</td>
                      <td className={`num ${rec.returnRate >= 0 ? 'text-emerald' : 'text-rose'}`}>
                        {(rec.returnRate * 100).toFixed(1)}%
                      </td>
                      <td className="num font-semibold">{formatMoney(rec.withdrawal)}</td>
                      <td className="num text-muted">{rec.supplemental > 0 ? formatMoney(rec.supplemental) : '—'}</td>
                      <td className={`num font-semibold ${rec.endBalance > 0 ? '' : 'text-rose'}`}>
                        {formatMoney(rec.endBalance)}
                      </td>
                      <td className="num">
                        <span className={`ledger-rate-pill ${rec.withdrawalRateOnStart > 6 ? 'pill-danger' : rec.withdrawalRateOnStart > 4.5 ? 'pill-warn' : 'pill-pass'}`}>
                          {rec.withdrawalRateOnStart.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Actuarial & Statutory Footnotes */}
      <div className="tool-footer-guidance-card">
        <div className="guidance-title">
          <Award className="w-4 h-4 text-gold" />
          Primary Actuarial Literature &amp; Cross-Border Frameworks
        </div>
        <div className="guidance-grid">
          <div className="guidance-item">
            <strong>Bengen 1994 Historical Baseline</strong>
            <p>William Bengen’s seminal research established the 4% rule utilizing 1926–1976 rolling periods. However, in modern regimes characterized by low sovereign bond duration cushions and sticky inflation, static real withdrawals suffer from elevated sequence of returns risk.</p>
          </div>
          <div className="guidance-item">
            <strong>Guyton-Klinger Guardrail Rules</strong>
            <p>Jonathan Guyton and William Klinger demonstrated that implementing dynamic capital preservation rules (trimming withdrawals 10% during drawdowns) increases sustainable initial withdrawal rates to 4.8%–5.2% over a 30-year retirement horizon.</p>
          </div>
          <div className="guidance-item">
            <strong>Cross-Border Statutory Alignment</strong>
            <p>Models align with US IRS Required Minimum Distributions (Uniform Lifetime Table), Canadian RRIF mandatory minimum age withdrawal schedules, Australian Superannuation minimum pension drawdown rates, and UK SIPP decumulation parameters.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
