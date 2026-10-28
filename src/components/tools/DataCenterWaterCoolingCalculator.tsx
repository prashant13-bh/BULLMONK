import React, { useState, useMemo } from 'react';
import { Droplets, Info, Copy, Check, ShieldAlert, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface DataCenterWaterCoolingCalculatorProps {
  showToast: (msg: string) => void;
}

export const DataCenterWaterCoolingCalculator: React.FC<DataCenterWaterCoolingCalculatorProps> = ({ showToast }) => {
  const [itCapacityMw, setItCapacityMw] = useState<number>(100);
  const [coolingSystem, setCoolingSystem] = useState<'dtc' | 'hybrid' | 'traditional' | 'immersion'>('dtc');
  const [climateZone, setClimateZone] = useState<'arid' | 'temperate' | 'subtropical' | 'nordic'>('temperate');
  const [waterRatePerKgal, setWaterRatePerKgal] = useState<number>(6.50); // $ / 1,000 Gallons
  const [pue, setPue] = useState<number>(1.18);
  const [copied, setCopied] = useState(false);

  const metrics = useMemo(() => {
    // Base WUE in Liters per kWh of IT energy (ASHRAE standard)
    const systemLookup: Record<string, { name: string; baseWue: number; description: string; capexMultiplier: string }> = {
      dtc: {
        name: 'Direct-to-Chip Liquid + Closed Loop Dry Coolers',
        baseWue: 0.08,
        description: 'PGW loop to cold plates, closed secondary loop with adiabatic dry trim. Minimal water evaporation.',
        capexMultiplier: 'Moderate (+18% vs Air)'
      },
      hybrid: {
        name: 'Hybrid Economizer + Indirect Evaporative (IDEC)',
        baseWue: 0.45,
        description: 'Sensible heat wheels with water misting during peak ambient conditions above 27°C wet bulb.',
        capexMultiplier: 'Balanced Standard'
      },
      traditional: {
        name: 'Traditional Chilled Water + Open Evaporative Towers',
        baseWue: 1.80,
        description: 'Continuous latent heat rejection via open cooling towers. High evaporative losses and blowdown bleed.',
        capexMultiplier: 'Lowest Initial CapEx'
      },
      immersion: {
        name: 'Two-Phase / Single-Phase Immersion Cooling Tank',
        baseWue: 0.02,
        description: 'Dielectric fluid tank circulation directly to ambient dry coolers. Near-zero water consumption.',
        capexMultiplier: 'High (+42% Special Tanks)'
      }
    };

    // Climate factors
    const climateLookup: Record<string, { multiplier: number; name: string; ambientDesc: string }> = {
      arid: { multiplier: 1.35, name: 'Hot & Arid (Phoenix / Riyadh / Dubai)', ambientDesc: 'High dry-bulb, low humidity forces extended evaporative cooling cycles.' },
      temperate: { multiplier: 1.00, name: 'Temperate Continental (Ashburn VA / Frankfurt)', ambientDesc: 'Balanced seasonal profile with 3,200 annual economizer hours.' },
      subtropical: { multiplier: 1.15, name: 'Humid Subtropical (Singapore / Atlanta / Mumbai)', ambientDesc: 'High wet-bulb temperatures limit natural dry cooler efficiency.' },
      nordic: { multiplier: 0.65, name: 'Cool Maritime / Nordic (Dublin / Luleå / Oregon)', ambientDesc: 'Over 6,500 annual free-cooling hours; dry coolers handle 85% of load.' }
    };

    const sys = systemLookup[coolingSystem] || systemLookup.dtc;
    const climate = climateLookup[climateZone] || climateLookup.temperate;

    const effectiveWue = sys.baseWue * climate.multiplier;
    const annualHours = 8760;
    const annualItKwh = itCapacityMw * 1000 * annualHours;
    const annualTotalKwh = annualItKwh * pue;

    // Total water in Liters
    const annualLiters = annualItKwh * effectiveWue;
    // 1 Gallon = 3.78541 Liters
    const annualGallons = annualLiters / 3.78541;
    const millionGallons = annualGallons / 1000000;
    const megaliters = annualLiters / 1000000;

    // Daily and peak rates
    const dailyGallons = annualGallons / 365;
    const peakDailyGallons = dailyGallons * 1.85; // Peak summer cooling spike
    const litersPerSecond = annualLiters / (365 * 24 * 3600);
    const peakLitersPerSecond = litersPerSecond * 1.85;

    // Household equivalents (EPA average: 300 gallons/day/household)
    const householdEquiv = Math.round(dailyGallons / 300);

    // Annual Water & Sewer Utility Bill
    const annualWaterCost = (annualGallons / 1000) * waterRatePerKgal;
    const monthlyWaterCost = annualWaterCost / 12;

    // Green Grid WUE Rating
    let ratingTier = 'Superior Water Stewardship';
    let ratingColor = '#10B981'; // Green
    if (effectiveWue > 1.2) {
      ratingTier = 'Severe Municipal Water Strain (High Regulatory Risk)';
      ratingColor = '#EF4444';
    } else if (effectiveWue > 0.35) {
      ratingTier = 'Moderate Consumption (Permit Scrutiny in Drought Zones)';
      ratingColor = '#F59E0B';
    }

    // Comparative calculations across all 4 architectures
    const comparison = Object.entries(systemLookup).map(([key, item]) => {
      const compWue = item.baseWue * climate.multiplier;
      const compLiters = annualItKwh * compWue;
      const compGallons = compLiters / 3.78541;
      const compMg = compGallons / 1000000;
      const compCost = (compGallons / 1000) * waterRatePerKgal;
      const compHouseholds = Math.round((compGallons / 365) / 300);
      return {
        key,
        name: item.name,
        wue: Number(compWue.toFixed(3)),
        millionGallons: Number(compMg.toFixed(2)),
        annualCost: Math.round(compCost),
        households: compHouseholds,
        selected: key === coolingSystem
      };
    });

    return {
      sysName: sys.name,
      climateName: climate.name,
      description: sys.description,
      effectiveWue: Number(effectiveWue.toFixed(3)),
      annualLiters: Math.round(annualLiters),
      annualGallons: Math.round(annualGallons),
      millionGallons: Number(millionGallons.toFixed(2)),
      megaliters: Number(megaliters.toFixed(2)),
      dailyGallons: Math.round(dailyGallons),
      peakDailyGallons: Math.round(peakDailyGallons),
      litersPerSecond: Number(litersPerSecond.toFixed(2)),
      peakLitersPerSecond: Number(peakLitersPerSecond.toFixed(2)),
      householdEquiv,
      annualWaterCost: Math.round(annualWaterCost),
      monthlyWaterCost: Math.round(monthlyWaterCost),
      ratingTier,
      ratingColor,
      comparison,
      annualTotalKwh
    };
  }, [itCapacityMw, coolingSystem, climateZone, waterRatePerKgal, pue]);

  const handleCopy = () => {
    const text = `BULLMONK DATA CENTER WATER INTENSITY & WUE AUDIT
IT Capacity: ${itCapacityMw} MW | Facility PUE: ${pue}
Cooling Architecture: ${metrics.sysName}
Climate Zone: ${metrics.climateName}
Effective WUE: ${metrics.effectiveWue} L/kWh | Green Grid Rating: ${metrics.ratingTier}
--------------------------------------------------
Annual Water Consumption: ${metrics.millionGallons} Million Gallons (${metrics.megaliters} Megaliters)
Daily Average Water Draw: ${metrics.dailyGallons.toLocaleString()} Gallons/Day (${metrics.litersPerSecond} L/sec)
Summer Peak Water Draw: ${metrics.peakDailyGallons.toLocaleString()} Gallons/Day (${metrics.peakLitersPerSecond} L/sec)
Equivalent Municipal Households: ${metrics.householdEquiv.toLocaleString()} Homes/Year
Annual Water Utility OPEX: $${metrics.annualWaterCost.toLocaleString()} ($${metrics.monthlyWaterCost.toLocaleString()}/mo @ $${waterRatePerKgal}/kgal)
--------------------------------------------------
Generated via BullMonk Data Center Infrastructure Intelligence (bullmonk.live)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Water intensity dossier copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.12)', color: '#0284c7', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <Droplets size={14} />
            Hyperscale Infrastructure Engineering
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>Data Center Water Usage & WUE Sizer</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '720px', margin: 0 }}>
            Model municipal water consumption, daily evaporative draw, Water Usage Effectiveness (WUE L/kWh), and watershed utility OPEX across Direct-to-Chip, hybrid dry coolers, and evaporative towers.
          </p>
        </div>
        <button onClick={handleCopy} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
          {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
          {copied ? 'Dossier Copied' : 'Export Water Audit'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Controls Column 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              IT Capacity Load: <span style={{ color: '#0284c7', fontWeight: 800 }}>{itCapacityMw} MW</span>
            </label>
            <input 
              type="range" 
              min={10} 
              max={500} 
              step={10} 
              value={itCapacityMw} 
              onChange={(e) => setItCapacityMw(Number(e.target.value))} 
              style={{ width: '100%', accentColor: '#0284c7' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>10 MW (Edge)</span>
              <span>100 MW (Standard)</span>
              <span>500 MW (Gigawatt Campus)</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Cooling System Architecture
            </label>
            <select 
              value={coolingSystem} 
              onChange={(e) => setCoolingSystem(e.target.value as any)} 
              className="form-control"
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            >
              <option value="dtc">Direct-to-Chip Liquid + Closed Dry Coolers (0.08 L/kWh)</option>
              <option value="hybrid">Hybrid Economizer + Indirect Evaporative IDEC (0.45 L/kWh)</option>
              <option value="traditional">Traditional Chilled Water + Open Cooling Towers (1.80 L/kWh)</option>
              <option value="immersion">Submerged Immersion Tank (0.02 L/kWh)</option>
            </select>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              {metrics.description}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Regional Climate Zone
            </label>
            <select 
              value={climateZone} 
              onChange={(e) => setClimateZone(e.target.value as any)} 
              className="form-control"
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            >
              <option value="temperate">Temperate Continental (Ashburn VA / Frankfurt / Chicago) - 1.0x</option>
              <option value="arid">Hot & Arid (Phoenix AZ / Riyadh / Dubai) - 1.35x Multiplier</option>
              <option value="subtropical">Humid Subtropical (Singapore / Atlanta / Mumbai) - 1.15x</option>
              <option value="nordic">Cool Maritime / Nordic (Dublin / Luleå Sweden / Oregon) - 0.65x</option>
            </select>
          </div>
        </div>

        {/* Controls Column 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Facility Power Usage Effectiveness (PUE): <span style={{ color: '#0284c7', fontWeight: 800 }}>{pue}</span>
            </label>
            <input 
              type="range" 
              min={1.05} 
              max={1.60} 
              step={0.01} 
              value={pue} 
              onChange={(e) => setPue(Number(e.target.value))} 
              style={{ width: '100%', accentColor: '#0284c7' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>1.05 (High-Eff Liquid)</span>
              <span>1.20 (Modern Cloud)</span>
              <span>1.55 (Legacy Air)</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Municipal Water & Sewer Utility Tariff: <span style={{ color: '#0284c7', fontWeight: 800 }}>${waterRatePerKgal.toFixed(2)} / 1,000 Gallons</span>
            </label>
            <input 
              type="range" 
              min={2.00} 
              max={18.00} 
              step={0.50} 
              value={waterRatePerKgal} 
              onChange={(e) => setWaterRatePerKgal(Number(e.target.value))} 
              style={{ width: '100%', accentColor: '#0284c7' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>$2.00 (Rural Well)</span>
              <span>$6.50 (Loudoun VA)</span>
              <span>$18.00 (Drought Tier 3)</span>
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <ShieldAlert size={16} color={metrics.ratingColor} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: metrics.ratingColor }}>
                Water Resource Regulatory Posture
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {metrics.ratingTier}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.25rem', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            Annual Water Draw
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7' }}>
            {metrics.millionGallons} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>MGal</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {metrics.megaliters} Megaliters / Year
          </div>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            Daily Water Draw
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {metrics.dailyGallons.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>gal/day</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Peak: {metrics.peakDailyGallons.toLocaleString()} gal/day ({metrics.peakLitersPerSecond} L/s)
          </div>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            Equivalent Households
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F59E0B' }}>
            {metrics.householdEquiv.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Homes</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Based on 300 gal/day EPA single family
          </div>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            Annual Water Utility Bill
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981' }}>
            ${(metrics.annualWaterCost / 1000).toFixed(1)}k <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>/yr</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            ${metrics.monthlyWaterCost.toLocaleString()} / month
          </div>
        </div>
      </div>

      {/* Comparative Architecture Table */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Layers size={18} color="#0284c7" />
        Architectural Comparison Matrix ({itCapacityMw} MW IT Load in {metrics.climateName})
      </h3>
      <div className="prose-table-wrapper" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table className="prose-data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', background: 'var(--bg-subtle)' }}>
              <th style={{ padding: '0.65rem 0.75rem' }}>Cooling Architecture</th>
              <th style={{ padding: '0.65rem 0.75rem' }}>WUE (L/kWh)</th>
              <th style={{ padding: '0.65rem 0.75rem' }}>Annual Water Draw</th>
              <th style={{ padding: '0.65rem 0.75rem' }}>Household Equivalent</th>
              <th style={{ padding: '0.65rem 0.75rem' }}>Annual Utility Cost</th>
            </tr>
          </thead>
          <tbody>
            {metrics.comparison.map((row) => (
              <tr 
                key={row.key} 
                style={{ 
                  borderBottom: '1px solid var(--border-subtle)',
                  background: row.selected ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                  fontWeight: row.selected ? 700 : 400
                }}
              >
                <td style={{ padding: '0.65rem 0.75rem' }}>
                  {row.name} {row.selected && <span style={{ color: '#0284c7', fontSize: '0.75rem', marginLeft: '0.25rem' }}>(Active)</span>}
                </td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{row.wue}</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{row.millionGallons} MGal</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{row.households.toLocaleString()} homes</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>${row.annualCost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <Info size={14} />
        <span>
          Formulas based on The Green Grid (TGG) Water Usage Effectiveness standard (WUE = Annual Facility Water Consumption in Liters / IT Equipment Energy in kWh). Ashburn & Phoenix regional water utility schedules applied.
        </span>
      </div>
    </div>
  );
};
