# Directive: Phase 2 — Homepage Redesign (Master Design Direction & UX/UI Redesign Guide)

## Core Philosophy
Transform the AMEYA '26 homepage from a standard engineering portal into an immersive, living technical festival experience following the master design direction:
"SYSTEM FOR CLARITY. SURPRISE FOR MEMORY." (80% system, 20% surprise).
"DO NOT MAKE EVERY SECTION BEAUTIFUL. MAKE THE ENTIRE JOURNEY MEMORABLE."

## Scope & Constraints
- Focus strictly on Phase 2: Homepage (`src/app/page.tsx`, `page.module.css`, `src/components/index/*`, `Footer.tsx` on home view, and global tokens in `globals.css`).
- Do NOT modify `/events`, `/agenda`, `/venue`, `/team`, `/about`, or `/info`.
- Preserve all existing interactive functionality: SlideToRegister, RegistrationDialog, countdown timer, speaker modals, sponsor dialogs, and Danmaku comments.

## Key Directives & Architectural Pillars

### 1. Palette & Atmosphere (`globals.css`)
- Implement the 4-level dark depth background system:
  - Main background: `#050505`
  - Elevated section: `#0B0B0B`
  - Container / Card: `#101010`
  - Interactive surface: `#151515`
- Primary text: Warm off-white `#F2EDE8` (editorial, human feeling).
- Secondary text: Warm muted grey `#96908B`.
- Accent red: `#E51D25` (with `#ff3b3b` for focused interactions).
- Red usage budget: 70–80% neutral, 15–20% warm grey/muted, 5% bright red reserved strictly for primary CTAs and active states.
- Grid storytelling: Strong grid on Hero, very subtle or no grid on editorial sections, no grid in footer.

### 2. Homepage Hero (`Hero3DCanvas.tsx`, `page.tsx`, `page.module.css`)
- Planetary gear 3D kinematic assembly as the visual protagonist.
- Major Typographic Moment 1:
  "WHERE ENGINEERS DARE TO DREAM"
  Monumental display scale, extreme typographic contrast, editorial layout.
- Kicker: `AMEYA '26 // NATIONAL TECHNICAL CONCLAVE`.
- Clean, uncluttered metadata block anchored with T-MINUS countdown.

### 3. Editorial Festival Statement & Philosophy (`FestivalStory.tsx`)
- Major Typographic Moment 2:
  "AMEYA IS NOT JUST ANOTHER TECHNICAL FEST."
- Unboxed editorial story explaining the name *Ameya* ("immeasurable") and the spirit of mechanical engineering.
- Precision rotating mechanical gear / diagram SVG as a storytelling transition element.
- Treatment B — Raw Data: Landmark statistics (05+ Editions, 1,200+ Engineers, 12+ Arenas, ₹50K+ Prize Pool) breathing without card borders.

### 4. Events Hierarchy Preview (`EventsPreview.tsx`)
- Eliminates flat monotony by introducing true hierarchy:
  - Major Typographic Moment 3: "ARENAS & LINEUP".
  - Featured Hero Event 01: `01 // HACKSPRINT 24H: BUILD. BREAK. REBUILD.` (Dominant visual anchor with bright red CTA).
  - Supporting Grid (02 Robo Rumble, 03 CAD Clash, 04 Tech Manuscript, 05 Gear Hunt) with clear information hierarchy.
  - Clicking any event opens `RegistrationDialog`.

### 5. Final Brand Statement & Footer (`Footer.tsx`, `Footer.module.css`)
- Replaces generic copyright ending with the final emotional frame:
  "AMEYA '26 // WHERE ENGINEERS DARE TO DREAM."
- Elegant sitemap, social uplinks, and university credentials without background grid.
