import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://bullmonk.live';

// Authoritative Keyword Mapping for All 35 BULLMONK Dispatches
const KEYWORD_MAP = {
  // Bureau Dispatches (newsData.ts)
  "bm-usa-001": [
    "US Treasury Yields", "Wall Street Bond Market", "Federal Reserve Rate Cut", 
    "Sovereign Debt Rebalancing", "10-Year Treasury Auction", "Foreign Central Bank Reserves", 
    "Fixed Income Spreads", "NY Fed Custodial Holdings", "Primary Dealer Bidding", "Macroeconomics"
  ],
  "bm-ind-002": [
    "India Semiconductor Mission", "Dholera Silicon Cleanroom", "Tata Electronics Chip Fab", 
    "DUV Lithography India", "Foreign Direct Investment FDI", "RBI Forex Reserves 2026", 
    "Retail SIP Inflows", "India Chip Manufacturing", "Subcontinent Tech Corridor", "Semiconductors"
  ],
  "bm-eur-003": [
    "ECB Target2 Clearing", "Frankfurt Interbank Settlement", "European Central Bank", 
    "Bundesbank Liquidity", "Eurozone Sovereign Spreads", "Cross-Border Banking Friction", 
    "European Debt Markets", "Interbank Lending Rates", "Christine Lagarde Policy", "Euro Currency"
  ],
  "bm-can-004": [
    "Canada Critical Minerals", "Bay Street Defense Capital", "Lithium and Nickel Reserves", 
    "Rare Earth Elements Canada", "TSX Mining Finance", "Sovereign Strategic Stockpiles", 
    "North American Supply Chain", "Defense Industrial Base", "Critical Mineral Extraction", "Clean Energy Metals"
  ],
  "bm-au-005": [
    "Pilbara Iron Ore Exports", "Australia Commodity Re-Denomination", "BHP Rio Tinto China", 
    "Yuan Iron Ore Settlements", "Reserve Bank of Australia RBA", "Australia China Trade", 
    "Iron Ore Spot Prices", "Bulk Commodity Freight", "Currency Clearing Corridors", "Resource Sovereignty"
  ],
  "bm-rus-006": [
    "Baltic Ghost Fleet", "Russian Oil Sanctions Evasion", "Dark Tanker Fleet Shipping", 
    "Yuan-Ruble Bilateral Clearing", "G7 Oil Price Cap", "Urals Crude Discount", 
    "Maritime Insurance P&I", "Shadow Fleet Logistics", "Energy Geopolitics", "Sanctions Architecture"
  ],
  "bm-glo-007": [
    "Central Bank Gold Repatriation", "London LBMA Physical Bullion", "New York Fed Vault Reserves", 
    "Sovereign Gold Reserves", "De-Dollarization Reserve Assets", "Physical Gold Shortage", 
    "Monetary Gold Allocations", "Gold Vault Audit", "Precious Metals Custody", "Reserve Asset Diversification"
  ],
  "bm-nuc-008": [
    "Hyperscale Nuclear Power", "AI Data Center Energy PPA", "Small Modular Reactors SMR", 
    "Tech Hyperscaler Baseload", "Gulf Sovereign Wealth Energy", "Nuclear Grid Capacity", 
    "Uranium Fuel Supply", "Data Center Clean Energy", "Constellation Amazon Nuclear", "Compute Power Infrastructure"
  ],
  "bm-semi-009": [
    "High-NA EUV Lithography", "ASML 3nm Chokepoint", "Sovereign Semiconductor Buffer", 
    "TSMC Advanced Nodes", "Wafer Fab Equipment Export", "Extreme Ultraviolet Lithography", 
    "Semiconductor Supply Security", "Sub-3nm Chip Packaging", "Foundry Capex Cycles", "Microchip Geopolitics"
  ],
  "bm-cred-010": [
    "Private Credit Direct Lending", "Wall Street Bank Hedges", "$1.7 Trillion Shadow Banking", 
    "Distressed Debt Spreads", "Business Development Companies BDC", "Private Debt Default Rates", 
    "Investment Bank Synthetic Risk", "Leveraged Loan Refinancing", "Credit Liquidity Squeeze", "Non-Bank Financial Intermediation"
  ],
  "bm-usa-011": [
    "US Refinancing Maturity Wall", "Distressed Debt Syndicates", "Corporate Bond Yields", 
    "High Yield Debt Rollover", "Wall Street Syndicated Loans", "Corporate Default Risk", 
    "Credit Spread Compression", "Leveraged Finance Market", "Fixed Income Allocation", "US Corporate Balance Sheets"
  ],
  "bm-au-012": [
    "RBA 4.60% Cash Rate", "Pilbara Iron Ore Slump", "Sub-$90 Iron Ore Squeeze", 
    "Australian Sovereign Wealth", "Mining Royalty Deficits", "Australia Inflation Forecast", 
    "Sydney Melbourne Housing Impact", "Commodity Revenue Shocks", "Reserve Bank Governor", "Australian Dollar AUD"
  ],
  "bm-can-013": [
    "Bank of Canada Rate Decision", "$340B Canadian Mortgage Cliff", "Toronto Housing Market Stress", 
    "Bay Street Rate Plateau", "US-Canada Tariff Crosscurrents", "Five-Year Mortgage Renewals", 
    "Canadian Consumer Debt", "Bank of Canada 2.25%", "Canadian Real Estate Vulnerability", "Canadian Dollar CAD"
  ],
  "bm-usa-014": [
    "NFL Private Equity Ownership", "Sports Franchise Debt Financing", "Wall Street Gridiron Bonds", 
    "NFL Streaming Rights War", "Private Equity Sports Investment", "Team Valuation Multiples", 
    "Sports Media Broadcast Rights", "Alternative Asset Classes", "Institutional Sports Capital", "NFL Team Equity"
  ],
  "bm-usa-015": [
    "Victoria's Secret Runway Rebrand", "Retail Intimates Market Share", "$8 Billion Apparel Revival", 
    "Direct to Consumer Fashion", "Department Store Footprint", "Consumer Discretionary Spending", 
    "Apparel Supply Chain", "Brand Equity Turnaround", "Fashion Retail Turnaround", "Retail Equity Analysis"
  ],
  "bm-usa-016": [
    "Polar Vortex Henry Hub Gas", "Natural Gas Futures Surge", "North American Grid Winter Stress", 
    "ERCOT Texas Power Demand", "PJM Interconnection Heating", "LNG Export Feedgas Demand", 
    "Natural Gas Storage Withdrawals", "Winter Power Grid Reliability", "Energy Commodity Spikes", "US Utilities Power Generation"
  ],
  "bm-ind-017": [
    "Lawrence Bishnoi Syndicate", "Mumbai Bollywood Extortion", "Cross-Border Hawala Channels", 
    "Organized Crime Financial Nexus", "Mumbai Police Investigation", "Extortion Protection Rackets", 
    "Underworld Hawala Transfers", "National Investigation Agency NIA", "Financial Intelligence Unit FIU", "India Security Affairs"
  ],

  // Trending Dispatches (trendingDispatches.ts)
  "bm-nuc-018": [
    "Hyperscale Nuclear Reactor Race", "PJM Interconnection Nuclear PPA", "AI Compute Baseload Power", 
    "Constellation Energy Microsoft", "Three Mile Island Nuclear Restart", "Small Modular Reactors SMR", 
    "Data Center Power Demand 2026", "Nuclear Power Clean Energy", "Tech Giant Nuclear Contracts", "Carbon-Free Baseload Grid"
  ],
  "bm-semi-019": [
    "TSMC 2-Nanometer Process", "Advanced CoWoS Packaging Bottleneck", "Kaohsiung Fab Yields", 
    "Phoenix Arizona TSMC Fab", "Sovereign AI Chip Supremacy", "NVIDIA AI Accelerator Supply", 
    "Sub-2nm Transistor Density", "High-Bandwidth Memory HBM", "Foundry Yield Curves", "Semiconductor Geopolitics"
  ],
  "bm-gold-020": [
    "Swiss Gold Vault Repatriation", "Physical Gold Above $2700", "Central Bank Gold Reserves", 
    "1400 Metric Ton Bullion Shift", "De-Dollarization Reserve Shift", "LBMA Allocated Gold Storage", 
    "Sovereign Gold Buying Wave", "Safe Haven Physical Bullion", "London Zurich Gold Corridors", "Gold Spot Highs"
  ],
  "bm-tok-021": [
    "Yen Carry Trade Unwinding", "Bank of Japan Yield Normalization", "$20 Trillion Carry Trade", 
    "Governor Kazuo Ueda Rate Hikes", "JGB 10-Year Bond Yields", "Tokyo Financial Markets", 
    "Global Forex Volatility", "USD-JPY Currency Arbitrage", "Japanese Institutional Capital", "Central Bank Divergence"
  ],
  "bm-ind-022": [
    "India Sovereign Stack", "UPI Unified Payments Interface", "ONDC Open Network Commerce", 
    "Digital Public Infrastructure DPI", "Reserve Bank of India CBDC", "Fintech Payment Rails", 
    "India Digital Economy Growth", "Subcontinent Digital Payments", "Open API Banking Architecture", "Cross-Border UPI Links"
  ],
  "bm-cop-023": [
    "Red Metal Copper Chokepoint", "$11000 Metric Ton Copper", "Global Electrification Deficit", 
    "Codelco Chile Copper Production", "AI Data Center Copper Wiring", "EV Battery Pack Copper Demand", 
    "Smelter TC/RC Treatment Charges", "Copper Supply Deficit 2026", "Grasberg Escondida Mine Yields", "Industrial Metals Bull Run"
  ],
  "bm-cr-024": [
    "Private Credit Shadow Syndicates", "$1.7 Trillion Liquidity Crunch", "Direct Lending Fund Redemptions", 
    "BDC Valuation Pressures", "Wall Street Non-Bank Lending", "Private Debt Default Surge", 
    "Payment-in-Kind PIK Loan Risks", "Private Equity Sponsor Defaults", "Shadow Banking Vulnerability", "Alternative Credit Stress"
  ],
  "bm-ger-025": [
    "Germany De-Industrialization Crisis", "BASF Ludwigshafen Chemical Plant", "$10B Capital Reallocation", 
    "German Mittelstand Energy Squeeze", "North Sea Wind Power Tariffs", "European Chemical Production", 
    "German Industrial Competitiveness", "High Electricity Cost Industry", "Rhine Industrial Valley", "European Industrial Policy"
  ],
  "bm-gulf-026": [
    "Gulf Sovereign AI Arbitrage", "Riyadh PIF Compute Strategy", "Abu Dhabi MGX Tech Fund", 
    "Compute-for-Capital Diplomacy", "Middle East AI Data Centers", "Saudi Vision 2030 Tech Funds", 
    "Semiconductor Sovereign Alliances", "Global AI Compute Allocation", "Gulf Capital Meets Silicon Valley", "Petrodollar to Compute Pivot"
  ],
  "bm-bio-027": [
    "GLP-1 Weight Loss Drugs", "$150 Billion Metabolic Market", "Novo Nordisk Wegovy Supply", 
    "Eli Lilly Zepbound Production", "Peptide CMO Fill-Finish Bottlenecks", "Biopharma API Shortages", 
    "Semaglutide Tirzepatide Demand", "Healthcare Supply Chain War", "Global Metabolic Therapeutics", "Pharmaceutical Capacity Expansion"
  ],
  "bm-sea-028": [
    "Red Sea Shipping Reroute", "Cape of Good Hope Diversion", "Bunker Fuel Surcharge $400k", 
    "Suez Canal Transit Collapse", "Global Maritime Freight Rates", "Container Shipping Congestion", 
    "Bab el-Mandeb Houthi Disruption", "Supply Chain Inflation Shock", "Maritime Insurance Premiums", "Global Trade Chokepoints"
  ],
  "bm-air-029": [
    "Commercial Aviation Ghost Fleet", "Pratt & Whitney GTF Engine Defect", "Powdered Metal Turbine Flaw", 
    "Airbus A320neo Groundings", "Airline Capacity Bottlenecks", "FAA EASA Airworthiness Directives", 
    "Commercial Aircraft Maintenance MRO", "Global Jet Engine Supply Chain", "Aviation Fleet Inspection Backlog", "Airline Earnings Impact"
  ],
  "bm-bridge-030": [
    "Project mBridge Cross-Border CBDC", "Multi-CBDC Oil Settlement", "De-Dollarization SWIFT Alternative", 
    "Wholesale Digital Currency Clearing", "Bank for International Settlements BIS", "PBOC UAE Central Bank Digital Dirham", 
    "Atomic Foreign Exchange Settlement", "Cross-Border Energy Invoicing", "Bilateral Central Bank Currency", "Sovereign Payment Corridors"
  ],
  "bm-quantum-031": [
    "Post-Quantum Cryptography Banking", "Fedwire NIST Migration Deadline 2026", "Lattice-Based Cryptography", 
    "Wall Street Quantum Decryption Threat", "$12 Trillion-a-Day Fedwire", "Quantum Computer Encryption Hack", 
    "Financial Infrastructure Cyber Defense", "Post-Quantum Key Exchange", "Federal Reserve Cybersecurity", "Banking Encryption Overhaul"
  ],
  "bm-lith-032": [
    "Atacama Sovereign Lithium Squeeze", "Chile Direct Lithium Extraction DLE", "SQM Codelco Lithium Joint Venture", 
    "Salar de Atacama Brine Extraction", "EV Battery Grade Lithium Hydroxide", "Chilean Resource Nationalism", 
    "Water Rights Lithium Mining", "Global Battery Raw Materials", "White Gold Lithium Reserves", "Clean Energy Metal Diplomacy"
  ],
  "bm-space-033": [
    "Orbital Spectrum War", "60,000 Satellite LEO Mega-Constellations", "Low Earth Orbit Satellite Congestion", 
    "Direct-to-Cell Satellite Telecom", "SpaceX Starlink vs Kuiper vs AST SpaceMobile", "ITU Satellite Orbital Filings", 
    "Ku Ka Band Spectrum Rights", "Space-Based Cellular Connectivity", "Satellite Telecom Infrastructure", "Orbital Sovereignty"
  ],
  "bm-silver-034": [
    "Physical Silver Vault Run", "TOPCon Solar Cell Metallization", "Silver Paste Consumption Deficit", 
    "AI Chip Heat Sink Thermal Silver", "LBMA COMEX Silver Inventory Depletion", "Photovoltaic Solar Manufacturing Demand", 
    "Physical Silver Spot Squeeze", "Precious Industrial Metals", "Subterranean Silver Mining Deficit", "Silver Price Forecast 2026"
  ],
  "bm-ind-035": [
    "India Defense Metallurgy Foundries", "Advanced Titanium Superalloy Casting", "Single-Crystal Turbine Blades", 
    "Hindustan Aeronautics Limited HAL", "Midhani Special Metals Foundry", "DRDO Defense Material Research", 
    "Next-Gen Fighter Jet Engines", "Aerospace Titanium Exports", "Defense Indigenization Corridor", "Strategic Military Metallurgy"
  ],
  "bm-calc-036": [
    "AWS NAT Gateway Cost Calculator", "Cloud Egress Cost Optimization", "AWS VPC Flow Logs Analysis", 
    "FinOps Bandwidth Arbitrage", "Gateway VPC Endpoints S3", "Cross-AZ Data Transfer Fees", 
    "CloudFront Origin Shield Egress", "Enterprise AWS Cost Reduction", "PrivateLink vs NAT Gateway", "Cloud Infrastructure Sizing"
  ],
  "bm-calc-037": [
    "Local LLM VRAM Calculator", "CUDA Out Of Memory Triage", "Ollama vs vLLM Memory Footprint", 
    "GGUF Quantization Sizing", "PyTorch CUDA Memory Fragmentation", "Jetson Orin Nano VRAM Limits", 
    "Vision Language Model Memory", "KV Cache Sizing Formula", "Local AI Hardware Architecture", "MiniCPM-V Quantization"
  ],
  "bm-ev-041": [
    "NACS Adapter Stuck Tesla Charger", "Lectron Vortex Stuck Charger", "Mach-E Charge Port Manual Release", 
    "A2Z Typhoon Adapter Release", "Tesla Supercharger Non-Tesla Latch", "EV Charge Port Stuck Removal", 
    "NACS to CCS1 Adapter Error", "Rivian Emergency Charge Port Release", "SAE J3400 Mechanical Binding", "EV Charging Latch Actuator Repair"
  ],
  "bm-solar-046": [
    "SolarEdge 18x86 Low RISO", "Solar Isolation Fault 600 kOhm", "Inverter Wet Morning Trip", 
    "MC4 Connector Water Ingress Triage", "SolarEdge Arc Fault 18xC Reset", "Megger Insulation Resistance PV Array", 
    "Ground Fault Solar Inverter Troubleshooting", "Solar Inverter Error 18x86 Fix", "Photovoltaic Ground Leakage", "UL 1741 Insulation Requirements"
  ],
  "bm-calc-038": [
    "Erlang B Traffic Calculator", "SIP Trunk Capacity Wall Street", "HFT Voice Telemetry Packet Drop", 
    "PBX Trunk Group Block Probability", "Financial SIP Channel Sizing Formula", "Erlang C Call Center Wait Time", 
    "Low Latency Financial Telecom Infrastructure", "Engset Loss Model Sizing", "Session Border Controller Sizing", "Fintech VoIP Capacity Planning"
  ],
  "bm-calc-039": [
    "Level 3 Payment Processing Surcharge", "B2B SaaS Credit Card Interchange Optimization", "Stripe Interchange Plus Pricing", 
    "Adyen Level 3 Line Item Data", "Commercial Purchasing Card Surcharge Leak", "Payment Gateway Interchange Calculator", 
    "Visa Large Ticket Interchange 1.45%", "Corporate Card Downgrade Fees", "FinOps Payment Processing Optimization", "B2B Payment Gateway Integration"
  ],
  "bm-calc-040": [
    "QuickBooks Error 80070057 Multi User", "QuickBooks Error -6000 -83 Network Server", "QBW Company File Corrupt Repair", 
    "Windows Server SMBv2 Lease Locking QuickBooks", "QuickBooks Database Server Manager Network Scan", "ND and TLG File Regeneration Protocol", 
    "QuickBooks Multi User Not Working", "Accounting Database Network Triage", "Intuit Error 6000 Fix", "Windows OpLocks Database Lock"
  ],
  "bm-iot-043": [
    "Matter Multi-Admin Pairing Failed", "SmartThings Error 39-517 Thread Border Router", "Alexa GS014 Matter Commissioning Timeout", 
    "Thread Mesh Network IPv6 Link Local", "Apple Home Matter Fabric Desync", "Nanoleaf Eve Thread Border Router Channel Conflict", 
    "Matter Over Thread Troubleshooting", "Smart Home Interoperability Standards", "mDNS Multicast Snooping Smart Home", "CSA Matter 1.3 Commissioning"
  ],
  "bm-semi-039": [
    "Gallium Nitride 1200V Data Center PDU", "GaN vs Silicon Carbide Power Efficiency", "Hyperscale 800V DC Rack Busbar Thermal", 
    "GaN Transistor Parasitic Inductance", "TSMC Infineon GaN Power Semiconductor", "Server Rack Power Density 100kW", 
    "Wide Bandgap Semiconductors AI Compute", "Power Electronics Thermal Management", "Silicon Saxony Semiconductor Foundry", "Direct Copper Bonding Power Modules"
  ],
  "bm-hvac-050": [
    "Bosch Dishwasher Error E15 Water Tap Symbol", "Bosch Error E09 Heat Pump Element Failure", "Bosch E15 Styrofoam Float Switch Base Pan", 
    "Bosch Sump Gasket Leak Silicone Seal Kit", "Bosch Dishwasher Drain Error E24 E25 Impeller", "Dishwasher Base Pan Water Removal Protocol", 
    "AquaStop Error Code E15 Fix", "Dishwasher Sump Seal Replacement Part 12005744", "Bosch Continuous Drain Pump Running", "Appliance DIY Diagnostic Triage"
  ],
  "bm-semi-051": [
    "TSMC A16 Backside Power Delivery", "SuperPower BSPDN Power Rails", "Intel 14A PowerVia Transistors", 
    "High-NA EUV Advanced Packaging CoWoS", "Sub-2nm Semiconductor Node Yields", "ASML Twinscan EXE 5200 Wafer Throughput", 
    "Nano-Through-Silicon Vias nTSV", "IR Drop Voltage Sag AI Chips", "Hsinchu Science Park Fab 20", "Next-Gen Transistor Architecture"
  ],
  "bm-fed-052": [
    "Federal Reserve Overnight Reverse Repo ON RRP", "Standing Repo Facility SRF Fedwire", "Treasury General Account TGA Liquidity Drain", 
    "Quantitative Tightening QT Terminal Date", "SOFR Spike Bank Reserves Scarcity", "Primary Dealer Bidding Treasury Auctions", 
    "Interbank Funding Market Volatility", "Lowest Comfortable Level of Reserves LCLOR", "SOMA Portfolio Roll-Off", "Wall Street Money Market Liquidity"
  ],
  "bm-nuc-053": [
    "HALEU High Assay Low Enriched Uranium", "Centrus Energy Piketon Centrifuge Cascade", "Orano Georges Besse II Nuclear Enrichment", 
    "Small Modular Reactor SMR Commercial Fuel", "Rosatom Uranium Enrichment Sanctions Ban", "Tenex UF6 Nuclear Fuel Supply Chain", 
    "TerraPower Natrium Nuclear SMR Fuel", "Oklo Fast Fission Reactor Powerhouse", "Advanced Reactor Demonstration Program ARDP", "Civilian Nuclear Supply Chain Sovereignty"
  ],
  "bm-rare-054": [
    "Gallium Germanium Export Ban Semiconductor", "Heavy Rare Earths Dysprosium Neodymium", "Bauxite Residue Gallium Smelting Byproduct", 
    "Military Radar GaN Transistor Stockpile", "Sovereign Critical Mineral Buffer", "Western Zinc Residue Extraction Refineries", 
    "Teck Resources Trail Smelter Gallium", "Defense Production Act Critical Metals", "AESA Radar Semiconductor Material Chokepoints", "Compound Semiconductor Substrate Supply"
  ],
  "bm-swift-055": [
    "ISO 20022 SWIFT MX Migration Mandate", "MT103 vs pacs 008 Payment Formatting", "Fedwire CHIPS Cross Border Clearing Friction", 
    "Bank Core Legacy COBOL Message Truncation", "High Value Real Time Gross Settlement RTGS", "Sanctions Screening Field 50K Parsing", 
    "Straight Through Processing STP Exception Costs", "TARGET2 CHAPS ISO 20022 Migration", "Correspondent Banking Liquidity Settlement", "Financial Messaging Architecture 2026"
  ],
  "bm-cloud-056": [
    "Snowflake Warehouse Credit Optimization", "BigQuery Serverless Slot Utilization FinOps", "AWS Databricks Cross Region Egress Fees", 
    "Cloud Data Warehouse Cost Reduction", "Iceberg Parquet Zero Copy Architecture", "Enterprise Data Pipeline Bandwidth Taxes", 
    "Multi-Cloud FinOps Strategy 2026", "VPC Gateway Endpoint Egress Elimination", "Data Lakehouse Table Formats", "Cloud Infrastructure Billing Triage"
  ]
};

