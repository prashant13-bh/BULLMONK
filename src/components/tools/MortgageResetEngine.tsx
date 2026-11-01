import React, { useState, useMemo } from 'react';
import { 
  Home, DollarSign, Percent, TrendingUp, AlertTriangle, ShieldCheck, 
  Copy, Check, ArrowRight, Building, Layers, Clock, ShieldAlert, BarChart3
} from 'lucide-react';

interface MortgageResetEngineProps {
  showToast: (msg: string) => void;
}

type MortgageMode = 'cliff' | 'offset' | 'us-refi' | 'rental-dscr';

export const MortgageResetEngine: React.FC<MortgageResetEngineProps> = ({ showToast }) => {
  const [activeMode, setActiveMode] = useState<MortgageMode>('cliff');
  const [copied, setCopied] = useState<boolean>(false);

  // Mode 1: Canadian & UK Renewal Cliff States
  const [cliffLoanBalance, setCliffLoanBalance] = useState<number>(650000);
  const [cliffOriginatingRate, setCliffOriginatingRate] = useState<number>(1.89); // % (2020-2021 pandemic rate)
  const [cliffRenewalRate, setCliffRenewalRate] = useState<number>(5.25); // % (2025/2026 renewal rate)
  const [cliffRemainingYears, setCliffRemainingYears] = useState<number>(20); // Years remaining
  const [cliffCurrency, setCliffCurrency] = useState<'CAD' | 'GBP' | 'USD'>('CAD');

  // Mode 2: Australian Offset Account States
  const [offsetLoanBalance, setOffsetLoanBalance] = useState<number>(750000);
  const [offsetRate, setOffsetRate] = useState<number>(6.20); // % Variable rate
  const [offsetCashBalance, setOffsetCashBalance] = useState<number>(85000); // In offset account
  const [offsetTermYears, setOffsetTermYears] = useState<number>(30);
  const [marginalTaxRate, setMarginalTaxRate] = useState<number>(39); // 37% + 2% Medicare

  // Mode 3: US 30-Yr Fixed Refi & Golden Handcuff States
  const [usLoanBalance, setUsLoanBalance] = useState<number>(500000);
  const [usCurrentRate, setUsCurrentRate] = useState<number>(3.25); // %
  const [usNewRate, setUsNewRate] = useState<number>(6.50); // %
  const [usClosingCosts, setUsClosingCosts] = useState<number>(6500); // $

  // Mode 4: Net Rental Yield & DSCR Stress States
  const [propValue, setPropValue] = useState<number>(750000);
  const [propDebt, setPropDebt] = useState<number>(600000);
  const [grossMonthlyRent, setGrossMonthlyRent] = useState<number>(3500);
  const [propInterestRate, setPropInterestRate] = useState<number>(5.80);
  const [vacancyPct, setVacancyPct] = useState<number>(5);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(6500);
  const [strataHoaAnnual, setStrataHoaAnnual] = useState<number>(3600);
  const [managementPct, setManagementPct] = useState<number>(7);
  const [maintenancePct, setMaintenancePct] = useState<number>(1.5);

  // Standard Monthly Amortization Formula
  const calcMonthlyPayment = (principal: number, annualRatePct: number, years: number): number => {
    if (principal <= 0 || years <= 0) return 0;
    const monthlyRate = (annualRatePct / 100) / 12;
    const totalPayments = years * 12;
    if (monthlyRate === 0) return principal / totalPayments;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    return payment;
  };

  // 1. Calculations for Canadian / UK Rollover Cliff
  const cliffMetrics = useMemo(() => {
    const originalMonthly = calcMonthlyPayment(cliffLoanBalance, cliffOriginatingRate, cliffRemainingYears);
    const renewedMonthly = calcMonthlyPayment(cliffLoanBalance, cliffRenewalRate, cliffRemainingYears);
    const monthlyIncrease = renewedMonthly - originalMonthly;
    const annualIncrease = monthlyIncrease * 12;
    const pctIncrease = ((renewedMonthly - originalMonthly) / originalMonthly) * 100;

    // Lump sum needed to keep monthly payment identical under higher rate:
    // P_new = Payment_orig * ( (1+r)^n - 1 ) / ( r * (1+r)^n )
    const monthlyRateNew = (cliffRenewalRate / 100) / 12;
    const n = cliffRemainingYears * 12;
    const affordablePrincipal = (originalMonthly * (Math.pow(1 + monthlyRateNew, n) - 1)) / (monthlyRateNew * Math.pow(1 + monthlyRateNew, n));
    const lumpSumPaydownNeeded = Math.max(0, cliffLoanBalance - affordablePrincipal);

    // Amortization stretch: If payment kept flat at originalMonthly, how many months would it take?
    // n = - ln(1 - (P * r / Payment)) / ln(1 + r)
    let stretchedYears: number | 'Infinite / Negative Amortization' = cliffRemainingYears;
    const monthlyInterestOnly = cliffLoanBalance * monthlyRateNew;
    if (originalMonthly <= monthlyInterestOnly) {
      stretchedYears = 'Infinite / Negative Amortization';
    } else {
      const months = -Math.log(1 - (cliffLoanBalance * monthlyRateNew / originalMonthly)) / Math.log(1 + monthlyRateNew);
      stretchedYears = Number((months / 12).toFixed(1));
    }

    return {
      originalMonthly: Math.round(originalMonthly),
      renewedMonthly: Math.round(renewedMonthly),
      monthlyIncrease: Math.round(monthlyIncrease),
      annualIncrease: Math.round(annualIncrease),
      pctIncrease: Number(pctIncrease.toFixed(1)),
      lumpSumPaydownNeeded: Math.round(lumpSumPaydownNeeded),
      stretchedYears
    };
  }, [cliffLoanBalance, cliffOriginatingRate, cliffRenewalRate, cliffRemainingYears]);

  // 2. Calculations for Australian Offset Account
  const offsetMetrics = useMemo(() => {
    const monthlyRate = (offsetRate / 100) / 12;
    const totalMonths = offsetTermYears * 12;
    const baseMonthlyPayment = calcMonthlyPayment(offsetLoanBalance, offsetRate, offsetTermYears);

    // Simulation without offset
    let balanceNoOffset = offsetLoanBalance;
    let totalInterestNoOffset = 0;
    for (let m = 0; m < totalMonths; m++) {
      const interest = balanceNoOffset * monthlyRate;
      const principal = baseMonthlyPayment - interest;
      totalInterestNoOffset += interest;
      balanceNoOffset = Math.max(0, balanceNoOffset - principal);
      if (balanceNoOffset <= 0) break;
    }

    // Simulation WITH offset
    let balanceWithOffset = offsetLoanBalance;
    let totalInterestWithOffset = 0;
    let monthsToPayoffWithOffset = totalMonths;
    for (let m = 0; m < totalMonths; m++) {
      const chargeableBalance = Math.max(0, balanceWithOffset - offsetCashBalance);
      const interest = chargeableBalance * monthlyRate;
      const principal = baseMonthlyPayment - interest;
      totalInterestWithOffset += interest;
      balanceWithOffset = Math.max(0, balanceWithOffset - principal);
      if (balanceWithOffset <= 0) {
        monthsToPayoffWithOffset = m + 1;
        break;
      }
    }

    const interestSaved = Math.max(0, totalInterestNoOffset - totalInterestWithOffset);
    const yearsSaved = Number(((totalMonths - monthsToPayoffWithOffset) / 12).toFixed(1));
    const newTermYears = Number((monthsToPayoffWithOffset / 12).toFixed(1));

    // Equivalent pre-tax investment yield needed to beat offset savings:
    // Offset interest savings is 100% tax-free!
    // Equivalent Pre-Tax Yield = offsetRate / (1 - marginalTaxRate / 100)
    const equivalentPreTaxYield = Number((offsetRate / (1 - marginalTaxRate / 100)).toFixed(2));

    return {
      baseMonthlyPayment: Math.round(baseMonthlyPayment),
      totalInterestNoOffset: Math.round(totalInterestNoOffset),
      totalInterestWithOffset: Math.round(totalInterestWithOffset),
      interestSaved: Math.round(interestSaved),
      yearsSaved,
      newTermYears,
      equivalentPreTaxYield
    };
  }, [offsetLoanBalance, offsetRate, offsetCashBalance, offsetTermYears, marginalTaxRate]);

  // 3. Calculations for US 30-Yr Fixed & Golden Handcuffs
  const usMetrics = useMemo(() => {
    const currentMonthly = calcMonthlyPayment(usLoanBalance, usCurrentRate, 30);
    const newMonthly = calcMonthlyPayment(usLoanBalance, usNewRate, 30);
    const monthlyDiff = newMonthly - currentMonthly;
    const annualDiff = monthlyDiff * 12;

    // Refi Breakeven: If refinancing from higher to lower
    // If newRate < currentRate, monthlyDiff is negative (savings)
    const isRefiSavings = usNewRate < usCurrentRate;
    const monthlySavings = isRefiSavings ? (currentMonthly - newMonthly) : 0;
    const breakEvenMonths = isRefiSavings && monthlySavings > 0 
      ? Math.ceil(usClosingCosts / monthlySavings) 
      : null;

    // Golden Handcuffs Penalty: If moving to a new home with current higher rate
    const goldenHandcuffPenaltyAnnual = monthlyDiff > 0 ? annualDiff : 0;

    return {
      currentMonthly: Math.round(currentMonthly),
      newMonthly: Math.round(newMonthly),
      monthlyDiff: Math.round(monthlyDiff),
      annualDiff: Math.round(annualDiff),
      isRefiSavings,
      monthlySavings: Math.round(monthlySavings),
      breakEvenMonths,
      goldenHandcuffPenaltyAnnual: Math.round(goldenHandcuffPenaltyAnnual)
    };
  }, [usLoanBalance, usCurrentRate, usNewRate, usClosingCosts]);

  // 4. Calculations for Institutional Net Rental Yield & DSCR
  const rentalMetrics = useMemo(() => {
    const grossAnnualRent = grossMonthlyRent * 12;
    const grossYield = (grossAnnualRent / propValue) * 100;

    // Operating Deductions
    const vacancyLoss = grossAnnualRent * (vacancyPct / 100);
    const effectiveGrossIncome = grossAnnualRent - vacancyLoss;
    const managementFee = effectiveGrossIncome * (managementPct / 100);
    const maintenanceReserve = propValue * (maintenancePct / 100);
    const totalOpex = vacancyLoss + propertyTaxAnnual + strataHoaAnnual + managementFee + maintenanceReserve;

    // Net Operating Income (NOI)
    const noi = grossAnnualRent - totalOpex;
    const netYield = (noi / propValue) * 100;

    // Annual Debt Service (Principal & Interest based on 30-yr amortization)
    const monthlyDebtService = calcMonthlyPayment(propDebt, propInterestRate, 30);
    const annualDebtService = monthlyDebtService * 12;

    // DSCR = NOI / Annual Debt Service
    const dscr = annualDebtService > 0 ? Number((noi / annualDebtService).toFixed(2)) : 0;
    const annualNetCashFlow = noi - annualDebtService;
    const monthlyNetCashFlow = annualNetCashFlow / 12;

    // Sensitivity to +100bps, +200bps, +300bps rate shocks
    const stressScenarios = [0, 1.0, 2.0, 3.0].map((bpsAdd) => {
      const shockedRate = propInterestRate + bpsAdd;
      const shockedDebtService = calcMonthlyPayment(propDebt, shockedRate, 30) * 12;
      const shockedDscr = shockedDebtService > 0 ? Number((noi / shockedDebtService).toFixed(2)) : 0;
      const shockedCashFlowAnnual = noi - shockedDebtService;
      return {
        rate: Number(shockedRate.toFixed(2)),
        dscr: shockedDscr,
        cashFlowMonthly: Math.round(shockedCashFlowAnnual / 12),
        isPositive: shockedCashFlowAnnual >= 0
      };
    });

    return {
      grossAnnualRent: Math.round(grossAnnualRent),
      grossYield: Number(grossYield.toFixed(2)),
      noi: Math.round(noi),
      netYield: Number(netYield.toFixed(2)),
      monthlyDebtService: Math.round(monthlyDebtService),
      annualDebtService: Math.round(annualDebtService),
      dscr,
      annualNetCashFlow: Math.round(annualNetCashFlow),
      monthlyNetCashFlow: Math.round(monthlyNetCashFlow),
      stressScenarios
    };
  }, [propValue, propDebt, grossMonthlyRent, propInterestRate, vacancyPct, propertyTaxAnnual, strataHoaAnnual, managementPct, maintenancePct]);

  const handleCopyDossier = () => {
    let text = '';
    if (activeMode === 'cliff') {
      text = `BULLMONK CANADIAN & UK MORTGAGE ROLLOVER RENEWAL AUDIT
Loan Principal Balance: ${cliffCurrency} $${cliffLoanBalance.toLocaleString()}
Originating Pandemic Rate: ${cliffOriginatingRate}% -> Upcoming Renewal Rate: ${cliffRenewalRate}%
Remaining Term: ${cliffRemainingYears} Years
--------------------------------------------------------------------------------
Payment Shock Assessment:
- Original Monthly Payment: ${cliffCurrency} $${cliffMetrics.originalMonthly.toLocaleString()}
- Post-Renewal Monthly Payment: ${cliffCurrency} $${cliffMetrics.renewedMonthly.toLocaleString()}
- Monthly Jump: +${cliffCurrency} $${cliffMetrics.monthlyIncrease.toLocaleString()} (+${cliffMetrics.pctIncrease}%)
- Annualized Out-of-Pocket Increase: +${cliffCurrency} $${cliffMetrics.annualIncrease.toLocaleString()}/year
- Lump Sum Paydown to Prevent Payment Hike: ${cliffCurrency} $${cliffMetrics.lumpSumPaydownNeeded.toLocaleString()}
- Amortization Stretch without Payment Increase: ${cliffMetrics.stretchedYears} ${typeof cliffMetrics.stretchedYears === 'number' ? 'years' : ''}
--------------------------------------------------------------------------------
Generated via BullMonk Cross-Border Intelligence (https://bullmonk.live/#tools/mortgage-reset)`;
    } else if (activeMode === 'offset') {
      text = `BULLMONK AUSTRALIAN MORTGAGE OFFSET ACCOUNT EFFICIENCY AUDIT
Loan Principal: A$${offsetLoanBalance.toLocaleString()} | Variable Rate: ${offsetRate}%
100% Mortgage Offset Balance: A$${offsetCashBalance.toLocaleString()}
Marginal Tax Bracket: ${marginalTaxRate}%
--------------------------------------------------------------------------------
Offset Account ROI:
- Base Monthly Repayment: A$${offsetMetrics.baseMonthlyPayment.toLocaleString()}
- Total Tax-Free Interest Saved: A$${offsetMetrics.interestSaved.toLocaleString()}
- Loan Term Shaved: ${offsetMetrics.yearsSaved} Years (Paid off in ${offsetMetrics.newTermYears} years)
- Equivalent Pre-Tax ASX/ETF Return Required: ${offsetMetrics.equivalentPreTaxYield}% p.a.
--------------------------------------------------------------------------------
Generated via BullMonk Cross-Border Intelligence (https://bullmonk.live/#tools/mortgage-reset)`;
    } else if (activeMode === 'us-refi') {
      text = `BULLMONK US 30-YEAR FIXED MORTGAGE & REFINANCE AUDIT
Loan Balance: $${usLoanBalance.toLocaleString()} USD
Current Locked Rate: ${usCurrentRate}% | Market / Proposed Rate: ${usNewRate}%
--------------------------------------------------------------------------------
${usMetrics.isRefiSavings ? `Refinance Savings:
- Monthly Savings: $${usMetrics.monthlySavings.toLocaleString()}/mo
- Break-Even Horizon: ${usMetrics.breakEvenMonths} Months` : `Golden Handcuff Relocation Penalty:
- Additional Monthly Cost: +$${usMetrics.monthlyDiff.toLocaleString()}/mo
- Annual Golden Handcuffs Drag: +$${usMetrics.goldenHandcuffPenaltyAnnual.toLocaleString()}/year`}
--------------------------------------------------------------------------------
Generated via BullMonk Cross-Border Intelligence (https://bullmonk.live/#tools/mortgage-reset)`;
    } else {
      text = `BULLMONK INSTITUTIONAL REAL ESTATE NET YIELD & DSCR AUDIT
Property Valuation: $${propValue.toLocaleString()} | Loan Debt: $${propDebt.toLocaleString()}
Gross Rent: $${grossMonthlyRent.toLocaleString()}/mo ($${rentalMetrics.grossAnnualRent.toLocaleString()}/yr)
--------------------------------------------------------------------------------
Yield & Debt Coverage:
- Gross Rental Yield: ${rentalMetrics.grossYield}%
- Net Operating Income (NOI): $${rentalMetrics.noi.toLocaleString()}/yr
- True Net Rental Yield: ${rentalMetrics.netYield}%
- Debt Service Coverage Ratio (DSCR): ${rentalMetrics.dscr}x
- Net Monthly Cash Flow: $${rentalMetrics.monthlyNetCashFlow.toLocaleString()}/mo
--------------------------------------------------------------------------------
Generated via BullMonk Cross-Border Intelligence (https://bullmonk.live/#tools/mortgage-reset)`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Mortgage intelligence dossier copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '2.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(14, 165, 233, 0.12)', 
            color: 'var(--accent-blue)', 
            padding: '0.35rem 0.75rem', 
            borderRadius: '6px', 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            marginBottom: '0.5rem' 
          }}>
            <Home size={14} />
            Cross-Border Real Estate & Debt Engine
          </div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', fontWeight: 800, margin: '0.25rem 0' }}>
            Mortgage Reset Cliff & Net Rental Yield Terminal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px', margin: 0, lineHeight: '1.5' }}>
            Model Canadian & UK 5-year mortgage renewal payment shock, Australian 100% offset interest savings, US 30-year fixed refinance breakeven, and institutional Net Rental Yield & Debt Service Coverage Ratio (DSCR) stress tests.
          </p>
        </div>

        <button 
          onClick={handleCopyDossier} 
          className="btn btn-secondary" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}
        >
          {copied ? <Check size={16} color="var(--accent-green)" /> : <Copy size={16} />}
          {copied ? 'Dossier Copied' : 'Export Mortgage Audit'}
        </button>
      </div>

      {/* Mode Navigation Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-medium)', paddingBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => setActiveMode('cliff')}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeMode === 'cliff' ? '2px solid var(--accent-gold)' : '1px solid var(--border-medium)',
            background: activeMode === 'cliff' ? 'var(--accent-gold-glow)' : 'var(--bg-surface)',
            color: activeMode === 'cliff' ? 'var(--accent-gold)' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🇨🇦 🇬🇧 Canadian / UK Renewal Cliff
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('offset')}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeMode === 'offset' ? '2px solid var(--accent-gold)' : '1px solid var(--border-medium)',
            background: activeMode === 'offset' ? 'var(--accent-gold-glow)' : 'var(--bg-surface)',
            color: activeMode === 'offset' ? 'var(--accent-gold)' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🇦🇺 Australia 100% Offset Simulator
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('us-refi')}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeMode === 'us-refi' ? '2px solid var(--accent-gold)' : '1px solid var(--border-medium)',
            background: activeMode === 'us-refi' ? 'var(--accent-gold-glow)' : 'var(--bg-surface)',
            color: activeMode === 'us-refi' ? 'var(--accent-gold)' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🇺🇸 US 30-Yr Fixed Refi & Handcuffs
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('rental-dscr')}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeMode === 'rental-dscr' ? '2px solid var(--accent-gold)' : '1px solid var(--border-medium)',
            background: activeMode === 'rental-dscr' ? 'var(--accent-gold-glow)' : 'var(--bg-surface)',
            color: activeMode === 'rental-dscr' ? 'var(--accent-gold)' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🏢 Institutional Net Yield & DSCR
        </button>
      </div>

      {/* MODE 1: Canadian & UK Rollover Renewal Cliff */}
      {activeMode === 'cliff' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Input Col 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Mortgage Principal Balance:
                  </label>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    {cliffCurrency} ${cliffLoanBalance.toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range"
                  min={100000}
                  max={2500000}
                  step={25000}
                  value={cliffLoanBalance}
                  onChange={(e) => setCliffLoanBalance(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Currency Selection:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['CAD', 'GBP', 'USD'] as const).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setCliffCurrency(curr)}
                      className="btn btn-secondary"
                      style={{
                        flex: 1,
                        background: cliffCurrency === curr ? 'var(--accent-gold-glow)' : 'var(--bg-surface)',
                        borderColor: cliffCurrency === curr ? 'var(--accent-gold)' : 'var(--border-medium)',
                        color: cliffCurrency === curr ? 'var(--accent-gold)' : 'var(--text-primary)',
                        fontWeight: 700
                      }}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Remaining Amortization:
                  </label>
                  <span style={{ fontWeight: 800 }}>{cliffRemainingYears} Years</span>
                </div>
                <input 
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={cliffRemainingYears}
                  onChange={(e) => setCliffRemainingYears(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                />
              </div>
            </div>

            {/* Input Col 2: The Two Rates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Originating Low Pandemic Rate (2020-2022):
                  </label>
                  <span style={{ fontWeight: 800, color: 'var(--accent-green)' }}>{cliffOriginatingRate}%</span>
                </div>
                <input 
                  type="range"
                  min={1.25}
                  max={4.0}
                  step={0.05}
                  value={cliffOriginatingRate}
                  onChange={(e) => setCliffOriginatingRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-green)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Upcoming Renewal Interest Rate (2025/2026):
                  </label>
                  <span style={{ fontWeight: 800, color: 'var(--accent-red)' }}>{cliffRenewalRate}%</span>
                </div>
                <input 
                  type="range"
                  min={3.5}
                  max={8.5}
                  step={0.05}
                  value={cliffRenewalRate}
                  onChange={(e) => setCliffRenewalRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-red)' }}
                />
              </div>

              <div style={{ 
                background: 'var(--bg-surface-elevated)', 
                padding: '0.85rem', 
                borderRadius: 'var(--radius-sm)', 
                borderLeft: '4px solid var(--accent-gold)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5'
              }}>
                <strong style={{ color: 'var(--text-primary)' }}>Bank of Canada & Bank of England Alert:</strong> Over $300 Billion CAD in mortgages originated during sub-2% periods reset through 2026. This terminal computes the exact liquidity buffer required to neutralize payment shock.
              </div>
            </div>
          </div>

          {/* Payment Shock Output Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Pre-Renewal Payment
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0' }}>
                ${cliffMetrics.originalMonthly.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                @ {cliffOriginatingRate}% fixed
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Post-Renewal Payment
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--accent-red)', margin: '0.35rem 0' }}>
                ${cliffMetrics.renewedMonthly.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-red)', fontWeight: 600 }}>
                @ {cliffRenewalRate}% renewal
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Monthly Payment Jump
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--accent-gold)', margin: '0.35rem 0' }}>
                +${cliffMetrics.monthlyIncrease.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                +{cliffMetrics.pctIncrease}% Shock (+${cliffMetrics.annualIncrease.toLocaleString()}/yr)
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Lump Sum Paydown Needed
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--accent-blue)', margin: '0.35rem 0' }}>
                ${cliffMetrics.lumpSumPaydownNeeded.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                To maintain ${cliffMetrics.originalMonthly}/mo
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: Australian 100% Offset Account Simulator */}
      {activeMode === 'offset' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Mortgage Loan Principal:
                  </label>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    A$ {offsetLoanBalance.toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range"
                  min={200000}
                  max={2500000}
                  step={25000}
                  value={offsetLoanBalance}
                  onChange={(e) => setOffsetLoanBalance(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Offset Account Cash Balance:
                  </label>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                    A$ {offsetCashBalance.toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range"
                  min={5000}
                  max={500000}
                  step={5000}
                  value={offsetCashBalance}
                  onChange={(e) => setOffsetCashBalance(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-green)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Variable Mortgage Interest Rate:
                  </label>
                  <span style={{ fontWeight: 800 }}>{offsetRate}%</span>
                </div>
                <input 
                  type="range"
                  min={4.0}
                  max={8.5}
                  step={0.05}
                  value={offsetRate}
                  onChange={(e) => setOffsetRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Marginal Tax Bracket (Income + Medicare):
                  </label>
                  <span style={{ fontWeight: 800 }}>{marginalTaxRate}%</span>
                </div>
                <input 
                  type="range"
                  min={18}
                  max={47}
                  step={1}
                  value={marginalTaxRate}
                  onChange={(e) => setMarginalTaxRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Tax-Free Interest Saved
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--accent-green)', margin: '0.35rem 0' }}>
                A$ {offsetMetrics.interestSaved.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                100% Tax-Exempt Savings
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Time Shaved Off 30-Yr Loan
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--accent-blue)', margin: '0.35rem 0' }}>
                {offsetMetrics.yearsSaved} Years
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Loan finishes in {offsetMetrics.newTermYears} yrs
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Equivalent Pre-Tax ASX Return
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--accent-gold)', margin: '0.35rem 0' }}>
                {offsetMetrics.equivalentPreTaxYield}% p.a.
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Required on shares to beat offset
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: US 30-Year Fixed Refinance & Golden Handcuffs */}
      {activeMode === 'us-refi' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    US Mortgage Principal:
                  </label>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    ${usLoanBalance.toLocaleString()} USD
                  </span>
                </div>
                <input 
                  type="range"
                  min={150000}
                  max={2000000}
                  step={25000}
                  value={usLoanBalance}
                  onChange={(e) => setUsLoanBalance(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Current Locked Rate:
                  </label>
                  <span style={{ fontWeight: 800, color: 'var(--accent-green)' }}>{usCurrentRate}%</span>
                </div>
                <input 
                  type="range"
                  min={2.25}
                  max={8.5}
                  step={0.125}
                  value={usCurrentRate}
                  onChange={(e) => setUsCurrentRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-green)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    New Market / Refi Rate:
                  </label>
                  <span style={{ fontWeight: 800, color: 'var(--accent-red)' }}>{usNewRate}%</span>
                </div>
                <input 
                  type="range"
                  min={2.25}
                  max={8.5}
                  step={0.125}
                  value={usNewRate}
                  onChange={(e) => setUsNewRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-red)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Refinance Closing Costs / Points:
                  </label>
                  <span style={{ fontWeight: 800 }}>${usClosingCosts.toLocaleString()}</span>
                </div>
                <input 
                  type="range"
                  min={1000}
                  max={20000}
                  step={500}
                  value={usClosingCosts}
                  onChange={(e) => setUsClosingCosts(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Current Monthly (P&I)
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0' }}>
                ${usMetrics.currentMonthly.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                @ {usCurrentRate}% 30-yr fixed
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                New Monthly (P&I)
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: usMetrics.monthlyDiff > 0 ? 'var(--accent-red)' : 'var(--accent-green)', margin: '0.35rem 0' }}>
                ${usMetrics.newMonthly.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                @ {usNewRate}% 30-yr fixed
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {usMetrics.isRefiSavings ? 'Refi Break-Even Horizon' : 'Golden Handcuff Penalty'}
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--accent-gold)', margin: '0.35rem 0' }}>
                {usMetrics.isRefiSavings ? `${usMetrics.breakEvenMonths} Months` : `+$${usMetrics.goldenHandcuffPenaltyAnnual.toLocaleString()}/yr`}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {usMetrics.isRefiSavings ? 'To recoup closing costs' : 'Extra annual cost if moving'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: Institutional Net Rental Yield & DSCR */}
      {activeMode === 'rental-dscr' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Property Market Valuation:
                  </label>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    ${propValue.toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range"
                  min={200000}
                  max={3000000}
                  step={25000}
                  value={propValue}
                  onChange={(e) => setPropValue(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Mortgage Debt Amount (LTV: {Math.round((propDebt / propValue) * 100)}%):
                  </label>
                  <span style={{ fontWeight: 800 }}>${propDebt.toLocaleString()}</span>
                </div>
                <input 
                  type="range"
                  min={50000}
                  max={propValue}
                  step={10000}
                  value={propDebt}
                  onChange={(e) => setPropDebt(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Gross Monthly Rental Income:
                  </label>
                  <span style={{ fontWeight: 800, color: 'var(--accent-green)' }}>${grossMonthlyRent.toLocaleString()} / mo</span>
                </div>
                <input 
                  type="range"
                  min={1000}
                  max={20000}
                  step={100}
                  value={grossMonthlyRent}
                  onChange={(e) => setGrossMonthlyRent(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-green)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Mortgage Interest Rate:
                  </label>
                  <span style={{ fontWeight: 800 }}>{propInterestRate}%</span>
                </div>
                <input 
                  type="range"
                  min={3.5}
                  max={9.0}
                  step={0.1}
                  value={propInterestRate}
                  onChange={(e) => setPropInterestRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Property Tax/Rates (Yr):
                  </label>
                  <input 
                    type="number"
                    value={propertyTaxAnnual}
                    onChange={(e) => setPropertyTaxAnnual(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-medium)', background: 'var(--bg-surface)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Strata/HOA (Yr):
                  </label>
                  <input 
                    type="number"
                    value={strataHoaAnnual}
                    onChange={(e) => setStrataHoaAnnual(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-medium)', background: 'var(--bg-surface)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Vacancy Reserve (%):
                  </label>
                  <input 
                    type="number"
                    value={vacancyPct}
                    onChange={(e) => setVacancyPct(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-medium)', background: 'var(--bg-surface)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Maintenance (% of val):
                  </label>
                  <input 
                    type="number"
                    step={0.1}
                    value={maintenancePct}
                    onChange={(e) => setMaintenancePct(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-medium)', background: 'var(--bg-surface)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Gross Rental Yield
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0' }}>
                {rentalMetrics.grossYield}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                ${rentalMetrics.grossAnnualRent.toLocaleString()} Gross Rent / Yr
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                True Net Rental Yield
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--accent-gold)', margin: '0.35rem 0' }}>
                {rentalMetrics.netYield}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                NOI: ${rentalMetrics.noi.toLocaleString()} / Yr
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Debt Service Coverage (DSCR)
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: rentalMetrics.dscr >= 1.25 ? 'var(--accent-green)' : rentalMetrics.dscr >= 1.0 ? 'var(--accent-gold)' : 'var(--accent-red)', margin: '0.35rem 0' }}>
                {rentalMetrics.dscr}x
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {rentalMetrics.dscr >= 1.25 ? 'Institutional Grade (>1.25x)' : 'Underwriting Caution'}
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Net Monthly Cash Flow
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: rentalMetrics.monthlyNetCashFlow >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', margin: '0.35rem 0' }}>
                {rentalMetrics.monthlyNetCashFlow >= 0 ? `+$${rentalMetrics.monthlyNetCashFlow.toLocaleString()}` : `-$${Math.abs(rentalMetrics.monthlyNetCashFlow).toLocaleString()}`}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                After all expenses & mortgage
              </div>
            </div>
          </div>

          {/* Stress Test Matrix */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Central Bank Rate Shock Stress Matrix (DSCR & Cash Flow)
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Interest Rate Scenario</th>
                    <th style={{ padding: '0.75rem 1rem' }}>DSCR Coverage Ratio</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Monthly Net Cash Flow</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Solvency Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rentalMetrics.stressScenarios.map((scen, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>
                        {scen.rate}% {idx === 0 ? '(Base Case)' : `(+${idx * 100} bps)`}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: scen.dscr >= 1.25 ? 'var(--accent-green)' : scen.dscr >= 1.0 ? 'var(--accent-gold)' : 'var(--accent-red)' }}>
                        {scen.dscr}x
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: scen.isPositive ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {scen.cashFlowMonthly >= 0 ? `+$${scen.cashFlowMonthly.toLocaleString()}` : `-$${Math.abs(scen.cashFlowMonthly).toLocaleString()}`} / mo
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: scen.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: scen.isPositive ? 'var(--accent-green)' : 'var(--accent-red)'
                        }}>
                          {scen.isPositive ? 'Positive Cash Flow' : 'Negative Gearing Shock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
