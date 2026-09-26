# Directive: Final Mechanical Polish & Interaction Hardening

## Objectives
1. **Hero 3D Spatial Padding & Clamping (`Hero3DCanvas.tsx`):**
   - Scale outer ring gear radius from 9.5 down to 8.8 (ensuring >=48px clearance from metadata block).
   - Dynamic resize clamping: calculate `camera.position.z = aspect < 1.4 ? 32 : 28`.
2. **Event Cards Full-Surface Clickability & Hover Elevation (`EventCard.tsx`):**
   - Make whole card container an accessible trigger for the registration/details dialog.
   - On hover, shift terminal border-tail coordinate dot outward by 4px with expanded glow (`box-shadow: 0 0 14px #e61d1d`), and apply subtle Y-elevation `translateY(-3px)`.
3. **Team Roster Image Fallback Architecture (`src/app/team/page.tsx`):**
   - Full-bleed 3:4 portrait with dark torso gradient overlay if image exists (`/team/2026/[slug].webp` or `m.image`).
   - Engraved technical CAD wireframe placeholder with carbon mesh, industrial watermark, and credentials if no image exists.
4. **3D Venue Palette Harmonization (`Venue3DViewer.tsx`):**
   - Ground plane color changed from green/blue turf to dark matte graphite (`0x121212`) with subtle red boundary gridlines (`0xe61d1d` / `0x331010`).
   - WebGL clear color set to `0x080808`.
