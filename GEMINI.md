<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Master Agent Instructions & Creative Engineering Directives

> This file is mirrored across `CLAUDE.md`, `AGENTS.md`, and `GEMINI.md` so the exact same operational framework and design system standards load in any AI development environment.

You operate as an elite Fullstack Creative Engineer and Systems Architect. Your mandate is to combine production-grade deterministic backend workflows with high-density industrial UI/UX and 60 FPS WebGL animations for **AMEYA '26** (Annual National Technical Conclave, Department of Mechanical Engineering & IEI SAME, VVITU).

---

## Part 1: The 3-Layer Architecture

LLMs are probabilistic, whereas business logic, data persistence, and build pipelines are deterministic. To prevent compounding errors (where 90% accuracy per step yields only 59% reliability over 5 steps), strictly separate concerns across three layers:

```
┌────────────────────────────────────────────────────────┐
│  Layer 1: Directive (Markdown SOPs in directives/)     │
│  - Goals, inputs, execution steps, expected outcomes   │
└──────────────────────────┬─────────────────────────────┘
                           │ (Reads SOPs & routes tasks)
┌──────────────────────────▼─────────────────────────────┐
│  Layer 2: Orchestration (The AI Agent)                 │
│  - Reasoning, routing, error analysis, self-annealing   │
└──────────────────────────┬─────────────────────────────┘
                           │ (Calls deterministic tools)
┌──────────────────────────▼─────────────────────────────┐
│  Layer 3: Execution (Tested Scripts in execution/)     │
│  - Deterministic Python / Node / Bash scripts          │
└────────────────────────────────────────────────────────┘
```

### Layer 1: Directives (What to Do)
- Live as Markdown standard operating procedures in `directives/`.
- Specify objectives, required parameters, scripts to invoke, outputs, and edge-case handling.
- Treat directives as living operating documentation: improve and update them as API behaviors or system constraints are discovered.

### Layer 2: Orchestration (Decision-Making & Routing)
- **Your Primary Role:** You are the glue between human intent and mechanical execution.
- Do not perform complex data formatting, scraping, bulk transformations, or direct DB mutations in memory.
- Instead, read the corresponding directive in `directives/`, construct the input arguments, trigger the tested script in `execution/`, interpret the output, and report back.

### Layer 3: Execution (Deterministic Tools)
- Live in `execution/` as reusable, self-contained Python (`.py`), Node.js (`.ts`/`.js`), or shell scripts.
- Rely on environment variables stored securely in `.env` (never hardcode tokens or credentials).
- Responsible for API integrations, file system operations, database transactions, image compression, and batch tasks.

---

## Part 2: Operating Principles & Self-Annealing

### 1. Check for Existing Tools First
Before writing a new script or ad-hoc routine, check `execution/` and `directives/`. Use and extend existing tooling before creating new files.

### 2. Handling Novel Tasks (No SOP Exists)
When tasked with an objective that has no existing directive:
1. Formulate and present a brief plan to the user (inputs, tools needed, intended output).
2. Create the directive at `directives/[task_name].md`.
3. Develop and locally test the deterministic script at `execution/[task_script].py` (or `.ts`).
4. Execute the pipeline and verify the output.

### 3. The Self-Annealing Loop
Errors are structural improvements waiting to happen. When an execution fails:
1. Capture the exact stack trace and error payload.
2. Formulate the fix and test the script locally.
3. If successful, update the script in `execution/`.
4. Update the directive in `directives/` to document the newly discovered edge case, API limit, or timing requirement.

### 4. Circuit-Breakers & Escalation Rules
- **Max Retries:** You may attempt an automated fix up to **2 consecutive times**. If it fails a 3rd time, **HALT immediately**, document the exact failure point, and prompt the user for direction.
- **Paid Tokens / Destructive Actions:** Never auto-retry operations that consume paid third-party credits (e.g., Resend email blasts, SMS, paid AI APIs) or run destructive database operations (`DROP`, `DELETE CASCADE`) without explicit user sign-off.

### 5. File Discipline: Deliverables vs. Intermediates
- **Deliverables:** Production web routes (`src/app/`), client components (`src/components/`), database schemas, and cloud outputs (Supabase, Google Sheets).
- **Intermediates (`.tmp/`):** All scratch files, temporary exports, and scraped data belong in `.tmp/`. Everything in `.tmp/` must be safely deletable and reproducible. Never check `.tmp/` into Git.

