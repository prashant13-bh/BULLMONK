# BULLMONK Newsroom & Engineering Architecture

## 1. Project Overview
BULLMONK is a premier international news and financial intelligence platform delivering investigative journalism, macroeconomic research, semiconductor diplomacy, and sovereign market dispatches.

## 2. Core Technical Mandates
- **Technology Stack**: React 19 + TypeScript + Vite. Pure Vanilla CSS (`src/styles/index.css`). No Tailwind CSS.
- **Production Domain**: `https://bullmonk.live/` (Strict canonical URL, OpenGraph, sitemaps, RSS feeds, and schema.org).
- **Theme Default**: Prestige Paper (`#F8F9FA` background, `#FFFFFF` surfaces, `#0F172A` text, `#B45309` bronze gold). Optional Night Terminal theme stored in `BULLMONK_REACT_THEME`.
- **Performance Targets**: 95+ PageSpeed on Mobile and Desktop, 100 Accessibility, 100 SEO, 100 Best Practices.
- **Monetization & Analytics**:
  - Google AdSense ID: `ca-pub-7155174810446636`
  - Google Analytics ID: `G-CKPQGSX23W`
  - Public `ads.txt` present in `/public/ads.txt`.

## 3. Dedicated Legal Architecture
Every legal and governance document is maintained as a dedicated separate page with its own semantic breadcrumbs and cross-links:
- `/#privacy` -> `PrivacyPolicyPage.tsx`: Full Google AdSense, DoubleClick DART, GDPR & CCPA disclosures.
- `/#disclaimer` -> `FinancialDisclaimerPage.tsx`: YMYL financial disclaimer, SEC/FINRA/FCA/SEBI notices, capital risk warnings.
- `/#terms` -> `TermsOfServicePage.tsx`: 150-word fair use quotation allowance, AI scraper prohibitions, arbitration rules.
- `/#editorial` -> `EditorialStandardsPage.tsx`: Commercial firewall, two-source corroboration, 72-hour trading moratorium.
- `/#cookies` -> `CookiePolicyPage.tsx`: Interactive client-side consent manager, cookie audit table.
- `/#corrections` -> `CorrectionsPage.tsx`: Errata protocol, recent corrections log, public review SLA.
- `/#legal` -> `LegalPage.tsx`: Master compliance hub and directory.

## 4. Newsroom Editorial Standards
- Articles must read like deeply researched human investigative journalism from Tier-1 bureaus (Marcus Vance, Siddharth Rao, Julian Thorne, Helena Brandt, etc.).
- Avoid automated or AI-sounding tropes. Include specific basis points, named institutions, physical locations, and primary filing sources.

## 5. Workspace Custom Skills
- `.agents/skills/financial-journalism/SKILL.md`: Narrative standards and investigative sourcing.
- `.agents/skills/adsense-compliance/SKILL.md`: Google AdSense rules and YMYL safeguards.
- `.agents/skills/core-web-vitals/SKILL.md`: Zero-CLS and performance optimization guidelines.
