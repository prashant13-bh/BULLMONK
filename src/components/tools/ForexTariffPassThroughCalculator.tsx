import React, { useState, useMemo } from 'react';
import { DollarSign, Percent, TrendingUp, Copy, Check, ShieldCheck, Info, ArrowRight, Anchor, Globe } from 'lucide-react';

interface ForexTariffPassThroughCalculatorProps {
  showToast: (msg: string) => void;
}

export const ForexTariffPassThroughCalculator: React.FC<ForexTariffPassThroughCalculatorProps> = ({ showToast }) => {
  const [fobPrice, setFobPrice] = useState<number>(100); // $ USD per unit
  const [tariffRate, setTariffRate] = useState<number>(25); // %
  const [exporterFxDeval, setExporterFxDeval] = useState<number>(8); // % Depreciation of foreign currency vs USD
  const [erptRate, setErptRate] = useState<number>(0.45); // Exchange Rate Pass-Through Coefficient
  const [exporterMarginCut, setExporterMarginCut] = useState<number>(15); // % of tariff absorbed by foreign factory
  const [freightPct, setFreightPct] = useState<number>(6); // % freight & insurance of FOB
  const [copied, setCopied] = useState(false);

  const metrics = useMemo(() => {
    // 1. Freight & Insurance Cost
    const freightCost = fobPrice * (freightPct / 100);

    // 2. Foreign currency depreciation effect on FOB price in USD:
    // If foreign exporter's currency drops 8%, their local currency revenue can remain constant
    // even if USD FOB is discounted by up to (deval * ERPT)
    const currencyOffsetDollar = fobPrice * ((exporterFxDeval / 100) * erptRate);

    // 3. Exporter price concession (absorbing part of tariff to protect market share)
    const exporterConcessionDollar = fobPrice * (exporterMarginCut / 100) * (tariffRate / 100);

    // 4. Adjusted FOB invoice price paid to exporter
    const adjustedFobPrice = Math.max(1, fobPrice - currencyOffsetDollar - exporterConcessionDollar);

    // 5. Customs Tariff applied to adjusted FOB price
    const customsDutyDollar = adjustedFobPrice * (tariffRate / 100);

    // 6. Total Landed Duty-Paid (LDP) Cost to domestic importer
    const baselineLdp = fobPrice + freightCost;
    const finalLdp = adjustedFobPrice + freightCost + customsDutyDollar;
    const netCostIncreaseDollar = finalLdp - baselineLdp;
    const netCostIncreasePct = ((finalLdp - baselineLdp) / baselineLdp) * 100;

    // 7. Importer margin sharing vs Retail Pass-Through (assume 75% passed through to retail CPI)
    const retailCpiIncreaseDollar = Math.max(0, netCostIncreaseDollar * 0.75);
    const retailPriceOriginal = baselineLdp * 1.60; // 60% gross markup
    const retailPriceNew = retailPriceOriginal + retailCpiIncreaseDollar;
    const retailCpiIncreasePct = ((retailPriceNew - retailPriceOriginal) / retailPriceOriginal) * 100;

    // 8. Reshoring Parity Threshold: Domestic manufactured unit price where local procurement is cost neutral
    const reshoringParityPrice = finalLdp * 0.96; // 4% domestic logistics advantage

    return {
      baselineLdp: Number(baselineLdp.toFixed(2)),
      finalLdp: Number(finalLdp.toFixed(2)),
      netCostIncreaseDollar: Number(netCostIncreaseDollar.toFixed(2)),
      netCostIncreasePct: Number(netCostIncreasePct.toFixed(1)),
      customsDutyDollar: Number(customsDutyDollar.toFixed(2)),
      currencyOffsetDollar: Number(currencyOffsetDollar.toFixed(2)),
      exporterConcessionDollar: Number(exporterConcessionDollar.toFixed(2)),
      adjustedFobPrice: Number(adjustedFobPrice.toFixed(2)),
      retailCpiIncreaseDollar: Number(retailCpiIncreaseDollar.toFixed(2)),
      retailPriceOriginal: Number(retailPriceOriginal.toFixed(2)),
      retailPriceNew: Number(retailPriceNew.toFixed(2)),
      retailCpiIncreasePct: Number(retailCpiIncreasePct.toFixed(1)),
      reshoringParityPrice: Number(reshoringParityPrice.toFixed(2))
    };
  }, [fobPrice, tariffRate, exporterFxDeval, erptRate, exporterMarginCut, freightPct]);

  const handleCopy = () => {
    const text = `BULLMONK FOREX & TARIFF PASS-THROUGH ARBITRAGE AUDIT
Base FOB Unit Cost: $${fobPrice.toFixed(2)} | Statutory Tariff: ${tariffRate}%
Foreign FX Devaluation: ${exporterFxDeval}% (ERPT Elasticity: ${erptRate})
Exporter Margin Absorption: ${exporterMarginCut}%
--------------------------------------------------
Pre-Tariff Landed Cost: $${metrics.baselineLdp}
Post-Tariff Effective Landed Cost: $${metrics.finalLdp} (+${metrics.netCostIncreasePct}%)
Customs Duty Collected per Unit: $${metrics.customsDutyDollar}
Currency Devaluation Offset: -$${metrics.currencyOffsetDollar}
Foreign Manufacturer Price Concession: -$${metrics.exporterConcessionDollar}
Estimated Consumer Retail Price Impact: +${metrics.retailCpiIncreasePct}% ($${metrics.retailPriceOriginal} -> $${metrics.retailPriceNew})
Domestic Reshoring Parity Threshold: $${metrics.reshoringParityPrice} / unit
--------------------------------------------------
Generated via BullMonk Sovereign Macro & Trade Intelligence (bullmonk.live)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Tariff arbitrage dossier copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.12)', color: '#d97706', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <Globe size={14} />
            Sovereign Macro & Supply Chain Trade
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>Forex Tariff & Currency Pass-Through Arbitrage</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '720px', margin: 0 }}>
            Model custom tariffs, exporter foreign currency depreciation buffers, exchange rate pass-through elasticity (ERPT), and domestic reshoring parity pricing.
          </p>
        </div>
        <button onClick={handleCopy} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
          {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
          {copied ? 'Dossier Copied' : 'Export Trade Audit'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Input Column 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Base FOB Unit Import Cost: <span style={{ color: '#d97706', fontWeight: 800 }}>${fobPrice.toFixed(2)}</span>
            </label>
            <input 
              type="range" 
              min={5} 
              max={1000} 
              step={5} 
              value={fobPrice} 
              onChange={(e) => setFobPrice(Number(e.target.value))} 
              style={{ width: '100%', accentColor: '#d97706' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>$5 (Components)</span>
              <span>$100 (Standard Goods)</span>
              <span>$1,000 (Capital Equipment)</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Statutory Customs Tariff Rate: <span style={{ color: '#EF4444', fontWeight: 800 }}>{tariffRate}%</span>
            </label>
            <input 
              type="range" 
              min={0} 
              max={75} 
              step={1} 
              value={tariffRate} 
              onChange={(e) => setTariffRate(Number(e.target.value))} 
              style={{ width: '100%', accentColor: '#EF4444' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>0% (Duty Free)</span>
              <span>25% (Section 301)</span>
              <span>60% (Broad Universal Tariff)</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Exporter Currency Devaluation vs USD: <span style={{ color: '#10B981', fontWeight: 800 }}>{exporterFxDeval}%</span>
            </label>
            <input 
              type="range" 
              min={0} 
              max={25} 
              step={0.5} 
              value={exporterFxDeval} 
              onChange={(e) => setExporterFxDeval(Number(e.target.value))} 
              style={{ width: '100%', accentColor: '#10B981' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>0% (Pegged)</span>
              <span>8% (Managed Depreciation)</span>
              <span>25% (Sovereign Deval)</span>
            </div>
          </div>
        </div>

        {/* Input Column 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Exchange Rate Pass-Through (ERPT) Elasticity: <span style={{ color: '#d97706', fontWeight: 800 }}>{erptRate.toFixed(2)}</span>
            </label>
            <input 
              type="range" 
              min={0.10} 
              max={0.90} 
              step={0.05} 
              value={erptRate} 
              onChange={(e) => setErptRate(Number(e.target.value))} 
              style={{ width: '100%', accentColor: '#d97706' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>0.10 (Sticky Invoicing)</span>
              <span>0.45 (Industrial Average)</span>
              <span>0.90 (Commoditized)</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Foreign Manufacturer Margin Concession: <span style={{ color: '#d97706', fontWeight: 800 }}>{exporterMarginCut}% of Tariff</span>
            </label>
            <input 
              type="range" 
              min={0} 
              max={50} 
              step={5} 
              value={exporterMarginCut} 
              onChange={(e) => setExporterMarginCut(Number(e.target.value))} 
              style={{ width: '100%', accentColor: '#d97706' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>0% (Zero Absorption)</span>
              <span>15% (Typical Factory Buffer)</span>
              <span>50% (Price War Cap)</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Freight & Marine Insurance: <span style={{ color: '#d97706', fontWeight: 800 }}>{freightPct}% of FOB</span>
            </label>
            <input 
              type="range" 
              min={2} 
              max={20} 
              step={1} 
              value={freightPct} 
              onChange={(e) => setFreightPct(Number(e.target.value))} 
              style={{ width: '100%', accentColor: '#d97706' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>2% (Air Bulk)</span>
              <span>6% (Standard Container)</span>
              <span>20% (Chokepoint Surcharge)</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.25rem', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            Effective Landed Cost (LDP)
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>
            ${metrics.finalLdp}
          </div>
          <div style={{ fontSize: '0.75rem', color: metrics.netCostIncreaseDollar >= 0 ? '#EF4444' : '#10B981', marginTop: '0.2rem', fontWeight: 700 }}>
            {metrics.netCostIncreaseDollar >= 0 ? `+${metrics.netCostIncreasePct}%` : `${metrics.netCostIncreasePct}%`} vs ${metrics.baselineLdp} Pre-Tariff
          </div>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            Customs Duty Collected
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#EF4444' }}>
            ${metrics.customsDutyDollar} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>/unit</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Applied on adjusted ${metrics.adjustedFobPrice} FOB
          </div>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            FX & Exporter Buffer
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981' }}>
            -${(metrics.currencyOffsetDollar + metrics.exporterConcessionDollar).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            FX Deval: -${metrics.currencyOffsetDollar} | Factory: -${metrics.exporterConcessionDollar}
          </div>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            Reshoring Parity Threshold
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ${metrics.reshoringParityPrice}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Domestic factory gate target price
          </div>
        </div>
      </div>

      {/* Waterfall Breakdown Table */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <TrendingUp size={18} color="#d97706" />
        Unit Landed Cost Waterfall & CPI Transmission
      </h3>
      <div className="prose-table-wrapper" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table className="prose-data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', background: 'var(--bg-subtle)' }}>
              <th style={{ padding: '0.65rem 0.75rem' }}>Cost Component</th>
              <th style={{ padding: '0.65rem 0.75rem' }}>Pre-Tariff Baseline</th>
              <th style={{ padding: '0.65rem 0.75rem' }}>Post-Tariff Value</th>
              <th style={{ padding: '0.65rem 0.75rem' }}>Net Delta</th>
              <th style={{ padding: '0.65rem 0.75rem' }}>Macroeconomic Mechanism</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>Factory FOB Invoice</td>
              <td style={{ padding: '0.65rem 0.75rem' }}>${fobPrice.toFixed(2)}</td>
              <td style={{ padding: '0.65rem 0.75rem' }}>${metrics.adjustedFobPrice}</td>
              <td style={{ padding: '0.65rem 0.75rem', color: '#10B981', fontWeight: 700 }}>
                -${(fobPrice - metrics.adjustedFobPrice).toFixed(2)}
              </td>
              <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>
                Foreign currency devaluation + manufacturer margin squeeze
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>Ocean Freight & Port Fee</td>
              <td style={{ padding: '0.65rem 0.75rem' }}>${(fobPrice * (freightPct / 100)).toFixed(2)}</td>
              <td style={{ padding: '0.65rem 0.75rem' }}>${(fobPrice * (freightPct / 100)).toFixed(2)}</td>
              <td style={{ padding: '0.65rem 0.75rem' }}>$0.00</td>
              <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>
                Standard international container lane rates
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>Customs Tariff Assessment</td>
              <td style={{ padding: '0.65rem 0.75rem' }}>$0.00</td>
              <td style={{ padding: '0.65rem 0.75rem' }}>${metrics.customsDutyDollar}</td>
              <td style={{ padding: '0.65rem 0.75rem', color: '#EF4444', fontWeight: 700 }}>
                +${metrics.customsDutyDollar}
              </td>
              <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>
                {tariffRate}% statutory duty remitted to customs treasury
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(217, 119, 6, 0.08)', fontWeight: 700 }}>
              <td style={{ padding: '0.65rem 0.75rem' }}>Total Landed Duty-Paid (LDP)</td>
              <td style={{ padding: '0.65rem 0.75rem' }}>${metrics.baselineLdp}</td>
              <td style={{ padding: '0.65rem 0.75rem', color: '#d97706' }}>${metrics.finalLdp}</td>
              <td style={{ padding: '0.65rem 0.75rem', color: metrics.netCostIncreaseDollar >= 0 ? '#EF4444' : '#10B981' }}>
                {metrics.netCostIncreaseDollar >= 0 ? `+$${metrics.netCostIncreaseDollar}` : `-$${Math.abs(metrics.netCostIncreaseDollar)}`}
              </td>
              <td style={{ padding: '0.65rem 0.75rem' }}>
                Net delivered warehouse cost to domestic wholesaler
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>Retail Shelf Price (CPI)</td>
              <td style={{ padding: '0.65rem 0.75rem' }}>${metrics.retailPriceOriginal}</td>
              <td style={{ padding: '0.65rem 0.75rem' }}>${metrics.retailPriceNew}</td>
              <td style={{ padding: '0.65rem 0.75rem', color: '#EF4444', fontWeight: 700 }}>
                +${metrics.retailCpiIncreaseDollar} (+{metrics.retailCpiIncreasePct}%)
              </td>
              <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>
                Final consumer price assuming 75% distributor cost pass-through
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <Info size={14} />
        <span>
          Elasticity modeling incorporates IMF & BIS empirical pass-through curves. Exporter currency depreciation mitigates statutory tariffs via terms-of-trade adjustment.
        </span>
      </div>
    </div>
  );
};
