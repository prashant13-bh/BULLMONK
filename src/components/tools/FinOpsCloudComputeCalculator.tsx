import React, { useState, useMemo } from 'react';
import { 
  Cloud, DollarSign, Cpu, ArrowUpRight, ShieldCheck, Download, 
  Layers, HardDrive, Zap, Info, TrendingDown, RefreshCw 
} from 'lucide-react';

interface FinOpsCalculatorProps {
  showToast: (msg: string) => void;
}

type WorkloadType = 'llm-inference' | 'data-warehouse' | 'ai-training' | 'enterprise-web';
type CommitmentTier = 'on-demand' | '1yr-reserved' | '3yr-reserved' | 'spot';

export const FinOpsCloudComputeCalculator: React.FC<FinOpsCalculatorProps> = ({ showToast }) => {
  const [workload, setWorkload] = useState<WorkloadType>('llm-inference');
  const [nodeCount, setNodeCount] = useState<number>(32); // 8-GPU nodes or standard compute nodes
  const [gpuType, setGpuType] = useState<'h100' | 'b200' | 'a100' | 'cpu-general'>('h100');
  const [commitment, setCommitment] = useState<CommitmentTier>('1yr-reserved');
  const [egressTb, setEgressTb] = useState<number>(120); // Terabytes/month
  const [storageTb, setStorageTb] = useState<number>(450); // Terabytes/month
  const [storageFormat, setStorageFormat] = useState<'s3-standard' | 'iceberg-parquet'>('iceberg-parquet');

  // Baseline Hourly Rates per Node (Normalized across AWS / GCP / Azure / CoreWeave)
  const hourlyBaseRates: Record<string, number> = {
    'h100': 32.50,       // 8x SXM5 H100 80GB
    'b200': 48.00,       // 8x Blackwell B200 192GB
    'a100': 19.50,       // 8x A100 80GB
    'cpu-general': 4.80  // 64-vCPU 256GB RAM memory-optimized
  };

  // Discount Multipliers
  const discountMultipliers: Record<CommitmentTier, number> = {
    'on-demand': 1.0,
    '1yr-reserved': 0.62,   // 38% discount
    '3yr-reserved': 0.38,   // 62% discount
    'spot': 0.28            // 72% discount
  };

  // Egress Tier Pricing ($/GB)
  const egressCostPerGb = 0.075; // Standard AWS/Azure internet egress
  // Storage Cost ($/GB/month)
  const storageCostPerGb = storageFormat === 's3-standard' ? 0.023 : 0.0125; // 45% savings with Parquet/Iceberg tiering

  // Quantitative Computations
  const calculations = useMemo(() => {
    const rawHourly = (hourlyBaseRates[gpuType] || 25.0) * nodeCount;
    const discountedHourly = rawHourly * discountMultipliers[commitment];
    const monthlyHours = 730;

    const computeMonthlyOnDemand = rawHourly * monthlyHours;
    const computeMonthlyActual = discountedHourly * monthlyHours;
    const computeSavingsMonthly = computeMonthlyOnDemand - computeMonthlyActual;

    // Egress calculations
    const egressGb = egressTb * 1024;
    const egressMonthlyCost = egressGb * egressCostPerGb;

    // Storage calculations
    const storageGb = storageTb * 1024;
    const storageMonthlyCost = storageGb * storageCostPerGb;

    // Aggregate monthly TCO
    const totalMonthlyTco = computeMonthlyActual + egressMonthlyCost + storageMonthlyCost;
    const annualizedTco = totalMonthlyTco * 12;
    const annualizedSavings = computeSavingsMonthly * 12;

    // Workload-specific metrics
    const totalGpus = (gpuType === 'cpu-general') ? 0 : nodeCount * 8;
    // Estimated tokens/sec per H100 is ~3,500 for 70B model with vLLM
    const tokensPerSec = totalGpus * 420;
    const monthlyTokensBillions = ((tokensPerSec * 3600 * 730 * 0.65) / 1e9); // 65% utilization
    const costPerMillionTokens = monthlyTokensBillions > 0 
      ? (totalMonthlyTco / (monthlyTokensBillions * 1000)) 
      : 0;

    // Private Cloud Colo Breakeven
    // Estimated on-prem CapEx for equivalent hardware amortized over 4 years
    const equivalentHardwareCapex = (nodeCount * 320000) + 150000; // Server + InfiniBand switch fabric
    const monthlyColoPowerOpex = (nodeCount * 10.2 * 730 * 0.085); // 10.2 kW per node @ $0.085/kWh
    const monthlyOnPremTco = (equivalentHardwareCapex / 48) + monthlyColoPowerOpex;
    const privateCloudBreakevenMonths = totalMonthlyTco > monthlyOnPremTco 
      ? Math.round(equivalentHardwareCapex / (totalMonthlyTco - monthlyColoPowerOpex))
      : 48;

    // Percent breakdown
    const computePct = Math.round((computeMonthlyActual / totalMonthlyTco) * 100);
    const egressPct = Math.round((egressMonthlyCost / totalMonthlyTco) * 100);
    const storagePct = 100 - computePct - egressPct;

    return {
      totalGpus,
      computeMonthlyActual,
      computeMonthlyOnDemand,
      computeSavingsMonthly,
      egressMonthlyCost,
      storageMonthlyCost,
      totalMonthlyTco,
      annualizedTco,
      annualizedSavings,
      costPerMillionTokens,
      privateCloudBreakevenMonths,
      computePct,
      egressPct,
      storagePct
    };
  }, [nodeCount, gpuType, commitment, egressTb, storageTb, storageFormat]);

  const handleExportJson = () => {
    const report = {
      auditTimestamp: new Date().toISOString(),
      platform: "BULLMONK FinOps Infrastructure Terminal",
      workloadProfile: workload,
      hardwareConfiguration: {
        nodeCount,
        gpuType,
        totalGpus: calculations.totalGpus,
        commitmentTier: commitment
      },
      dataEgress: {
        monthlyTb: egressTb,
        ratePerGbUsd: egressCostPerGb,
        monthlyEgressCostUsd: calculations.egressMonthlyCost
      },
      storageArchitecture: {
        footprintTb: storageTb,
        tableFormat: storageFormat,
        monthlyStorageCostUsd: calculations.storageMonthlyCost
      },
      financialSummary: {
        monthlyTcoUsd: Math.round(calculations.totalMonthlyTco),
        annualizedTcoUsd: Math.round(calculations.annualizedTco),
        annualizedFinOpsSavingsUsd: Math.round(calculations.annualizedSavings),
        costPerMillionTokensUsd: calculations.costPerMillionTokens.toFixed(4),
        privateCloudRepatriationBreakevenMonths: calculations.privateCloudBreakevenMonths
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bullmonk-finops-tco-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported institutional FinOps TCO Audit Dossier (.json)');
  };

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-lg)',
      padding: 'clamp(1.25rem, 3vw, 2.25rem)',
      boxShadow: '0 8px 30px -4px rgba(15, 23, 42, 0.05)',
      marginBottom: '3rem'
    }}>
      {/* Top Controls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
        
        {/* Workload Profile */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Workload Architecture Profile
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { id: 'llm-inference', label: 'LLM Inference (vLLM)', icon: Cpu },
              { id: 'data-warehouse', label: 'Lakehouse (Iceberg)', icon: HardDrive },
              { id: 'ai-training', label: 'Cluster Pretraining', icon: Zap },
              { id: 'enterprise-web', label: 'Enterprise Egress', icon: Cloud }
            ].map(item => {
              const Icon = item.icon;
              const isActive = workload === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setWorkload(item.id as WorkloadType)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isActive ? 'var(--accent-bronze)' : 'var(--border-medium)'}`,
                    background: isActive ? 'rgba(180, 83, 9, 0.08)' : 'var(--bg-surface-elevated)',
                    color: isActive ? 'var(--accent-bronze)' : 'var(--text-primary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hardware Acceleration Node Type */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Compute Accelerators (Per 8-GPU Node)
          </label>
          <select
            value={gpuType}
            onChange={(e) => setGpuType(e.target.value as any)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.92rem'
            }}
          >
            <option value="h100">8x NVIDIA H100 SXM5 80GB ($32.50/hr on-demand)</option>
            <option value="b200">8x NVIDIA Blackwell B200 192GB ($48.00/hr on-demand)</option>
            <option value="a100">8x NVIDIA A100 SXM4 80GB ($19.50/hr on-demand)</option>
            <option value="cpu-general">64-vCPU AMD EPYC 256GB Memory-Optimized ($4.80/hr)</option>
          </select>

          <div style={{ marginTop: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cluster Size:</span>
              <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {nodeCount} Nodes ({calculations.totalGpus} GPUs)
              </strong>
            </div>
            <input
              type="range"
              min={1}
              max={256}
              value={nodeCount}
              onChange={(e) => setNodeCount(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-bronze)' }}
            />
          </div>
        </div>

        {/* Commitment Model */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            FinOps Discount Commitment Model
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { id: 'on-demand', label: 'On-Demand (0%)' },
              { id: '1yr-reserved', label: '1-Yr Commit (-38%)' },
              { id: '3yr-reserved', label: '3-Yr Commit (-62%)' },
              { id: 'spot', label: 'Spot / Preempt (-72%)' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCommitment(item.id as CommitmentTier)}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${commitment === item.id ? 'var(--accent-green)' : 'var(--border-medium)'}`,
                  background: commitment === item.id ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-elevated)',
                  color: commitment === item.id ? 'var(--accent-green)' : 'var(--text-primary)',
                  fontWeight: commitment === item.id ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="var(--accent-green)" />
            <span>FinOps Foundation Certified Cost Allocation Standard</span>
          </div>
        </div>

      </div>

      {/* Sliders: Egress and Storage */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.75rem', 
        padding: '1.5rem',
        background: 'var(--bg-surface-elevated)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '2.5rem',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Egress Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Monthly Public Internet Egress
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-bronze)' }}>
              {egressTb.toLocaleString()} TB / mo
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={1500}
            step={5}
            value={egressTb}
            onChange={(e) => setEgressTb(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-bronze)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            <span>5 TB</span>
            <span>Est. Egress Tax: ${(calculations.egressMonthlyCost).toLocaleString()} / mo</span>
            <span>1,500 TB</span>
          </div>
        </div>

        {/* Storage Volume & Format */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Data Lakehouse Footprint
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-bronze)' }}>
              {storageTb.toLocaleString()} TB
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={3000}
            step={20}
            value={storageTb}
            onChange={(e) => setStorageTb(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-bronze)' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              onClick={() => setStorageFormat('s3-standard')}
              style={{
                flex: 1,
                padding: '0.35rem',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${storageFormat === 's3-standard' ? 'var(--accent-bronze)' : 'var(--border-subtle)'}`,
                background: storageFormat === 's3-standard' ? 'var(--bg-surface)' : 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              Standard S3 JSON/CSV ($0.023/GB)
            </button>
            <button
              onClick={() => setStorageFormat('iceberg-parquet')}
              style={{
                flex: 1,
                padding: '0.35rem',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${storageFormat === 'iceberg-parquet' ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
                background: storageFormat === 'iceberg-parquet' ? 'var(--bg-surface)' : 'transparent',
                color: storageFormat === 'iceberg-parquet' ? 'var(--accent-green)' : 'var(--text-secondary)',
                fontWeight: storageFormat === 'iceberg-parquet' ? 700 : 400,
                cursor: 'pointer'
              }}
            >
              Apache Iceberg Parquet ($0.0125/GB)
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Results Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        
        {/* Monthly TCO */}
        <div style={{ 
          background: 'var(--bg-surface-elevated)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.25rem',
          borderLeft: '4px solid var(--accent-bronze)'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            PROJECTED MONTHLY TCO
          </span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ${Math.round(calculations.totalMonthlyTco).toLocaleString()}
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Includes compute, bandwidth egress & storage
          </span>
        </div>

        {/* Annualized Spend */}
        <div style={{ 
          background: 'var(--bg-surface-elevated)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.25rem',
          borderLeft: '4px solid var(--accent-blue, #0284c7)'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            ANNUALIZED RUN-RATE
          </span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ${Math.round(calculations.annualizedTco / 1000).toLocaleString()}k
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            12-Month recurring infrastructure commitment
          </span>
        </div>

        {/* FinOps Savings */}
        <div style={{ 
          background: 'var(--bg-surface-elevated)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.25rem',
          borderLeft: '4px solid var(--accent-green)'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-green)', display: 'block', marginBottom: '0.25rem' }}>
            ANNUALIZED FINOPS SAVINGS
          </span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-green)' }}>
            ${Math.round(calculations.annualizedSavings / 1000).toLocaleString()}k
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Compared to baseline unreserved On-Demand
          </span>
        </div>

        {/* Token Cost Unit Economics */}
        <div style={{ 
          background: 'var(--bg-surface-elevated)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.25rem',
          borderLeft: '4px solid #8B5CF6'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            EST. INFERENCE UNIT COST
          </span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ${calculations.costPerMillionTokens > 0 ? calculations.costPerMillionTokens.toFixed(3) : '0.000'}
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Cost per 1 Million Generated Tokens (vLLM)
          </span>
        </div>

      </div>

      {/* Visual TCO Allocation Bar */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Monthly Cost Distribution Breakdown</span>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-bronze)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-bronze)' }}></span>
              Compute ({calculations.computePct}%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EF4444' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }}></span>
              Egress ({calculations.egressPct}%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284c7' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284c7' }}></span>
              Storage ({calculations.storagePct}%)
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: '14px', borderRadius: '7px', background: 'var(--border-subtle)', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${calculations.computePct}%`, background: 'var(--accent-bronze)' }} title={`Compute: ${calculations.computePct}%`}></div>
          <div style={{ width: `${calculations.egressPct}%`, background: '#EF4444' }} title={`Egress: ${calculations.egressPct}%`}></div>
          <div style={{ width: `${calculations.storagePct}%`, background: '#0284c7' }} title={`Storage: ${calculations.storagePct}%`}></div>
        </div>
      </div>

      {/* Private Cloud Repatriation Breakeven Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.05) 0%, rgba(2, 132, 199, 0.05) 100%)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
            🏢 Private Cloud Colocation Repatriation Breakeven: <span style={{ color: 'var(--accent-bronze)' }}>{calculations.privateCloudBreakevenMonths} Months</span>
          </span>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Comparing current cloud OPEX vs capital purchasing {nodeCount} dedicated OEM nodes with Tier-3 datacenter rack power & 100Gbps cross-connects.
          </span>
        </div>

        <button
          onClick={handleExportJson}
          className="btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--accent-bronze)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.85rem',
            padding: '0.65rem 1.15rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Download size={14} /> Export Audit Dossier (.json)
        </button>
      </div>

      {/* Internal Backlink Cards to Dispatches */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.75rem' }}>
          Related Investigative Research Dispatches
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          <a
            href="#article/cloud-finops-hyperscale-datacenter-tco-audit-aws-snowflake-egress-crisis"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              fontWeight: 600
            }}
          >
            <span>The Multicloud FinOps Reckoning: Inside the Egress Tax</span>
            <ArrowUpRight size={14} color="var(--accent-bronze)" />
          </a>
          <a
            href="#tools/ai-power"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              fontWeight: 600
            }}
          >
            <span>Model Megawatt Draw in AI Compute Power Sizer</span>
            <ArrowUpRight size={14} color="var(--accent-bronze)" />
          </a>
        </div>
      </div>

    </div>
  );
};
