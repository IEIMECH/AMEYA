# AMEYA // SYSTEM
## Unified Engineering Design System Specification for AMEYA '26
*Department of Mechanical Engineering & The Institution of Engineers (India) Students' Chapter (IEI SAME), VVIT Nambur*

---

### 1. Architectural Philosophy
AMEYA // SYSTEM is an editorial engineering visual language crafted specifically for a premier national mechanical engineering conclave. It rejects generic SaaS aesthetics, neon cyberpunk clichés, rounded card templates, and purple/blue AI gradients. 

Instead, it embodies **Machined Crimson, Carbon & Cold Steel**:
- **Ground Truth**: Absolute matte depth (`#050505` to `#101010`)
- **Structure**: 1px subtle technical hairline borders (`rgba(255, 255, 255, 0.08)`) and 40px CAD coordinate grids
- **Core Signal**: Signal Crimson (`#E51D25`) reserved strictly for active operations, primary actions, and coordinate telemetry
- **Editorial Contrast**: Serif display headlines paired with disciplined monospace technical notation

---

### 2. Color Tokens

| Token | Hex / Value | Semantic Role |
| :--- | :--- | :--- |
| `--machined-dark` | `#050505` | Level 1: Primary viewport background |
| `--machined-elevated` | `#0B0B0B` | Level 2: Alternating sections and dialog backdrops |
| `--machined-surface` | `#101010` | Level 3: Cards, dockets, panels, and form fields |
| `--machined-interactive`| `#151515` | Level 4: Hover states and interactive input surfaces |
| `--crimson-core` | `#E51D25` | Signal accent: Primary CTAs, active telemetry indicators |
| `--crimson-glow` | `#FF3B3B` | High-priority focus ring and live status dot bloom |
| `--crimson-faint` | `rgba(229, 29, 37, 0.08)` | Background tint for active tabs, badges, error alerts |
| `--steel-bright` | `#F2EDE8` | Warm editorial off-white text (primary titles & body) |
| `--steel-muted` | `#96908B` | Secondary technical metadata and supporting copy |
| `--steel-dark` | `#605B56` | Tertiary quiet telemetry labels and timestamps |
| `--machined-border` | `rgba(255, 255, 255, 0.08)`| 1px hairline card borders and structural dividers |
| `--machined-border-hover` | `rgba(229, 29, 37, 0.40)` | Interactive focus/hover border state |

---

### 3. Typography Hierarchy

| Role | Font Family | Size (Desktop) | Weight | Letter-spacing | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Monumental Editorial** | `--font-serif` (Playfair) | `clamp(2.8rem, 6.5vw, 5.5rem)` | 700 / 800 | `-0.02em` | Uppercase or Title Case; Hero Statement |
| **Section Heading** | `--font-display` (Syne) | `clamp(2.0rem, 4vw, 3.2rem)` | 700 | `-0.01em` | Primary section headers |
| **Card / Subhead** | `--font-display` (Syne) | `1.15rem – 1.4rem` | 700 | `normal` | Event card and dossier headers |
| **Technical Label / Kicker** | `--font-mono` (Space Mono) | `0.65rem – 0.75rem` | 700 | `0.14em` | All-caps with `//` notation |
| **Editorial Body** | `--font-sans` (Plus Jakarta) | `0.92rem – 1.05rem` | 400 / 500 | `normal` | Line height 1.6 – 1.7; 65–75 char max width |
| **Telemetry & Coordinates** | `--font-mono` (Space Mono) | `0.70rem – 0.80rem` | 400 / 700 | `0.08em` | Dates, venues, registration IDs |

---

### 4. Technical Notation & Labels
All sections and diagnostic items employ industrial engineering notation:
- `//` Sector delimiter (e.g. `ERROR // SIGNAL LOST`, `COMMS // CONTACT`)
- `SYS:` System operational state (e.g. `SYS: REGISTRATION // PROTOCOL`)
- `SEC:` Section identifier (e.g. `SEC: 01 // OVERVIEW`)
- `STATUS: OFFLINE` / `STATUS: ACTIVE`
- `NODE: UNKNOWN_RELAY` / `COORDINATES: 16.3475° N, 80.5255° E`

---

### 5. Standard Component Patterns

