---
name: core-web-vitals
description: Performance optimization, zero-CLS architecture, asynchronous asset loading, and accessibility AAA standards.
---

# BULLMONK Core Web Vitals & PageSpeed Skill

Rules and patterns to maintain 95+ PageSpeed scores on mobile and desktop devices.

## 1. Zero Cumulative Layout Shift (CLS)
- **Explicit Image Dimensions**: Every `<img>` tag MUST specify explicit `width` and `height` attributes (or CSS `aspect-ratio`).
- **Reserved Ad Containers**: Ad slots (`AdBanner`) must reserve minimal height (e.g. `minHeight: '100px'` or `'260px'`) before script hydration to prevent jumping content.

## 2. Largest Contentful Paint (LCP)
- **High-Priority Hero Media**: The primary above-the-fold hero image must include `fetchPriority="high"` and `decoding="async"`.
- **Preconnect Directives**: Preconnect to CDN and font origins in `index.html`:
  - `fonts.googleapis.com`
  - `fonts.gstatic.com`
  - `images.unsplash.com`

## 3. Zero Render-Blocking Resources
- **Asynchronous Font Loading**: Load Google Fonts using the preloaded print switch pattern:
  ```html
  <link rel="preload" as="style" href="..." />
  <link rel="stylesheet" href="..." media="print" onload="this.media='all'" />
  ```
- **Script Deferral**: Third-party scripts (`gtag.js`, AdSense) must load with `async` attributes.

## 4. Accessibility (Target: 100/100)
- **Semantic Headings**: Maintain strict `<h1>` through `<h3>` hierarchy.
- **Form Inputs**: Every input, search bar, and select must be paired with a `<label>` (using `.sr-only` if visually omitted).
- **Interactive Controls**: All icon-only buttons require descriptive `aria-label` or `title` attributes.
- **Contrast Ratios**: Body text and muted labels must exceed 4.5:1 (AAA ratio: `#475569` on `#FFFFFF` / `#F8F9FA`).
