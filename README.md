# AMEYA '26 — Official Digital Portal
### National Level Mechanical Engineering Technical Conclave
**Department of Mechanical Engineering & The Institution of Engineers (India) Students' Chapter (IEI SAME)**  
**Vasireddy Venkatadri Institute of Technology (VVIT), Nambur, Guntur, AP, India**  
*Dates: October 08–09, 2026*

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-orange?logo=three.js)](https://threejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-emerald?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)

---

## 🚀 Overview

**AMEYA '26** is the official web application and event orchestration system for the premier biennial national mechanical engineering symposium hosted by the Department of Mechanical Engineering and the chartered IEI SAME Student Chapter at VVIT Nambur.

The platform provides a modern, cyberpunk-industrial web experience combining real-time event registration, interactive 3D campus navigation, cryptographic gate ticketing, and an operations console for event coordinators.

---

## ✨ Key Capabilities

1. **Centerpiece 3D Campus Explorer (`/venue`)**
   - Interactive Three.js WebGL 3D model of the VVIT Central Campus complex (`vvit-campus.glb`).
   - Smooth camera raycasting with clickable and hover-responsive building telemetry (Central Block, Loyalty 1–4, H-Block, and OAT).
   - Preset camera perspectives (`Isometric 45°`, `Top View`, `Front View`) and 360° automatic orbital rotation.
   - Embedded official **VVIT College Bus Routes & Schedule PDF** viewer with inline controls, fullscreen toggle, and instant download.

2. **Precision Event Registration (`/events`)**
   - Multi-category technical and non-technical competition registration (AutoCAD, Assemble & Disassemble, RC Car Challenge, Engineering Drawing, Picto, Identify Tools, Treasure Hunt, Nuts & Bolts Speed Race).
   - Automated duplicate registration protection tracking both delegate email and college roll number.
   - Supabase Storage image upload pipeline for student College ID card verification.
   - Zero-collision unique ticket generation (`AMEYA-2026-[EVENT]-[RANDOM]`).

3. **Automated Ticket Delivery & Notifications**
   - Real-time automated confirmation emails dispatched via Google Workspace SMTP (with Resend API fallback).
   - Professional HTML ticket format including event day, reporting instructions, student POC contacts, and official sign-off from **Team - IEI SAME**.
   - Online responsive digital gate pass (`/ticket/[id]`) with live gate verification stamping.

4. **5-Tier Executive Operations Console (`/admin`)**
   - Protected by Next.js Edge Middleware route guards.
   - 5 executive leadership accounts backed by environment variables (zero passwords or credentials committed to Git):
     1. **President**: Full festival executive control, event management, and system oversight.
     2. **Vice President**: Executive operations, cross-domain coordination, and attendee auditing.
     3. **Secretary**: Secretariat records, communication inquiries, and attendee approvals.
     4. **Events Head**: Championship arena management, live scoring, and event attendance tracking.
     5. **Technicals**: Technical infrastructure oversight, gate scanning, and database audit logs.
   - Cryptographically signed HMAC-SHA256 session tokens stored in secure, `httpOnly` cookies.
   - In-memory brute-force rate limiting (max 5 attempts, 15-minute lockouts).
   - Real-time attendee dashboard with live search, event filtering, attendance toggles, and CSV exports.

5. **2.5D Draggable Universe Team Explorer (`/team/explore`)**
   - Spatial infinite canvas showcasing student convenors, department executives, and domain heads with responsive drag physics and high-definition photography.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & Animation**: [React 19](https://react.dev/), Vanilla CSS Modules, CSS Variables, Glassmorphism Design System
- **3D Graphics**: [Three.js](https://threejs.org/), GLTFLoader, OrbitControls
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL 15, Row Level Security, Object Storage)
- **Email Delivery**: [Nodemailer](https://nodemailer.com/) (Google SMTP) & [Resend](https://resend.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📁 Repository Structure

```
ameya-fest/
├── public/
│   ├── models/
│   │   └── vvit-campus.glb        # Optimized 3D Campus Binary Model
│   ├── img/
│   │   ├── Hero/                  # Event photowall assets
│   │   ├── members2026/           # IEI SAME Committee portraits
│   │   └── sponsors/              # Official sponsor branding
│   ├── VVIT_Bus_Routes.pdf        # Official college bus routes document
│   └── site.webmanifest           # Progressive Web App manifest
├── src/
│   ├── app/                       # Next.js App Router routes
│   │   ├── page.tsx               # Homepage with hero, photowall & countdown
│   │   ├── about/                 # Department & IEI SAME heritage
│   │   ├── events/                # Championship listings & modal registration
│   │   ├── venue/                 # 3D Campus explorer & bus PDF viewer
│   │   ├── agenda/                # Day 1 & Day 2 festival schedules
│   │   ├── contact/               # Inquiries & student POC coordinates
│   │   ├── team/                  # Executive council directory
│   │   │   └── explore/           # 2.5D draggable spatial universe
│   │   ├── ticket/[id]/           # Cryptographic digital ticket pass
│   │   ├── admin/                 # Coordinator operations console
│   │   │   └── login/             # Administrator terminal login
│   │   └── api/                   # Production serverless endpoints
│   │       ├── register/          # Registration & ticket generation
│   │       ├── ticket/[id]/       # Ticket verification & gate check-in
│   │       ├── contact/           # General communication inquiries
│   │       └── admin/             # Admin auth & live attendee management
│   ├── components/                # Modular reusable UI components
│   ├── data/                      # Static event definitions & transportation configs
│   ├── lib/                       # Supabase client, email gateway & admin auth
│   └── middleware.ts              # Edge security route guard for admin terminal
├── supabase/
│   └── schema.sql                 # Complete database schema & tables definition
├── .env.example                   # Environment configuration template
└── README.md
```

---

## ⚙️ Environment Variables Configuration

Copy `.env.example` to `.env.local` for local execution:

```bash
cp .env.example .env.local
```

Populate the required keys in `.env.local` (or configure them in your **Vercel Project Dashboard**):

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_BASE_URL` | Canonical application URL (e.g., `https://ameyafest.in`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public client anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase elevated service role key (Server-only) |
| `ADMIN_SESSION_SECRET` | 64-character random secret for signing session tokens |
| `ADMIN_USER_1` / `ADMIN_PASS_1` | Account 1: President |
| `ADMIN_USER_2` / `ADMIN_PASS_2` | Account 2: Vice President |
| `ADMIN_USER_3` / `ADMIN_PASS_3` | Account 3: Secretary |
| `ADMIN_USER_4` / `ADMIN_PASS_4` | Account 4: Events Head |
| `ADMIN_USER_5` / `ADMIN_PASS_5` | Account 5: Technicals Lead |
| `SMTP_HOST` / `SMTP_PORT` | Primary SMTP host (`smtp.gmail.com` / `465`) |
| `SMTP_USER` / `SMTP_PASS` | Primary SMTP authenticated account & App Password |
| `SMTP_FROM` | Sender display name & address |
| `RESEND_API_KEY` | Secondary fallback email API key |

> **Security Note**: Never commit `.env.local` or raw credentials to version control. Production passwords and secrets must only be entered into the hosting provider's secure secret manager.

---

## 🏃 Local Development

### Prerequisites
- **Node.js**: v18.18+ or v20+
- **npm**: v9+

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start local development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Verification

```bash
# Build the optimized production bundle and check TypeScript types
npm run build

# Start production server locally
npm run start
```

---

## 🛡️ Database & Security Architecture

1. **Supabase PostgreSQL Schema**:
   - `registrations`: Unified participant registrations, college ID paths, attendance timestamps, and verification audit trail.
   - Dedicated event tables (`reg_autocad`, `reg_assemble_disassemble`, etc.) for real-time segmented tallying.
   - `inquiries`: Direct contact inquiries sent via the `/contact` portal.
   - `college_ids` Storage Bucket: Public-read bucket for student identification cards with 5MB file-size limits.

2. **Zero-Credentials-In-Git Policy**:
   - Administrator authentication does not store plaintext or hashed credentials in Git.
   - 5 distinct executive accounts are verified dynamically at runtime via secure environment variables (`ADMIN_USER_1..5`, `ADMIN_PASS_1..5`).
   - Passwords are verified in constant time (`crypto.timingSafeEqual`) to mitigate timing side-channel exploits.

---

## 👥 Student Points of Contact (POCs)

- **General Operations & Coordination**:
  - S. Sai Kumar: [+91 77320 14762](tel:+917732014762)
  - S. Sameer Basha: [+91 96764 19146](tel:+919676419146)
- **Events Secretariat**:
  - T. Jaya Kumar: [+91 74165 32304](tel:+917416532304)
- **Transportation & Hospitality**:
  - S. Durga Sai Ram: [+91 93924 58746](tel:+919392458746)

---

## 📜 Institution & Department Credits

- **Organized By**: The Institution of Engineers (India) Students' Chapter (IEI SAME)
- **Department**: Department of Mechanical Engineering
- **Institution**: Vasireddy Venkatadri Institute of Technology (Autonomous / VVITU)
- **Address**: NH-16 Bypass Expressway, Nambur (V), Guntur District, Andhra Pradesh – 522508
- **Email**: `ieisame@vvitu.edu.in`
