# Directive: Elevate Hero to SITCON Benchmark

## Objective
Refactor the hero landing (`src/components/index/Hero3DCanvas.tsx`, `src/app/page.tsx`, and `src/app/page.module.css`) to eliminate spline collision, replace flat WebGL lighting with studio HDR & rim lighting, apply isometric camera perspective, scale the gear train, replace the solid center disk with a hollow bearing race, and refine hero typography to SITCON standards.

## Principles Followed
- `frontend-design`: Anti-template discipline, spacious asymmetric editorial hierarchy, crisp monospace HUD pill for [ • ENGINEERS • ], no watermark contrast noise behind headline.
- `canvas-design`: Dramatic isometric depth perspective (`rotation.set(0.18, -0.32, 0.08)`), sharp tooth chamfers, and smooth scroll camera dolly ($Z=28 	o 22$).
- `algorithmic-art`: Constrain Catmull-Rom splines strictly to center-right hemisphere ($X > 6$, $X < 32$), with ethereal laser hairline geometry and additive blending.
- `theme-factory`: Machined Crimson (`#cc1111`), Billet Carbon Steel (`#222222`), Cold Steel (`#d8d8d8`), and Surgical Red rim lighting (`#ff2222`).

## Execution
Run `execution/update_hero_sitcon.py`
