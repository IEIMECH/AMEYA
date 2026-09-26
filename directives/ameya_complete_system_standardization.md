# Directive: AMEYA '26 Complete Design System Standardization & Production Hardening

## Vision & Brand Governance
Preserve and formalize the established AMEYA '26 visual identity:
- Near-black `#050505`–`#101010` 4-tier dark depth backgrounds.
- Subtle technical CAD grid overlays.
- Deep burgundy/red atmospheric warmth.
- Signal red `#E51D25` accents reserved for critical CTAs and active states.
- Warm off-white `#F2EDE8` editorial headings and muted grey `#96908B` body copy.
- Compact uppercase technical notation (`//`, `SEC:`, `SYS:`, `PROTOCOL:`, `STATUS:`).
- Thin 1px borders, dark translucent/charcoal cards, small red status indicators.
- Existing AMEYA '26 navigation and footer.
- Absolute rejection of generic SaaS cards, neon purple/blue AI graphics, or startup templates.

## Objectives
1. **AMEYA // SYSTEM Design Tokens:** Formalize shared tokens and reusable components.
2. **Custom 404 (`src/app/not-found.tsx`):** `ERROR // SIGNAL LOST` missing coordinate failure.
3. **SEO Page Titles & Meta Descriptions:** Contextual, technical, non-spammy metadata across all pages.
4. **Above-the-fold Hero Conversion:** Dominant `WHERE ENGINEERS DARE TO DREAM`, primary `EXPLORE EVENTS →`, secondary `VIEW AGENDA`.
5. **Favicon System:** Multi-resolution SVG/PNG icons based on the red technical mark.
6. **Robots.txt (`src/app/robots.ts`):** Production search engine crawling controls.
7. **Dynamic Sitemap (`src/app/sitemap.ts`):** Canonical indexing of all valid public pages.
8. **Open Graph Image (`src/app/opengraph-image.tsx` & `/og.png`):** 1200x630 technical poster layout.
9. **Accessibility Alt-Text Audit:** Accurate, contextual descriptions and aria-hidden on decorative elements.
10. **Responsive Breakpoints & Layouts:** Desktop, tablet, and mobile density preservation.
11. **Mobile-Only Sticky CTA:** Context-aware 56-64px compact operational control panel.
12. **Loading States (`src/app/loading.tsx`):** Engineering system initialization animations.
13. **Form Error States:** High-precision input errors in `RegistrationDialog`.
14. **Registration Success Page (`/registration/success`):** `REGISTRATION // CONFIRMED` system handshake.
15. **Privacy Policy (`/privacy`):** `PROTOCOL // PRIVACY` editorial legal document.
16. **Terms & Conditions (`/terms`):** `PROTOCOL // TERMS` competition rulebook & indemnification.
17. **Cookie & Privacy Consent (`CookieConsent.tsx`):** `PRIVACY PROTOCOL // COOKIES` non-manipulative consent panel.
18. **Analytics Architecture (`src/lib/analytics.ts`):** Structured event taxonomy.
19. **Contact Desk (`/contact`):** `COMMS // CONTACT` official operations center.
20. **Image Optimization Audit:** WebP delivery, explicit dimensions, and zero layout shift.
