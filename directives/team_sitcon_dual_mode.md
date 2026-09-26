# Directive: SITCON-Benchmarked Dual-Mode Team Architecture (List + Explore Universe + Member Info Drawer)

## Objectives
Implement the complete SITCON 2026 team architectural paradigm for AMEYA '26 under the "Machined Crimson, Carbon & Cold Steel" aesthetic:

1. **Rich Team Data Schema (`src/data/team.ts`):**
   - Expand `TeamMember` interface to support:
     - `division`: "Executive Directorate", "Technical Operations", "Design & Media", "Logistics & Arenas", "Publicity & Outreach", "Finance & Sponsorship".
     - `divisionIndex`: 0 to 5 (mapped to cluster navigation).
     - `callsign`: e.g. "AEGIS-01", "CYBER-02", "CAD-03", etc.
     - `clearance`: e.g. "LEVEL-4", "LEVEL-3".
     - `specialization`: technical focus domain.
     - `bio`: engineer statement / quote (as seen on SITCON member cards).
     - `exploreCoords`: `{ x: number, y: number }` coordinates within the Explore universe canvas.
     - `socials`: links for LinkedIn, GitHub, Email, Portfolio.

2. **Member Info Slide-out Drawer Component (`src/components/team/MemberInfoDrawer.tsx` & `.module.css`):**
   - Machined slide-out sidebar from the right viewport edge.
   - Frosted graphite backdrop overlay with smooth blur.
   - Header with Division classification, clearance badge, and rotating close button.
   - Avatar / CAD blueprint showcase with reticle ring and crosshairs.
   - Call sign, role, department, academic year.
   - Bio / mission quote in technical typography.
   - Telemetry grid (Chassis index, Clearance level, Comm channel, Status).
   - Machined action link buttons (LinkedIn, GitHub, Portfolio).
   - Full keyboard accessibility (ESC to close, outside click dismissal).

3. **Interactive Explore Universe Component (`src/components/team/ExploreUniverse.tsx` & `.module.css`):**
   - Full-bleed pannable 2D universe with smooth drag physics (mouse & touch drag).
   - Top and bottom gradient fade masks (`.navMaskTop`, `.navMaskBottom`) for atmospheric depth.
   - Subtle tactical grid and radar crosshairs in the universe background.
   - Member Tokens with 2.5D multi-layer parallax hover effect:
     - When hovering/moving mouse over a token, inner layers calculate offset from center and translate in real-time.
     - Hover badge with member name and role.
     - Clicking any token opens the `MemberInfoDrawer`.
   - Floating HUD Anchor Dock:
     - Fixed dock with mode switch button `[ ☷ List Mode ]` and division cluster buttons.
     - Clicking a division cluster smoothly pans the universe to center directly on that team cluster!
     - Glowing red indicator dot for active cluster proximity.

4. **List Mode & Mode Switcher (`src/app/team/page.tsx` & `.module.css`):**
   - Toggle buttons in header: `[ ☷ List Mode ]` and `[ ✦ Explore Universe ]`.
   - In List Mode:
     - Clean categorized grid grouped by division.
     - Each card is interactive (`role="button"`), click triggers `MemberInfoDrawer`.
     - Card hover elevates with crimson outline and reveals spec sheet trigger.
   - In Explore Mode:
     - Embeds `ExploreUniverse` component with full panning universe.

5. **Dedicated Route (`src/app/team/explore/page.tsx`):**
   - Direct standalone route matching SITCON's `/team/explore/` URL.
   - Mounts `ExploreUniverse` in full-screen immersion.