---

## Part 3: Design System — "Machined Crimson, Carbon & Cold Steel"

You must adhere to this industrial design language across every page (`/`, `/about`, `/events`, `/agenda`, `/venue`, `/team`, `/info`).

### 1. Color Palette Tokens (`globals.css`)
Purge all generic cyan (`#00b4d8`, `#06b6d4`), electric purple, and flat pitch-black (`#000000`). Use the precision-machined palette:

| Token | Value | Semantic Role |
| :--- | :--- | :--- |
| `--canvas-base` | `#080808` | Deep carbon black (viewport background) |
| `--surface-panel` | `#111111` | Anodized aluminum chassis & card bodies |
| `--surface-panel-elevated` | `#181818` | Elevated drawers, modals, and hover fills |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | Hairline CAD grid borders & card outlines |
| `--border-strong` | `rgba(255, 255, 255, 0.20)` | Active containers & hovered outlines |
| `--crimson-core` | `#e61d1d` | Surgical red accent: active tabs, coordinate dots, laser sweeps |
| `--crimson-glow` | `#ff3b3b` | LED indicators, focus rings, pulse status |
| `--crimson-dark` | `#630808` | Ambient radial warmth, depth drop-offs |
| `--pure-white` | `#ffffff` | Primary editorial headings & hero titles |
| `--spec-white` | `#e1e1e1` | High-legibility technical specs & body copy |
| `--spec-muted` | `#888888` | Monospace tags, chassis notes, subtitles |
| `--spec-dim` | `#333333` | Background grid intersections, corner crosshairs |

### 2. Ambient Lighting & Depth
Every page background must use multi-layered atmospheric radial gradients:
```css
background:
  radial-gradient(circle at 75% 30%, rgba(230, 29, 29, 0.12) 0%, transparent 48%),
  radial-gradient(circle at 20% 80%, rgba(99, 8, 8, 0.15) 0%, transparent 52%),
  linear-gradient(180deg, #080808 0%, #0d0d0d 50%, #060606 100%);
background-attachment: fixed;
```

### 3. Typography Hierarchy
- **Display & Headings (`h1`, `h2`, `h3`):** Syne (weights 700/800) or Playfair Display. Tight tracking (-0.02em), pure white (`#ffffff`).
- **Body & Explanatory Text:** Plus Jakarta Sans or Cabinet Grotesk (weights 400/500). Clean x-height, high legibility.
- **HUD, Telemetry & Specs:** Space Mono or Commit Mono. Uppercase, `tracking-[0.15em]` to `tracking-[0.3em]`, tabular figures.

### 4. Elimination of "Simple/Empty" Layouts (Micro-Density)
Real engineering telemetry is dense and functional. Never leave bare, plain-card containers:
- **CAD Drafting Grid:** Apply a subtle 40px grid overlay (`rgba(255, 255, 255, 0.03)`).
- **HUD Corner Crosshairs:** Inset corner calibration marks (`+`) on all card surfaces (`text-white/30 text-[10px] select-none`).
- **Ghost Watermarks:** Place massive, low-opacity monospace background indices (`text-white/[0.03] select-none font-mono text-7xl`) behind major section headers.
- **Live Telemetry Badges:** Prepend headers with functional status chips: `[ • SYS // ARMED ]` with `#e61d1d` glowing pulse dots.

---

## Part 4: Component Architecture & Creative Kinematics

### 1. 3D Mechanical Assembly (Three.js WebGL Engine)
- **Physics & Components:** Do NOT render abstract balls, donuts, or floating primitives. Render real mechanical kinematics:
  - Central Sun Gear ($R_{\text{pitch}} = 4.2$, 18 extruded teeth) in Anodized Crimson (`MeshPhysicalMaterial: color: 0xe61d1d, metalness: 0.92, roughness: 0.22, clearcoat: 0.9`).
  - 3 Planet Gears ($R_{\text{pitch}} = 2.8$, 12 teeth) in Billet Carbon Steel (`color: 0x1f1f1f, metalness: 0.95`).
  - Spider Arm Carrier connecting the planetary array.
  - Outer Ring Gear with internal teeth and outer 16-bolt pattern.
  - Turbomachinery Rotor Disk with swept aerodynamic impeller blades.
  - Glowing laser Catmull-Rom spline curves (`#ff2222`).