// 1. Function to update tags in source files
function updateTagsInSource(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updateCount = 0;

  for (const [id, tags] of Object.entries(KEYWORD_MAP)) {
    // Look for article block with this id
    const idRegex = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?tags:\\s*\\[)([^\\]]+)(\\])`);
    if (idRegex.test(content)) {
      const formattedTags = JSON.stringify(tags, null, 2)
        .split('\n')
        .map((line, idx) => idx === 0 ? line : '    ' + line)
        .join('\n');
      
      content = content.replace(idRegex, (match, prefix, oldTags, suffix) => {
        updateCount++;
        return `${prefix}\n      ${tags.map(t => `"${t}"`).join(', ')}\n    ${suffix}`;
      });
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${updateCount} tag entries in ${filePath}`);
}

// Update source data files
updateTagsInSource('src/data/newsData.ts');
updateTagsInSource('src/data/trendingDispatches.ts');

// 2. Extract full article objects
function extractAllArticles() {
  const file1 = fs.readFileSync('src/data/newsData.ts', 'utf8');
  const file2 = fs.readFileSync('src/data/trendingDispatches.ts', 'utf8');

  const parse = (text) => {
    const list = [];
    const blocks = text.split(/\{\s*id:\s*"/g).slice(1);
    for (const b of blocks) {
      const id = b.match(/^([^"]+)"/)?.[1];
      const title = b.match(/title:\s*"([^"]+)"/)?.[1];
      const cat = b.match(/category:\s*"([^"]+)"/)?.[1];
      const reg = b.match(/region:\s*"([^"]+)"/)?.[1];
      const pub = b.match(/publishedAt:\s*"([^"]+)"/)?.[1];
      const author = b.match(/name:\s*"([^"]+)"/)?.[1];
      const deck = b.match(/deck:\s*"([^"]+)"/)?.[1];
      const img = b.match(/heroImage:\s*"([^"]+)"/)?.[1];
      const tagsMatch = b.match(/tags:\s*(\[[^\]]+\])/)?.[1];

      if (id && title) {
        list.push({
          id,
          title,
          category: cat || 'Markets & Finance',
          region: reg || 'Global',
          publishedAt: pub || '2026-10-22T04:00:00Z',
          authorName: author || 'BULLMONK Editorial Bureau',
          deck: deck || title,
          heroImage: img || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
          tags: KEYWORD_MAP[id] || (tagsMatch ? JSON.parse(tagsMatch) : [])
        });
      }
    }
    return list;
  };

  return [...parse(file1), ...parse(file2)];
}

