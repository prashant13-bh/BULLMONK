---
name: adsense-compliance
description: Strict Google AdSense publisher policies, YMYL financial guidelines, and ads.txt verification rules.
---

# Google AdSense Publisher Compliance Skill

Enforces full compliance with Google Publisher Policies, Google Search Quality Rater Guidelines (E-E-A-T and YMYL), and statutory privacy directives.

## 1. Google AdSense Publisher Parameters
- **Publisher Client ID**: `ca-pub-7155174810446636`
- **Global Google Analytics ID**: `G-CKPQGSX23W`
- **Canonical Root**: `https://bullmonk.live/`
- **ads.txt**: Must exist in `/public/ads.txt` containing:
  ```
  google.com, pub-7155174810446636, DIRECT, f08c47fec0942fa0
  ```

## 2. Ad Placement Rules
- Ads must never be positioned in a manner that induces accidental clicks.
- Ads must be clearly demarcated from editorial content using the standard `COMMERCIAL ADVERTISEMENT` label.
- Maintain a minimum 20px padding between ad containers and interactive buttons or story text.
- Do not place more than one prominent ad above the fold on mobile viewports.

## 3. Mandatory Legal & Privacy Disclosures
Every deployed instance must provide dedicated separate URLs and pages for:
1. **Privacy Policy**: Explicit disclosure of DoubleClick DART cookies, third-party vendor advertising, and links to opt out at `google.com/settings/ads` and `aboutads.info/choices`.
2. **Financial & YMYL Disclaimer**: Statement clarifying non-fiduciary status, absence of investment advisory registration (SEC/FINRA/FCA/SEBI), and high risk of capital loss in financial markets.
3. **Terms of Service**: Intellectual property rights, 150-word fair use quotation limits, and prohibition of unauthorized AI crawler ingestion.
4. **Cookie Telemetry Policy**: Categorized breakdown of Essential, AdSense, and Analytics cookies with client-side opt-out controls.
5. **Editorial Standards**: Commitment to two-source verification, newsroom-commercial firewall, and 72-hour trading moratorium.
6. **Corrections Protocol**: Public corrections ledger and errata submission channels.
