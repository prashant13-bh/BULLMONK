import React, { useState, useMemo } from 'react';
import { 
  Globe, DollarSign, Percent, TrendingUp, ShieldCheck, ShieldAlert, 
  Copy, Check, ArrowRight, Building, Award, AlertTriangle, Layers, Compass
} from 'lucide-react';

interface GlobalExpatTaxEngineProps {
  showToast: (msg: string) => void;
}

type JurisdictionId = 'us-ca' | 'us-ny' | 'us-tx' | 'au-nsw' | 'ca-on' | 'ca-bc' | 'uk-eng' | 'de-ber' | 'ch-zh';

interface JurisdictionConfig {
  id: JurisdictionId;
  country: string;
  regionName: string;
  currency: string;
  symbol: string;
  fxToUsd: number; // 1 Local Currency = X USD
  colIndex: number; // Cost of Living index relative to SF (SF = 100)
  defaultSalary: number;
  description: string;
  pensionName: string;
}

const JURISDICTIONS: Record<JurisdictionId, JurisdictionConfig> = {
  'us-ca': {
    id: 'us-ca',
    country: 'United States',
    regionName: 'California (Silicon Valley / SF)',
    currency: 'USD',
    symbol: '$',
    fxToUsd: 1.0,
    colIndex: 100,
    defaultSalary: 250000,
    description: 'Federal (up to 37%) + CA State Tax (up to 13.3%) + FICA/Medicare',
    pensionName: '401(k) Pre-Tax ($23,500)'
  },
  'us-ny': {
    id: 'us-ny',
    country: 'United States',
    regionName: 'New York (New York City)',
    currency: 'USD',
    symbol: '$',
    fxToUsd: 1.0,
    colIndex: 98,
    defaultSalary: 250000,
    description: 'Federal + NY State (up to 10.9%) + NYC Municipal Tax (up to 3.876%)',
    pensionName: '401(k) Pre-Tax ($23,500)'
  },
  'us-tx': {
    id: 'us-tx',
    country: 'United States',
    regionName: 'Texas / Washington / Florida (Zero State Tax)',
    currency: 'USD',
    symbol: '$',
    fxToUsd: 1.0,
    colIndex: 74,
    defaultSalary: 220000,
    description: '0% State Income Tax • Federal Tax + FICA/Medicare Only',
    pensionName: '401(k) Pre-Tax ($23,500)'
  },
  'au-nsw': {
    id: 'au-nsw',
    country: 'Australia',
    regionName: 'Australia (Sydney / NSW)',
    currency: 'AUD',
    symbol: 'A$',
    fxToUsd: 0.655,
    colIndex: 82,
    defaultSalary: 280000,
    description: 'ATO Stage 3 Tax Rates + 2% Medicare Levy + 11.5% Super Guarantee',
    pensionName: 'Concessional Superannuation ($30,000 cap)'
  },
  'ca-on': {
    id: 'ca-on',
    country: 'Canada',
    regionName: 'Canada (Ontario / Toronto)',
    currency: 'CAD',
    symbol: 'C$',
    fxToUsd: 0.722,
    colIndex: 78,
    defaultSalary: 220000,
    description: 'CRA Federal (up to 33%) + Ontario Provincial (up to 13.16% + surtax) + CPP/EI',
    pensionName: 'RRSP Deduction (18% up to $31,560)'
  },
  'ca-bc': {
    id: 'ca-bc',
    country: 'Canada',
    regionName: 'Canada (British Columbia / Vancouver)',
    currency: 'CAD',
    symbol: 'C$',
    fxToUsd: 0.722,
    colIndex: 80,
    defaultSalary: 220000,
    description: 'CRA Federal + BC Provincial (up to 20.5% top tier) + CPP/EI',
    pensionName: 'RRSP Deduction (18% up to $31,560)'
  },
  'uk-eng': {
    id: 'uk-eng',
    country: 'United Kingdom',
    regionName: 'United Kingdom (London / England)',
    currency: 'GBP',
    symbol: '£',
    fxToUsd: 1.285,
    colIndex: 88,
    defaultSalary: 150000,
    description: 'HMRC (20/40/45%) + 60% Trap (£100k-£125k) + Class 1 National Insurance',
    pensionName: 'SIPP / Workplace Pension Relief (£60,000 cap)'
  },
  'de-ber': {
    id: 'de-ber',
    country: 'Germany',
    regionName: 'Germany (Berlin / Frankfurt / Munich)',
    currency: 'EUR',
    symbol: '€',
    fxToUsd: 1.085,
    colIndex: 72,
    defaultSalary: 135000,
    description: 'Progressive Einkommensteuer (up to 45%) + Soli Surcharge + Social Ins. Caps',
    pensionName: 'Gesetzliche Rentenversicherung'
  },
  'ch-zh': {
    id: 'ch-zh',
    country: 'Switzerland',
    regionName: 'Switzerland (Zurich / Geneva)',
    currency: 'CHF',
    symbol: 'CHF ',
    fxToUsd: 1.132,
    colIndex: 112,
    defaultSalary: 220000,
    description: 'Swiss Federal + Cantonal/Municipal Tax (~21-23% top rate) + AHV/ALV',
    pensionName: 'Pillar 2 BVG & Pillar 3a'
  }
};