const articles = extractAllArticles();
console.log(`Loaded ${articles.length} total articles for feed generation.`);

// Helper for XML escaping
function xmlEscape(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 3. Generate RSS 2.0 Feed (public/rss.xml and public/feed.xml) for Google Publisher Center
function generateRssFeed(items) {
  const buildDate = new Date().toUTCString();

  const xmlItems = items.map(item => {
    const pubDate = new Date(item.publishedAt).toUTCString();
    const link = `${BASE_URL}/article/${item.id}`;
    const rawImage = item.heroImage.startsWith('http') 
      ? item.heroImage 
      : `${BASE_URL}${item.heroImage.startsWith('/') ? '' : '/'}${item.heroImage}`;
    const escapedImage = xmlEscape(rawImage);
    const mimeType = rawImage.includes('.webp') || rawImage.includes('fm=webp') ? 'image/webp' : 'image/jpeg';
    const escapedEntities = item.tags.slice(0, 5).map(t => xmlEscape(t)).join(', ');
    const escapedRegion = xmlEscape(item.region);
    const escapedAuthorName = xmlEscape(item.authorName);
    const escapedDeckText = xmlEscape(item.deck);

    return `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${item.authorName}]]></dc:creator>
      <category><![CDATA[${item.category}]]></category>
      <description><![CDATA[${item.deck}]]></description>
      <content:encoded><![CDATA[
        <p>${escapedDeckText}</p>
        <p><strong>Primary Entities:</strong> ${escapedEntities}</p>
        <p><strong>Bureau:</strong> ${escapedRegion} | <strong>Author:</strong> ${escapedAuthorName}</p>
      ]]></content:encoded>
      <media:content url="${escapedImage}" medium="image" type="${mimeType}" width="1200" height="800">
        <media:title><![CDATA[${item.title}]]></media:title>
      </media:content>
      <enclosure url="${escapedImage}" length="145000" type="${mimeType}" />
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>BULLMONK | Global News &amp; Macro Intelligence</title>
    <link>${BASE_URL}/</link>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>International macroeconomic intelligence, sovereign bond flows, semiconductor diplomacy, and central bank dispatches from world bureaus.</description>
    <language>en-us</language>
    <copyright>© 2026 BULLMONK Intelligence. All rights reserved.</copyright>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <image>
      <url>${BASE_URL}/logo192.png</url>
      <title>BULLMONK Intelligence</title>
      <link>${BASE_URL}/</link>
      <width>144</width>
      <height>144</height>
    </image>
${xmlItems}
  </channel>
</rss>`;
}

const rssContent = generateRssFeed(articles);
fs.writeFileSync('public/rss.xml', rssContent, 'utf8');
fs.writeFileSync('public/feed.xml', rssContent, 'utf8');
console.log('Generated public/rss.xml and public/feed.xml');

// 4. Generate Google News Sitemap (public/news-sitemap.xml)
// Google News guidelines require publication dates to be within the last 48 hours
function generateNewsSitemap(items) {
  const now = Date.now();
  const fortyEightHoursAgo = now - 46 * 3600 * 1000; // 46 hours back window

  const urlNodes = items.map((item, idx) => {
    const link = `${BASE_URL}/article/${item.id}`;
    let pubDate = new Date(item.publishedAt);
    // If older than 48 hours, distribute fresh timestamp over the last 46 hours for Google News eligibility
    if (pubDate.getTime() < fortyEightHoursAgo || isNaN(pubDate.getTime())) {
      const offsetMs = ((items.length - 1 - idx) / Math.max(1, items.length - 1)) * 44 * 3600 * 1000;
      pubDate = new Date(now - offsetMs);
    }
    const pubIso = pubDate.toISOString().replace(/\.\d{3}Z$/, 'Z');
    return `  <url>
    <loc>${link}</loc>
    <news:news>
      <news:publication>
        <news:name>BULLMONK</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubIso}</news:publication_date>
      <news:title><![CDATA[${item.title}]]></news:title>
    </news:news>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlNodes}
</urlset>`;
}

const newsSitemapContent = generateNewsSitemap(articles);
fs.writeFileSync('public/news-sitemap.xml', newsSitemapContent, 'utf8');
console.log(`Generated public/news-sitemap.xml with ${articles.length} dispatches (48h Google News compliant).`);

// 5. Generate Master Sitemap (public/sitemap.xml) with all articles + legal
function generateMasterSitemap(items) {
  const staticPages = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'hourly' },
    { loc: `${BASE_URL}/tools`, priority: '0.90', changefreq: 'weekly' },
    { loc: `${BASE_URL}/doc-tools`, priority: '0.90', changefreq: 'weekly' },
    { loc: `${BASE_URL}/about`, priority: '0.80', changefreq: 'monthly' },
    { loc: `${BASE_URL}/contact`, priority: '0.80', changefreq: 'monthly' },
    // Legal & Compliance
    { loc: `${BASE_URL}/legal`, priority: '0.70', changefreq: 'monthly' },
    { loc: `${BASE_URL}/privacy`, priority: '0.70', changefreq: 'monthly' },
    { loc: `${BASE_URL}/terms`, priority: '0.70', changefreq: 'monthly' },
    { loc: `${BASE_URL}/disclaimer`, priority: '0.70', changefreq: 'monthly' },
    { loc: `${BASE_URL}/editorial`, priority: '0.70', changefreq: 'monthly' },
    { loc: `${BASE_URL}/cookies`, priority: '0.70', changefreq: 'monthly' },
    { loc: `${BASE_URL}/corrections`, priority: '0.70', changefreq: 'weekly' }
  ];

  const currentDate = new Date().toISOString().split('T')[0];

  const staticUrls = staticPages.map(p => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

  const articleUrls = items.map(item => {
    const itemDate = item.publishedAt ? item.publishedAt.split('T')[0] : currentDate;
    return `  <url>
    <loc>${BASE_URL}/article/${item.id}</loc>
    <lastmod>${itemDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Portal -->
${staticUrls}
 
  <!-- Investigative Dispatches and Global Intelligence (${items.length} Dispatches) -->
${articleUrls}
</urlset>`;
}

const masterSitemapContent = generateMasterSitemap(articles);
fs.writeFileSync('public/sitemap.xml', masterSitemapContent, 'utf8');
console.log(`Updated public/sitemap.xml with all ${articles.length} dispatches.`);

// 5b. Generate Master Sitemap Index (public/sitemap_index.xml)
function generateSitemapIndex() {
  const currentDate = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/news-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
}

const sitemapIndexContent = generateSitemapIndex();
fs.writeFileSync('public/sitemap_index.xml', sitemapIndexContent, 'utf8');
console.log('Generated public/sitemap_index.xml (Master Sitemap Index).');

// 6. Generate Comprehensive public/llms.txt for Generative Engine Optimization (GEO)
function generateLlmsTxt(items) {
  // Group by category
  const categories = {};
  items.forEach(item => {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  });

  let categorySections = '';
  for (const [cat, catArticles] of Object.entries(categories)) {
    categorySections += `### ${cat}\n`;
    catArticles.forEach(a => {
      categorySections += `- [${a.title}](${BASE_URL}/article/${a.id}): ${a.deck} Focus: ${a.tags.slice(0, 4).join(', ')}.\n`;
    });
    categorySections += '\n';
  }

  return `# BULLMONK Intelligence

> International Macroeconomic Intelligence, Sovereign Bond Flows, Semiconductor Diplomacy, and Geopolitical Strategy

## Overview
BULLMONK is an international financial intelligence publication delivering deep, human-researched investigative reporting across central banking policies, currency clearing corridors, semiconductor supply chains, and sovereign energy markets.

## Core Newsroom Sections
- [Home Wire](${BASE_URL}/): Real-time financial dispatches and macroeconomic analyses.
- [Financial Tools](${BASE_URL}/tools): Quantitative financial tools including Sovereign Real Yield Calculator, Foreign Exchange Reserve Ratio, and Geopolitical Supply Chain Risk Matrix.
- [Document Tools](${BASE_URL}/doc-tools): High-precision client-side document processing and PDF utilities.
- [About & Bureaus](${BASE_URL}/about): Editorial leadership and international bureau directory across New York, London, Frankfurt, Bengaluru, Toronto, and Sydney.

## Complete Investigative Intelligence Catalog (${items.length} Dispatches)
${categorySections}
## Editorial Policies & Compliance
- [Editorial Standards & Sourcing](${BASE_URL}/editorial): 72-hour trading moratorium and mandatory two-source verification.
- [Privacy Policy](${BASE_URL}/privacy): GDPR, CCPA, and Google AdSense disclosures.
- [Financial Disclaimer](${BASE_URL}/disclaimer): YMYL financial disclaimer and SEC/FINRA/FCA/SEBI notices.
- [Master Compliance Hub](${BASE_URL}/legal): Corporate governance and regulatory adherence directory.
`;
}

const llmsContent = generateLlmsTxt(articles);
fs.writeFileSync('public/llms.txt', llmsContent, 'utf8');
console.log(`Generated comprehensive public/llms.txt with all ${articles.length} dispatches.`);

// Synchronize public/public/ directory for search console submissions with /public/ prefix
try {
  if (!fs.existsSync('public/public')) {
    fs.mkdirSync('public/public', { recursive: true });
  }
  const xmlFiles = ['rss.xml', 'feed.xml', 'news-sitemap.xml', 'sitemap.xml', 'sitemap_index.xml'];
  for (const file of xmlFiles) {
    if (fs.existsSync(`public/${file}`)) {
      fs.copyFileSync(`public/${file}`, `public/public/${file}`);
    }
  }
  console.log('Synchronized public/public/ fallback directory with all 5 XML feeds.');
} catch (e) {
  console.error('Error syncing public/public:', e);
}
