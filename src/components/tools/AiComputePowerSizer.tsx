import React, { useState, useMemo } from 'react';
import { Zap, Cpu, Copy, Check, ShieldCheck, Info } from 'lucide-react';

interface AiComputePowerSizerProps {
  showToast: (msg: string) => void;
}

export const AiComputePowerSizer: React.FC<AiComputePowerSizerProps> = ({ showToast }) => {
  const [chipModel, setChipModel] = useState<'h100' | 'b200' | 'gb200' | 'mi300x'>('gb200');
  const [gpuCount, setGpuCount] = useState<number>(32768);
  const [pue, setPue] = useState<number>(1.15); // Power Usage Effectiveness
  const [ppaRate, setPpaRate] = useState<number>(85); // $ / MWh
  const [auxiliaryPct, setAuxiliaryPct] = useState<number>(25); // Host CPU, InfiniBand & Storage
  const [copied, setCopied] = useState(false);

  const metrics = useMemo(() => {
    const tdpLookup: Record<string, { watts: number; name: string; rackKw: number; chipsPerRack: number }> = {
      h100: { watts: 700, name: 'NVIDIA H100 SXM5', rackKw: 40, chipsPerRack: 32 },
      b200: { watts: 1000, name: 'NVIDIA B200 NVL', rackKw: 75, chipsPerRack: 32 },
      gb200: { watts: 1700, name: 'NVIDIA GB200 NVL72', rackKw: 120, chipsPerRack: 72 },
      mi300x: { watts: 750, name: 'AMD Instinct MI300X', rackKw: 45, chipsPerRack: 32 }
    };
    const chip = tdpLookup[chipModel] || tdpLookup.gb200;
    const baseGpuWatts = gpuCount * chip.watts;
    const itLoadWatts = baseGpuWatts * (1 + (auxiliaryPct / 100));
    const totalFacilityWatts = itLoadWatts * pue;
    const totalMw = totalFacilityWatts / 1000000;
    const annualGwh = (totalMw * 8760) / 1000;
    const annualElectricityCost = (annualGwh * 1000) * ppaRate;
    const monthlyCost = annualElectricityCost / 12;
    const smrNuclearUnits = Math.max(1, Math.ceil(totalMw / 77)); // 77MW NuScale SMR Module
    const coolingTons = totalMw * 284.345;
    const racksCount = Math.ceil(gpuCount / chip.chipsPerRack);

    return {
      chipName: chip.name,
      totalMw: Number(totalMw.toFixed(2)),
      annualGwh: Math.round(annualGwh),
      annualCost: Math.round(annualElectricityCost),
      monthlyCost: Math.round(monthlyCost),
      smrNuclearUnits,
      coolingTons: Math.round(coolingTons),
      racksCount,
      rackKw: chip.rackKw
    };
  }, [chipModel, gpuCount, pue, ppaRate, auxiliaryPct]);

  const handleCopy = () => {
    const text = `BULLMONK AI CLUSTER POWER & PPA RATE DOSSIER
Architecture: ${metrics.chipName} | Chip Count: ${gpuCount.toLocaleString()}
PUE Efficiency: ${pue} | PPA Rate: $${ppaRate}/MWh
Total Continuous Power Draw: ${metrics.totalMw} MW
Annual Energy Consumption: ${metrics.annualGwh.toLocaleString()} GWh/yr
Annual Power Bill: $${metrics.annualCost.toLocaleString()} / year ($${metrics.monthlyCost.toLocaleString()}/mo)
Required Nuclear Capacity: ${metrics.smrNuclearUnits}x 77MW SMR Modules
Estimated Racks: ${metrics.racksCount} racks @ ${metrics.rackKw} kW/rack
Direct Liquid Cooling Load: ${metrics.coolingTons.toLocaleString()} Tons Refrigeration
Generated via BullMonk Financial Intelligence Suite (bullmonk.live)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('AI Power Sizing Dossier copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section style={{ animation: 'fadeIn 0.25s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Input Configuration Card */}
        <div className="card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="var(--accent-gold)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Cluster Architecture Sizer</h2>
            </div>
            <span className="badge" style={{ background: 'rgba(180, 83, 9, 0.1)', color: 'var(--accent-gold)', fontSize: '0.72rem', fontWeight: 700 }}>
              Hyperscale Tier
            </span>
          </div>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="ai-chip-select" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Accelerator Node Model</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{metrics.chipName}</span>
              </label>
              <select
                id="ai-chip-select"
                value={chipModel}
                onChange={(e: any) => setChipModel(e.target.value)}
                className="form-control"
              >
                <option value="h100">NVIDIA H100 SXM5 (700W TDP, 40kW/rack)</option>
                <option value="b200">NVIDIA B200 NVL (1,000W TDP, 75kW/rack)</option>
                <option value="gb200">NVIDIA GB200 NVL72 (1,700W Superchip, 120kW/rack)</option>
                <option value="mi300x">AMD Instinct MI300X (750W TDP, 45kW/rack)</option>
              </select>
            </div>

            <div>
              <label htmlFor="ai-gpu-count-input" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Total GPU Accelerators Deployed</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{gpuCount.toLocaleString()} Chips</span>
              </label>
              <input
                id="ai-gpu-count-input"
                type="number"
                min={512}
                max={262144}
                step={1024}
                value={gpuCount}
                onChange={(e) => setGpuCount(Math.max(512, Number(e.target.value)))}
                className="form-control"
              />
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                {[4096, 16384, 32768, 65536, 131072].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setGpuCount(cnt)}
                    style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-medium)', background: gpuCount === cnt ? 'var(--accent-gold)' : 'var(--bg-surface)', color: gpuCount === cnt ? '#fff' : 'var(--text-primary)', cursor: 'pointer' }}
                  >
                    {cnt >= 1000 ? `${cnt / 1000}k` : cnt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="ai-pue-input" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Cooling Efficiency (PUE Factor)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{pue} PUE</span>
              </label>
              <input
                id="ai-pue-input"
                type="number"
                min={1.05}
                max={1.80}
                step={0.01}
                value={pue}
                onChange={(e) => setPue(Number(e.target.value))}
                className="form-control"
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                1.10 - 1.15 = Direct-to-Chip Liquid Cooling • 1.40+ = Legacy Air Cooling
              </div>
            </div>

            <div>
              <label htmlFor="ai-ppa-input" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Wholesale Power Purchase Agreement ($/MWh)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>${ppaRate} / MWh</span>
              </label>
              <input
                id="ai-ppa-input"
                type="number"
                min={30}
                max={250}
                step={5}
                value={ppaRate}
                onChange={(e) => setPpaRate(Number(e.target.value))}
                className="form-control"
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Equivalent to ${(ppaRate / 10).toFixed(2)}¢ per kilowatt-hour (kWh)
              </div>
            </div>

            <div>
              <label htmlFor="ai-aux-input" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Auxiliary Networking &amp; Host Overhead (%)</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{auxiliaryPct}%</span>
              </label>
              <input
                id="ai-aux-input"
                type="number"
                min={10}
                max={50}
                step={1}
                value={auxiliaryPct}
                onChange={(e) => setAuxiliaryPct(Number(e.target.value))}
                className="form-control"
              />
            </div>
          </form>
        </div>

        {/* Results Dashboard Card */}
        <div className="card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-surface-elevated) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color="var(--accent-green)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Baseload Power Telemetry</h2>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 600 }}>
              <ShieldCheck size={14} /> IEEE 3000 Standard Model
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.3rem' }}>
                Continuous Load
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>
                {metrics.totalMw} <span style={{ fontSize: '0.9rem' }}>MW</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                ~{metrics.racksCount} racks @ {metrics.rackKw}kW
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.3rem' }}>
                Annual Energy
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {metrics.annualGwh.toLocaleString()} <span style={{ fontSize: '0.9rem' }}>GWh</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                8,760 continuous hours
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.3rem' }}>
                Annual Power Bill
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--accent-red)' }}>
                ${(metrics.annualCost / 1000000).toFixed(1)} <span style={{ fontSize: '0.9rem' }}>M</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                ${metrics.monthlyCost.toLocaleString()}/month
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.3rem' }}>
                Nuclear Equivalent
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>
                {metrics.smrNuclearUnits}x <span style={{ fontSize: '0.85rem' }}>SMRs</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                77MW NuScale modules
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.25rem' }}>
              <span>Direct Liquid Cooling Thermal Load:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>{metrics.coolingTons.toLocaleString()} Tons Refrigeration</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              At {metrics.rackKw} kW per rack, high-density server rows require closed-loop Coolant Distribution Units (CDUs) delivering 30°C to 40°C warm-water loops to avoid evaporative water cooling stress.
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCopy}
            style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
          >
            {copied ? <Check size={14} color="var(--accent-green)" /> : <Copy size={14} />}
            <span>{copied ? 'Dossier Copied' : 'Export AI Power Sizing Dossier'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