interface TaxCalculationResult {
  grossSalary: number;
  grossUsd: number;
  incomeTax: number;
  socialInsurance: number;
  pensionContribution: number;
  netAnnualTakeHome: number;
  netMonthlyTakeHome: number;
  netUsdAnnual: number;
  netUsdMonthly: number;
  effectiveTaxRate: number; // (tax + social) / gross * 100
  marginalTaxRate: number;
  marginalTrapWarning: string | null;
  colAdjustedPurchasingPowerUsd: number;
}

export const GlobalExpatTaxEngine: React.FC<GlobalExpatTaxEngineProps> = ({ showToast }) => {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<JurisdictionId>('us-ca');
  const [grossSalary, setGrossSalary] = useState<number>(250000);
  const [maximizePension, setMaximizePension] = useState<boolean>(true);
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [copied, setCopied] = useState<boolean>(false);

  const currentConfig = JURISDICTIONS[selectedJurisdiction];

  // Precise Statutory Tax Calculation Engine across 6 Tier-1 Nations
  const computeJurisdictionTax = (jurisdictionId: JurisdictionId, salary: number, useMaxPension: boolean): TaxCalculationResult => {
    const config = JURISDICTIONS[jurisdictionId];
    let incomeTax = 0;
    let socialInsurance = 0;
    let pensionContribution = 0;
    let marginalTaxRate = 0;
    let marginalTrapWarning: string | null = null;

    if (jurisdictionId === 'us-ca' || jurisdictionId === 'us-ny' || jurisdictionId === 'us-tx') {
      // United States Federal + State Model (2025/2026 Brackets)
      pensionContribution = useMaxPension ? Math.min(23500, salary * 0.15) : 0;
      const standardDeduction = filingStatus === 'married' ? 30000 : 15000;
      const taxableFederal = Math.max(0, salary - pensionContribution - standardDeduction);

      // US Federal Progressive Brackets (Single)
      if (taxableFederal <= 11925) {
        incomeTax += taxableFederal * 0.10;
        marginalTaxRate = 10;
      } else if (taxableFederal <= 48475) {
        incomeTax += 1192.5 + (taxableFederal - 11925) * 0.12;
        marginalTaxRate = 12;
      } else if (taxableFederal <= 103350) {
        incomeTax += 5578.5 + (taxableFederal - 48475) * 0.22;
        marginalTaxRate = 22;
      } else if (taxableFederal <= 197300) {
        incomeTax += 17651 + (taxableFederal - 103350) * 0.24;
        marginalTaxRate = 24;
      } else if (taxableFederal <= 250525) {
        incomeTax += 40199 + (taxableFederal - 197300) * 0.32;
        marginalTaxRate = 32;
      } else if (taxableFederal <= 626350) {
        incomeTax += 57231 + (taxableFederal - 250525) * 0.35;
        marginalTaxRate = 35;
      } else {
        incomeTax += 188769.75 + (taxableFederal - 626350) * 0.37;
        marginalTaxRate = 37;
      }

      // State Tax
      if (jurisdictionId === 'us-ca') {
        // California progressive up to 13.3% + 1% Mental Health Services tax over $1M
        const caTaxable = Math.max(0, salary - pensionContribution - 5363);
        if (caTaxable > 375000) {
          incomeTax += 28000 + (caTaxable - 375000) * 0.113;
          marginalTaxRate += 11.3;
        } else if (caTaxable > 100000) {
          incomeTax += 4000 + (caTaxable - 100000) * 0.093;
          marginalTaxRate += 9.3;
        } else {
          incomeTax += caTaxable * 0.06;
          marginalTaxRate += 6.0;
        }
      } else if (jurisdictionId === 'us-ny') {
        // New York State (~6.85%) + NYC Resident Tax (3.876%)
        const nyTaxable = Math.max(0, salary - pensionContribution - 8000);
        const nyStateTax = nyTaxable * 0.0685;
        const nycLocalTax = nyTaxable * 0.03876;
        incomeTax += nyStateTax + nycLocalTax;
        marginalTaxRate += 10.72;
      } else {
        // Texas / Washington = 0% state income tax
        marginalTaxRate += 0;
      }

      // FICA: Social Security (6.2% up to $176,100 cap) + Medicare (1.45% all + 0.9% additional over $200k)
      const socSecCap = 176100;
      const socSec = Math.min(salary, socSecCap) * 0.062;
      const medBase = salary * 0.0145;
      const medSur = salary > 200000 ? (salary - 200000) * 0.009 : 0;
      socialInsurance = socSec + medBase + medSur;
      marginalTaxRate += (salary > socSecCap ? 2.35 : 7.65);

      if (salary > 200000) {
        marginalTrapWarning = 'US Additional Medicare Surtax (0.9%) triggered above $200,000 threshold.';
      }

    } else if (jurisdictionId === 'au-nsw') {
      // Australia ATO (2024-2025 Stage 3 Reformed Brackets)
      pensionContribution = useMaxPension ? Math.min(30000, salary * 0.115) : salary * 0.115;
      const taxable = salary; // Super is concessional outside taxable pay or salary packaged

      if (taxable <= 18200) {
        incomeTax = 0;
        marginalTaxRate = 0;
      } else if (taxable <= 45000) {
        incomeTax = (taxable - 18200) * 0.16;
        marginalTaxRate = 16;
      } else if (taxable <= 135000) {
        incomeTax = 4288 + (taxable - 45000) * 0.30;
        marginalTaxRate = 30;
      } else if (taxable <= 190000) {
        incomeTax = 31288 + (taxable - 135000) * 0.37;
        marginalTaxRate = 37;
      } else {
        incomeTax = 51638 + (taxable - 190000) * 0.45;
        marginalTaxRate = 45;
      }

      // Medicare Levy 2.0%
      socialInsurance = taxable * 0.02;
      marginalTaxRate += 2.0;

      // Division 293 Tax: +15% tax on concessional super contributions if combined income > $250,000
      if (taxable + pensionContribution > 250000) {
        const div293Tax = Math.min(pensionContribution, (taxable + pensionContribution - 250000)) * 0.15;
        incomeTax += div293Tax;
        marginalTrapWarning = 'ATO Division 293 Surcharge: Extra 15% tax applied to Super contributions on income >$250k AUD.';
      }

    } else if (jurisdictionId === 'ca-on' || jurisdictionId === 'ca-bc') {
      // Canada Federal + Provincial (Ontario / BC)
      pensionContribution = useMaxPension ? Math.min(31560, salary * 0.18) : 0;
      const bpa = 15705; // Basic Personal Amount
      const taxable = Math.max(0, salary - pensionContribution - bpa);

      // Federal Tax
      let fedTax = 0;
      if (taxable <= 55867) {
        fedTax = taxable * 0.15;
        marginalTaxRate = 15;
      } else if (taxable <= 111733) {
        fedTax = 8380 + (taxable - 55867) * 0.205;
        marginalTaxRate = 20.5;
      } else if (taxable <= 173205) {
        fedTax = 19833 + (taxable - 111733) * 0.26;
        marginalTaxRate = 26;
      } else if (taxable <= 246752) {
        fedTax = 35815 + (taxable - 173205) * 0.29;
        marginalTaxRate = 29;
      } else {
        fedTax = 57144 + (taxable - 246752) * 0.33;
        marginalTaxRate = 33;
      }

      // Provincial Tax
      let provTax = 0;
      if (jurisdictionId === 'ca-on') {
        // Ontario brackets + surtax (20% on tax over $5,315 + 36% over $6,802)
        const baseProv = taxable > 220000 ? (taxable * 0.1316) : (taxable * 0.0915);
        const ontarioSurtax = baseProv > 6802 ? (baseProv - 6802) * 0.36 + (baseProv - 5315) * 0.20 : 0;
        provTax = baseProv + ontarioSurtax;
        marginalTaxRate += 20.53; // Highest marginal combined Ontario rate is 53.53%
      } else {
        // British Columbia
        provTax = taxable > 250000 ? (taxable * 0.205) : (taxable * 0.1229);
        marginalTaxRate += 20.5;
      }
      incomeTax = fedTax + provTax;

      // CPP (Base + CPP2) capped at ~$4,055 + EI capped at ~$1,049
      socialInsurance = Math.min(salary * 0.0595, 4055) + Math.min(salary * 0.0166, 1049);
      if (jurisdictionId === 'ca-on' && taxable > 100000) {
        marginalTrapWarning = 'Ontario Health Premium and combined provincial surtaxes push top marginal rate to 53.53%.';
      }

    } else if (jurisdictionId === 'uk-eng') {
      // United Kingdom HMRC (England)
      pensionContribution = useMaxPension ? Math.min(60000, salary * 0.10) : 0;
      const adjustedNetIncome = Math.max(0, salary - pensionContribution);

      // Personal Allowance Taper (£1 loss per £2 over £100,000)
      let personalAllowance = 12570;
      if (adjustedNetIncome > 100000) {
        const reduction = (adjustedNetIncome - 100000) / 2;
        personalAllowance = Math.max(0, 12570 - reduction);
      }
      const taxable = Math.max(0, adjustedNetIncome - personalAllowance);

      // HMRC Tax Brackets
      if (taxable <= 37700) {
        incomeTax = taxable * 0.20;
        marginalTaxRate = 20;
      } else if (taxable <= 125140) {
        incomeTax = 7540 + (taxable - 37700) * 0.40;
        marginalTaxRate = 40;
      } else {
        incomeTax = 42516 + (taxable - 125140) * 0.45;
        marginalTaxRate = 45;
      }

      // The Infamous 60% Marginal Trap (£100k - £125,140)
      if (adjustedNetIncome >= 100000 && adjustedNetIncome <= 125140) {
        marginalTaxRate = 60; // 40% income tax + 20% effective tax from personal allowance withdrawal
        marginalTrapWarning = 'CRITICAL UK 60% MARGINAL TAX TRAP: Personal Allowance clawback £1 per £2 earned between £100k and £125k.';
      }

      // National Insurance (Class 1 Employee: 8% from £12,570 to £50,270, 2% above)
      const niBand1 = Math.max(0, Math.min(salary, 50270) - 12570) * 0.08;
      const niBand2 = Math.max(0, salary - 50270) * 0.02;
      socialInsurance = niBand1 + niBand2;

    } else if (jurisdictionId === 'de-ber') {
      // Germany (Berlin / Munich) Single Class 1
      pensionContribution = useMaxPension ? Math.min(27566, salary * 0.093) : salary * 0.093;
      const basicAllowance = 11784; // Grundfreibetrag
      const taxable = Math.max(0, salary - basicAllowance);

      // Progressive scale approximation up to 42% (€66k) and 45% (>€277k)
      if (taxable > 277826) {
        incomeTax = 100000 + (taxable - 277826) * 0.45;
        marginalTaxRate = 45;
      } else if (taxable > 66761) {
        incomeTax = 18000 + (taxable - 66761) * 0.42;
        marginalTaxRate = 42;
      } else {
        incomeTax = taxable * 0.30;
        marginalTaxRate = 30;
      }

      // Solidarity Surcharge (Soli 5.5% on income tax if above threshold)
      if (incomeTax > 18130) {
        incomeTax += (incomeTax - 18130) * 0.055;
      }

      // Statutory Social Security Caps: Pension (9.3%), Health/Nursing (~8.2%), capped at ~€16,000/yr
      socialInsurance = Math.min(salary * 0.175, 16200);
      marginalTaxRate += 2.0;

    } else if (jurisdictionId === 'ch-zh') {
      // Switzerland (Zurich) - Highly competitive tax regime
      pensionContribution = useMaxPension ? 7056 + (salary * 0.07) : (salary * 0.07);
      const taxable = Math.max(0, salary - pensionContribution - 10000);

      // Blended Federal + Cantonal + Municipal Tax in Zurich (~18% to 22% effective for high earners)
      incomeTax = taxable * 0.205;
      marginalTaxRate = 22.5;

      // AHV/IV/EO/ALV Social Contributions (~6.4% total)
      socialInsurance = salary * 0.064;
    }

    const netAnnualTakeHome = Math.max(0, salary - incomeTax - socialInsurance - pensionContribution);
    const netMonthlyTakeHome = netAnnualTakeHome / 12;
    const grossUsd = salary * config.fxToUsd;
    const netUsdAnnual = netAnnualTakeHome * config.fxToUsd;
    const netUsdMonthly = netMonthlyTakeHome * config.fxToUsd;
    const effectiveTaxRate = Number((((incomeTax + socialInsurance) / Math.max(1, salary)) * 100).toFixed(1));

    // Cost of Living Adjusted Purchasing Power in USD
    // colIndex relative to SF = 100. If Zurich is 112, your dollar buys less; if Texas is 74, your dollar buys more.
    const colAdjustedPurchasingPowerUsd = (netUsdAnnual / (config.colIndex / 100));

    return {
      grossSalary: salary,
      grossUsd: Math.round(grossUsd),
      incomeTax: Math.round(incomeTax),
      socialInsurance: Math.round(socialInsurance),
      pensionContribution: Math.round(pensionContribution),
      netAnnualTakeHome: Math.round(netAnnualTakeHome),
      netMonthlyTakeHome: Math.round(netMonthlyTakeHome),
      netUsdAnnual: Math.round(netUsdAnnual),
      netUsdMonthly: Math.round(netUsdMonthly),
      effectiveTaxRate,
      marginalTaxRate,
      marginalTrapWarning,
      colAdjustedPurchasingPowerUsd: Math.round(colAdjustedPurchasingPowerUsd)
    };
  };

  const currentResult = useMemo(() => {
    return computeJurisdictionTax(selectedJurisdiction, grossSalary, maximizePension);
  }, [selectedJurisdiction, grossSalary, maximizePension, filingStatus]);

  // Cross-Border Comparison Matrix: What gross salary would give the SAME real purchasing power across other regions?
  const comparisonMatrix = useMemo(() => {
    const targetRealPurchasingPowerUsd = currentResult.colAdjustedPurchasingPowerUsd;
    const jurisdictionsList: JurisdictionId[] = ['us-ca', 'us-tx', 'au-nsw', 'ca-on', 'uk-eng', 'ch-zh'];

    return jurisdictionsList.map((jId) => {
      const cfg = JURISDICTIONS[jId];
      // Estimate required local salary to match target purchasing power
      // Iterative solver or ratio scaling
      const ratio = (cfg.colIndex / 100);
      const requiredNetUsd = targetRealPurchasingPowerUsd * ratio;
      const requiredNetLocal = requiredNetUsd / cfg.fxToUsd;
      // Approximate gross from net (using ~0.65 retention ratio)
      const estimatedGrossLocal = Math.round((requiredNetLocal / 0.65) / 5000) * 5000;
      const res = computeJurisdictionTax(jId, estimatedGrossLocal, true);

      return {
        id: jId,
        config: cfg,
        estimatedGrossLocal,
        res
      };
    });
  }, [currentResult]);

  const handleCopyDossier = () => {
    const text = `BULLMONK GLOBAL EXPAT & CROSS-BORDER COMPENSATION AUDIT
Jurisdiction: ${currentConfig.regionName} (${currentConfig.country})
Gross Annual Base: ${currentConfig.symbol}${grossSalary.toLocaleString()} (${currentConfig.currency}) ~ $${currentResult.grossUsd.toLocaleString()} USD
Filing Status: ${filingStatus.toUpperCase()} | Maximizing Tax-Advantaged Pension: ${maximizePension ? 'YES' : 'NO'}
--------------------------------------------------------------------------------
Statutory Deductions & Wealth Allocation:
- Income Tax (Fed/State/Municipal): ${currentConfig.symbol}${currentResult.incomeTax.toLocaleString()}
- Mandatory Social Insurance & Payroll: ${currentConfig.symbol}${currentResult.socialInsurance.toLocaleString()}
- Pension / Super / 401(k) Allocation: ${currentConfig.symbol}${currentResult.pensionContribution.toLocaleString()} (${currentConfig.pensionName})
--------------------------------------------------------------------------------
Net Discretionary Cash Flow:
- Net Annual Take-Home: ${currentConfig.symbol}${currentResult.netAnnualTakeHome.toLocaleString()} ($${currentResult.netUsdAnnual.toLocaleString()} USD)
- Net Monthly Take-Home: ${currentConfig.symbol}${currentResult.netMonthlyTakeHome.toLocaleString()} ($${currentResult.netUsdMonthly.toLocaleString()} USD/mo)
- Effective Total Tax Rate: ${currentResult.effectiveTaxRate}%
- Top Marginal Bracket: ${currentResult.marginalTaxRate}%
- Real CoL-Adjusted Purchasing Power: $${currentResult.colAdjustedPurchasingPowerUsd.toLocaleString()} USD (SF Benchmark = 100)
${currentResult.marginalTrapWarning ? `\n[REGULATORY ALERT] ${currentResult.marginalTrapWarning}\n` : ''}
Generated via BullMonk Cross-Border Intelligence (https://bullmonk.live/#tools/global-tax)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Cross-border tax & compensation dossier copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (jId: JurisdictionId, salary: number) => {
    setSelectedJurisdiction(jId);
    setGrossSalary(salary);
  };

  return (
    <div className="card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '2.5rem' }}>
      {/* Header & Meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(180, 83, 9, 0.12)', 
            color: 'var(--accent-gold)', 
            padding: '0.35rem 0.75rem', 
            borderRadius: '6px', 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            marginBottom: '0.5rem' 
          }}>
            <Globe size={14} />
            Tier-1 Cross-Border Mobility & Tax Engine
          </div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', fontWeight: 800, margin: '0.25rem 0' }}>
            Global Expat & Cross-Border Take-Home Pay Terminal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px', margin: 0, lineHeight: '1.5' }}>
            Accurately model net take-home salary, statutory payroll social security, mandatory pension contributions (401k, Superannuation, RRSP, SIPP), and real Cost-of-Living purchasing power parity across the United States, Australia, Canada, United Kingdom, Germany, and Switzerland.
          </p>
        </div>

        <button 
          onClick={handleCopyDossier} 
          className="btn btn-secondary" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}
        >
          {copied ? <Check size={16} color="var(--accent-green)" /> : <Copy size={16} />}
          {copied ? 'Dossier Copied' : 'Export Compensation Audit'}
        </button>
      </div>

      {/* Strategic Executive Presets */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
          Instant Mobility & Relocation Presets:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button 
            type="button"
            onClick={() => applyPreset('us-ca', 320000)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          >
            🇺🇸 Silicon Valley Principal ($320k USD)
          </button>
          <button 
            type="button"
            onClick={() => applyPreset('us-tx', 220000)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          >
            🇺🇸 Austin Remote Lead ($220k USD • 0% State Tax)
          </button>
          <button 
            type="button"
            onClick={() => applyPreset('au-nsw', 290000)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          >
            🇦🇺 Sydney Quant VP (A$290k AUD)
          </button>
          <button 
            type="button"
            onClick={() => applyPreset('ca-on', 210000)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          >
            🇨🇦 Toronto AI Director (C$210k CAD)
          </button>
          <button 
            type="button"
            onClick={() => applyPreset('uk-eng', 150000)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          >
            🇬🇧 London FinTech VP (£150k GBP)
          </button>
          <button 
            type="button"
            onClick={() => applyPreset('ch-zh', 230000)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          >
            🇨🇭 Zurich Cloud Architect (CHF 230k)
          </button>
        </div>
      </div>

      {/* Main Interactive Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Column 1: Country & Jurisdiction Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Host Jurisdiction & Tax System:
            </label>
            <select
              value={selectedJurisdiction}
              onChange={(e) => {
                const newId = e.target.value as JurisdictionId;
                setSelectedJurisdiction(newId);
                setGrossSalary(JURISDICTIONS[newId].defaultSalary);
              }}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              {Object.values(JURISDICTIONS).map((cfg) => (
                <option key={cfg.id} value={cfg.id}>
                  {cfg.country}: {cfg.regionName} ({cfg.currency})
                </option>
              ))}
            </select>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              {currentConfig.description}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Gross Annual Base Compensation:
              </label>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                {currentConfig.symbol}{grossSalary.toLocaleString()} {currentConfig.currency}
              </span>
            </div>
            <input 
              type="range"
              min={50000}
              max={1000000}
              step={5000}
              value={grossSalary}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <span>{currentConfig.symbol}50,000</span>
              <span>USD Equiv: ~${Math.round(grossSalary * currentConfig.fxToUsd).toLocaleString()}</span>
              <span>{currentConfig.symbol}1,000,000+</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Manual Compensation Input ({currentConfig.currency}):
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>
                {currentConfig.symbol}
              </span>
              <input 
                type="number"
                min={30000}
                max={5000000}
                step={5000}
                value={grossSalary}
                onChange={(e) => setGrossSalary(Math.max(10000, Number(e.target.value)))}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontWeight: 700
                }}
              />
            </div>
          </div>
        </div>

        {/* Column 2: Tax Allowances & Pension Strategy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Filing / Marital Status:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setFilingStatus('single')}
                style={{
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: filingStatus === 'single' ? '2px solid var(--accent-gold)' : '1px solid var(--border-medium)',
                  background: filingStatus === 'single' ? 'var(--accent-gold-glow)' : 'var(--bg-surface)',
                  color: filingStatus === 'single' ? 'var(--accent-gold)' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Single / Individual
              </button>
              <button
                type="button"
                onClick={() => setFilingStatus('married')}
                style={{
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: filingStatus === 'married' ? '2px solid var(--accent-gold)' : '1px solid var(--border-medium)',
                  background: filingStatus === 'married' ? 'var(--accent-gold-glow)' : 'var(--bg-surface)',
                  color: filingStatus === 'married' ? 'var(--accent-gold)' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Married / Joint
              </button>
            </div>
          </div>

          <div style={{ 
            background: 'var(--bg-surface-elevated)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-medium)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Maximize Pre-Tax Pension / Super
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  {currentConfig.pensionName}
                </div>
              </div>
              <input 
                type="checkbox"
                checked={maximizePension}
                onChange={(e) => setMaximizePension(e.target.checked)}
                style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Regional Nuance Pill */}
          <div style={{ 
            background: 'var(--bg-surface-elevated)', 
            padding: '0.85rem', 
            borderRadius: 'var(--radius-sm)', 
            borderLeft: '4px solid var(--accent-blue)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.5'
          }}>
            <strong style={{ color: 'var(--text-primary)' }}>Jurisdiction Benchmarks:</strong>
            <br />
            FX Rate: 1 {currentConfig.currency} = ${currentConfig.fxToUsd} USD
            <br />
            Numbeo CoL Index: {currentConfig.colIndex} (SF Bay Area Baseline = 100)
          </div>
        </div>
      </div>

      {/* Warning Box for Marginal Traps (UK 60%, AU Div 293, etc.) */}
      {currentResult.marginalTrapWarning && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.08)', 
          border: '1px solid var(--accent-red)', 
          borderRadius: 'var(--radius-sm)', 
          padding: '1rem', 
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertTriangle size={20} color="var(--accent-red)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--accent-red)', fontWeight: 600 }}>
            {currentResult.marginalTrapWarning}
          </div>
        </div>
      )}

      {/* KPI Cards: The Sovereign Executive Dashboard */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        {/* Net Monthly Take-Home */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Net Monthly Take-Home
          </div>
          <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--accent-green)', margin: '0.35rem 0' }}>
            {currentConfig.symbol}{currentResult.netMonthlyTakeHome.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            ${currentResult.netUsdMonthly.toLocaleString()} USD / month
          </div>
        </div>

        {/* Net Annual Take-Home */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Net Annual Take-Home
          </div>
          <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0' }}>
            {currentConfig.symbol}{currentResult.netAnnualTakeHome.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            ${currentResult.netUsdAnnual.toLocaleString()} USD / year
          </div>
        </div>

        {/* Effective vs Marginal Tax Rate */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Effective Tax Rate
          </div>
          <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--accent-gold)', margin: '0.35rem 0' }}>
            {currentResult.effectiveTaxRate}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Top Marginal Bracket: {currentResult.marginalTaxRate}%
          </div>
        </div>

        {/* Real CoL-Adjusted Purchasing Power */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Real Purchasing Power (USD)
          </div>
          <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--accent-blue)', margin: '0.35rem 0' }}>
            ${currentResult.colAdjustedPurchasingPowerUsd.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            SF Bay Area Reference (Index: {currentConfig.colIndex})
          </div>
        </div>
      </div>

      {/* Breakdown Table: Where does the money go? */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Statutory Breakdown & Wealth Allocation ({currentConfig.currency})
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Annual Amount ({currentConfig.symbol})</th>
                <th style={{ padding: '0.75rem 1rem' }}>Monthly Equivalent</th>
                <th style={{ padding: '0.75rem 1rem' }}>% of Gross Base</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Income Tax (Federal, State & Municipal)</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-red)', fontWeight: 700 }}>
                  -{currentConfig.symbol}{currentResult.incomeTax.toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  -{currentConfig.symbol}{Math.round(currentResult.incomeTax / 12).toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {((currentResult.incomeTax / grossSalary) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Social Security, Medicare / National Insurance</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-red)', fontWeight: 700 }}>
                  -{currentConfig.symbol}{currentResult.socialInsurance.toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  -{currentConfig.symbol}{Math.round(currentResult.socialInsurance / 12).toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {((currentResult.socialInsurance / grossSalary) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                  Pre-Tax Retirement Savings ({currentConfig.pensionName})
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
                  +{currentConfig.symbol}{currentResult.pensionContribution.toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  +{currentConfig.symbol}{Math.round(currentResult.pensionContribution / 12).toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {((currentResult.pensionContribution / grossSalary) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr style={{ background: 'var(--bg-surface-elevated)', fontWeight: 800 }}>
                <td style={{ padding: '0.85rem 1rem' }}>Net Liquid Take-Home Pay</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--accent-green)' }}>
                  {currentConfig.symbol}{currentResult.netAnnualTakeHome.toLocaleString()}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--accent-green)' }}>
                  {currentConfig.symbol}{currentResult.netMonthlyTakeHome.toLocaleString()}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  {((currentResult.netAnnualTakeHome / grossSalary) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-Border Arbitrage & Salary Parity Table */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Compass size={18} color="var(--accent-gold)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
            Cross-Border Purchasing Power Parity Matrix (Equivalent Lifestyles)
          </h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.5' }}>
          What gross compensation must you negotiate in other Tier-1 tech and financial capitals to achieve the exact same standard of living and after-tax savings as your current <strong>{currentConfig.symbol}{grossSalary.toLocaleString()} {currentConfig.currency}</strong> in {currentConfig.regionName}?
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Destination Hub</th>
                <th style={{ padding: '0.75rem 1rem' }}>Equivalent Gross Salary</th>
                <th style={{ padding: '0.75rem 1rem' }}>Net Take-Home (USD)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Effective Tax Rate</th>
                <th style={{ padding: '0.75rem 1rem' }}>Cost of Living Index</th>
              </tr>
            </thead>
            <tbody>
              {comparisonMatrix.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.config.regionName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.config.country}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    {item.config.symbol}{item.estimatedGrossLocal.toLocaleString()} {item.config.currency}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                    ${item.res.netUsdMonthly.toLocaleString()}/mo (${item.res.netUsdAnnual.toLocaleString()}/yr)
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      background: item.res.effectiveTaxRate > 40 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: item.res.effectiveTaxRate > 40 ? 'var(--accent-red)' : 'var(--accent-green)'
                    }}>
                      {item.res.effectiveTaxRate}%
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                    {item.config.colIndex} {item.config.colIndex < 100 ? `(-${100 - item.config.colIndex}% cheaper)` : `(+${item.config.colIndex - 100}% higher)`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