#### A. Primary Action Button (`.primaryHeroCta` / `.ameya-btn-primary`)
- **Background**: `var(--crimson-core, #E51D25)`
- **Color**: `#FFFFFF`
- **Border**: `1px solid var(--crimson-core)`
- **Font**: Monospace, 700 weight, all-caps, `0.12em` letter spacing
- **Radius**: `2px – 3px` (strictly non-pill, no rounded SaaS corners)
- **Shadow**: `0 4px 18px rgba(229, 29, 37, 0.28)`
- **Hover**: Background `#C9141B`, slight elevation `-2px`, shadow `0 6px 24px rgba(229, 29, 37, 0.45)`

#### B. Secondary Action Button (`.secondaryHeroCta` / `.ameya-btn-secondary`)
- **Background**: `rgba(255, 255, 255, 0.03)`
- **Color**: `var(--text-primary, #F2EDE8)`
- **Border**: `1px solid rgba(255, 255, 255, 0.14)`
- **Font**: Monospace, 700 weight, all-caps, `0.12em` letter spacing
- **Radius**: `2px – 3px`
- **Hover**: Background `rgba(255, 255, 255, 0.07)`, border `rgba(255, 255, 255, 0.32)`, color `#FFFFFF`

#### C. Content Docket / Technical Card (`.ameya-card`)
- **Background**: `var(--machined-surface, #101010)`
- **Border**: `1px solid var(--machined-border, rgba(255, 255, 255, 0.08))`
- **Padding**: `1.5rem – 2.0rem`
- **Radius**: `2px – 4px`
- **Hover**: Border transition to `rgba(229, 29, 37, 0.40)`

#### D. Status Indicator Dot (`.statusDot` / `.ameya-status-dot`)
- **Size**: `6px – 7px` circular indicator
- **Fill**: `#E51D25`
- **Glow**: `box-shadow: 0 0 8px #FF3B3B`
- **Animation**: Optional 2s subtle breathing glow

#### E. Form Error Validation Treatment
- **Border**: `1px solid #E51D25 !important` with subtle glow `0 0 10px rgba(229, 29, 37, 0.2)`
- **Label**: Monospace, uppercase, `INPUT ERROR // [ERROR_TYPE]` in `#FF4D4D`
- **Explanation**: Accessible, human-readable explanatory text below input
- **Preservation**: All user-entered input is strictly retained across validation cycles

#### F. Mobile Sticky Operation Bar (`MobileStickyCTA`)
- **Placement**: Fixed to bottom viewport on screens `< 868px`
- **Height**: `56px – 64px` with iOS/Android `safe-area-inset-bottom` support
- **Surface**: `#0C0C0C` with 1px top border `rgba(229, 29, 37, 0.5)`
- **Context-Aware Trigger**:
  - `/events` -> `EXPLORE EVENTS →`
  - `/agenda` -> `VIEW AGENDA →`
  - `/venue` -> `NAVIGATE VENUE 3D →`
  - Default -> `REGISTER FOR AMEYA '26 →`

---

### 6. Responsive Breakpoint Standards

| Breakpoint | Target Devices | Visual Adjustments |
| :--- | :--- | :--- |
| **Desktop (`>= 1024px`)** | Ultrawide, Desktop, Laptops | Full 3-column event grids, expansive section padding, hero 3D kinematic gear assembly |
| **Tablet (`768px – 1023px`)** | iPad, Surface, Tablets | 2-column event grid, stacked hero metadata, compact section headers |
| **Mobile (`< 768px`)** | Smartphones (iOS / Android) | Single-column linear layout, full-width cards, 48px touch targets, sticky mobile control bar, scaled editorial typography |

---

### 7. Core Route Inventory

| Route | Canonical Path | Primary Role |
| :--- | :--- | :--- |
| Home | `/` | Editorial hero, kinematics, countdown, event previews, partner wall |
| Events | `/events` | Technical arena catalog, filter matrix, registration trigger |
| Agenda | `/agenda` | Chronological festival timetable and venue locations |
| Venue | `/venue` | Interactive 3D campus quadrangle, coordinates, transit |
| Team | `/team` | Student convenors, faculty leads, organizing council |
| Cadre Universe | `/team/explore` | 2.5D draggable coordinate universe |
| About | `/about` | IEI SAME history, institutional legacy, engineering charter |
| Information | `/info` | Delegate code of conduct, travel, accommodation |
| Contact | `/contact` | 5-sector operations desk, direct communication links |
| Privacy Policy | `/privacy` | Delegate data governance and security protocol |
| Terms & Conditions | `/terms` | Competition rules, eligibility, intellectual property |
| Registration Success | `/registration/success` | Confirmed system dossier, calendar export, credential review |
| Custom 404 | `/not-found` | `ERROR // SIGNAL LOST` diagnostic coordinate failure screen |

---