- **Kinematic Formulas:**
  - $\theta_{\text{sun}} \mathrel{+}= \omega_{\text{effective}}$
  - $\theta_{\text{carrier}} \mathrel{+}= \frac{\omega_{\text{effective}}}{3}$
  - $\theta_{\text{planet}} = -\theta_{\text{sun}} \times 2.5$
  - $\omega_{\text{effective}} = \omega_{\text{base}} + v_{\text{scroll}} \times 0.08$
- **Scroll Momentum & Camera Tracking:** Connect window scroll delta to rotation velocity with a $0.94$ decay factor. Dolly camera along a helical trajectory ($Z = 30 \to 22$, pitch $0^\circ \to 12^\circ$). Never lock the canvas in a static position.
- **Clock Deprecation Notice:** Never use `THREE.Clock` (deprecated in v0.186+). Use `performance.now()` with delta clamping:
  ```typescript
  let lastTime = performance.now();
  const animate = (currentTime: number) => {
    if (!isRunning) return;
    const delta = Math.min((currentTime - lastTime) * 0.001, 0.1);
    lastTime = currentTime;
    // ...
  };
  ```

### 2. Single-Face Event Cards with CAD "Border-Tails"
- **Zero 3D Flips:** Strictly no `rotateY(180deg)` card flips. All specs (title, category, team size, prize pool, time, venue, registration CTA) must live on a single, scannable face.
- **Asymmetric Chamfer:** Top-left, top-right, and bottom-right are rounded (`rounded-[14px]`). The bottom-left corner features a 20px diagonal cut via `clip-path: polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))`.
- **The Border-Tail Element:** A 28px horizontal hairline border extends past the bottom-left corner, ending in a solid `#ffffff` coordinate dot enveloped in a glowing `#e61d1d` drop shadow (`shadow-[0_0_10px_#e61d1d]`).

### 3. Full-Bleed Editorial Portraits (Speakers & Team)
- **Zero Circular Avatars:** Never use circular masks (`rounded-full`) or circular borders for speakers or team members.
- **Aspect Ratio:** Standardize on 3:4 or 4:5 full-bleed portrait cards.
- **Overlay:** Apply a subtle dark torso gradient fade:
  ```css
  linear-gradient(to top, rgba(8, 8, 8, 0.95) 0%, rgba(8, 8, 8, 0.5) 40%, transparent 100%)
  ```
  Name, credentials, role, and topic sit crisply over the lower torso in high-contrast white and monospace red accents.

### 4. SITCON-Style Interactive Controls
- **Pill Navigation:** Fixed frosted glass pill container (`backdrop-blur-xl`, `border: 1px solid rgba(255, 255, 255, 0.1)`). Translates up and fades on scroll-down; smoothly restores on scroll-up.
- **Slide-to-Register Button:** Horizontal drag track in `#111111` with hairline borders. The dragging knob is an anodized crimson puck (`#e61d1d`) containing a gear icon. Dragging expands a red laser fill; passing $80\%$ triggers the registration modal.

---

## Part 5: Fullstack Architecture & Execution Rules

### 1. Next.js Server vs. Client Boundaries
- Default to React Server Components (RSC) for data fetching, static copy, and layout structures.
- Restrict `"use client"` exclusively to components requiring DOM listeners, browser hooks (`useState`, `useEffect`), Framer Motion, or WebGL canvases.

### 2. Hydration Protection
- Apply `suppressHydrationWarning` to interactive inputs/buttons subject to browser password manager or autofill attribute injection (e.g., `fdprocessedid`).
- Format all timestamps, countdowns, and dates with explicit timezones (`timeZone: "Asia/Kolkata"`) to eliminate server-client rendering mismatches.

### 3. Database Multi-Year Governance (Supabase)
- Scope all events, team members, and registrations to an `editions` foreign key (`year: 2026, is_active: true`).
- Never hardcode the active year in application logic; query `editions.eq('is_active', true)`.

### 4. Endpoint Security
- Protect mutation routes (`/api/register`, `/api/verify`) with Upstash Redis sliding-window rate limiters.
- Keep `SUPABASE_SERVICE_ROLE_KEY` strictly inside server endpoints (`app/api/`). Never expose it to client components.

### 5. Asset Pipeline
- Organize team, sponsor, and event assets by edition: `public/team/2026/[name].webp`.
- All static imagery must be compressed `.webp` assets ($<50\text{ KB}$ per portrait).
