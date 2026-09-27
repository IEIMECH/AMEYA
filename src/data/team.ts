export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: string;
  divisionIndex: number;
  department: string;
  year: string;
  avatar: string; // initials
  callsign: string; // roll number
  clearance: string;
  specialization: string;
  bio: string;
  image?: string;
  exploreCoords: { x: number; y: number };
  socials: {
    linkedin?: string;
    github?: string;
    email?: string;
    portfolio?: string;
  };
}

export interface TeamDivision {
  id: string;
  index: number;
  name: string;
  code: string;
  description: string;
  centerCoords: { x: number; y: number };
}

// Ordered strictly as requested:
// executive, events, social media, design, public relations, drafting
export const teamDivisions: TeamDivision[] = [
  {
    id: "executive",
    index: 0,
    name: "Executive Team",
    code: "EXEC // 01",
    description: "Supreme governance and festival steering committee for IEI SAME student council.",
    centerCoords: { x: 1400, y: 460 },
  },
  {
    id: "events",
    index: 1,
    name: "Events Council",
    code: "EVNT // 02",
    description: "Competition arena oversight, technical rules, judging protocols, and stage management.",
    centerCoords: { x: 780, y: 880 },
  },
  {
    id: "social-media",
    index: 2,
    name: "Social Media Council",
    code: "SOC // 03",
    description: "Digital campaign broadcast, live festival dispatches, media reels, and online delegate reach.",
    centerCoords: { x: 2020, y: 880 },
  },
  {
    id: "design",
    index: 3,
    name: "Design Council",
    code: "DSGN // 04",
    description: "Visual identity, festival branding, industrial typography, print collateral, and 3D CAD aesthetics.",
    centerCoords: { x: 820, y: 1480 },
  },
  {
    id: "public-relations",
    index: 4,
    name: "Public Relations Council",
    code: "PR // 05",
    description: "Inter-collegiate relations, dignitary facilitation, corporate sponsorship, and campus presence.",
    centerCoords: { x: 1980, y: 1480 },
  },
  {
    id: "drafting",
    index: 5,
    name: "Drafting Council",
    code: "DFTG // 06",
    description: "Technical problem statement formulation, scoring rubrics, and official rulebook documentation.",
    centerCoords: { x: 1400, y: 1560 },
  },
];

export const teamMembers: TeamMember[] = [
  // =========================================================================
  // 1. EXECUTIVE TEAM (Index 0)
  // =========================================================================
  {
    id: "exec-1",
    name: "S. Sai Kumar",
    role: "President",
    division: "Executive Team",
    divisionIndex: 0,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "SK",
    callsign: "24BQ5A0349",
    clearance: "LEVEL-4 EXEC",
    specialization: "Student Chapter Leadership & Fest Operations",
    bio: "President of IEI Mechanical Student Chapter, steering the strategic execution, institutional alignment, and overall festival governance of AMEYA '26.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503434/S.saikumar_president.jpg",
    exploreCoords: { x: 1400, y: 380 },
    socials: {
      email: "24bq5a0349@vvit.net",
    },
  },
  {
    id: "exec-2",
    name: "A.L. Harini",
    role: "Vice President",
    division: "Executive Team",
    divisionIndex: 0,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "AH",
    callsign: "23BQ1A0301",
    clearance: "LEVEL-4 EXEC",
    specialization: "Operational Protocol & Chapter Coordination",
    bio: "Vice President of IEI Mechanical Student Chapter, managing chapter operations, institutional protocol, and fest administration.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503386/A.L.Harini_viceprisident.jpg",
    exploreCoords: { x: 1250, y: 500 },
    socials: {
      email: "23bq1a0301@vvit.net",
    },
  },
  {
    id: "exec-3",
    name: "S.D. Sai Ram",
    role: "Secretary",
    division: "Executive Team",
    divisionIndex: 0,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "SR",
    callsign: "24BQ5A0348",
    clearance: "LEVEL-4 EXEC",
    specialization: "Secretariat & Administrative Telemetry",
    bio: "Secretary of IEI Mechanical Student Chapter, overseeing official documentation, communications, and administrative telemetry for AMEYA '26.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503462/S.D.sairam_secretary.jpg",
    exploreCoords: { x: 1550, y: 500 },
    socials: {
      email: "24bq5a0348@vvit.net",
    },
  },

  // =========================================================================
  // 2. EVENTS COUNCIL (Index 1)
  // =========================================================================
  {
    id: "events-1",
    name: "T. Jayakumar",
    role: "Events Head",
    division: "Events Council",
    divisionIndex: 1,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "TJ",
    callsign: "24BQ5A0357",
    clearance: "LEVEL-3 ARENA",
    specialization: "Arena Operations & Competition Scheduling",
    bio: "Head of Events Council, directing technical rounds, arena logistics, schedule orchestration, and participant briefings across all arenas.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503426/Tarra.Jayakumar_eventsHead.jpg",
    exploreCoords: { x: 780, y: 790 },
    socials: {
      email: "24bq5a0357@vvit.net",
    },
  },
  {
    id: "events-2",
    name: "B. Anand",
    role: "Events Coordinator",
    division: "Events Council",
    divisionIndex: 1,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "BA",
    callsign: "24BQ5A0309",
    clearance: "LEVEL-2 ARENA",
    specialization: "Technical Arena Coordination & Event Infrastructure",
    bio: "Events Coordinator managing competition stage setups, equipment staging, and real-time arena operations for mechanical symposium challenges.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503392/Boddu.Anand_eventsTeam.jpg",
    exploreCoords: { x: 670, y: 920 },
    socials: {
      email: "24bq5a0309@vvit.net",
    },
  },
  {
    id: "events-3",
    name: "P. Yaswanth",
    role: "Events Coordinator",
    division: "Events Council",
    divisionIndex: 1,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "PY",
    callsign: "24BQ5A0336",
    clearance: "LEVEL-2 ARENA",
    specialization: "Judging Protocols & Score Validation",
    bio: "Events Coordinator handling judging coordination, scoring criteria, and participant technical verification for competitive tracks.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503412/p.yaswanth_kumar_eventteam.jpg",
    exploreCoords: { x: 890, y: 920 },
    socials: {
      email: "24bq5a0336@vvit.net",
    },
  },

  // =========================================================================
  // 3. SOCIAL MEDIA COUNCIL (Index 2)
  // =========================================================================
  {
    id: "social-1",
    name: "SK. Ameer",
    role: "Social Media Head",
    division: "Social Media Council",
    divisionIndex: 2,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "SA",
    callsign: "24BQ5A0350",
    clearance: "LEVEL-3 COMM",
    specialization: "Digital Strategy & Media Outreach",
    bio: "Head of Social Media Council, orchestrating digital outreach, video campaigns, live broadcasts, and audience engagement across platforms.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503397/Sk.ameerpasha_SMHead.jpg",
    exploreCoords: { x: 2020, y: 790 },
    socials: {
      email: "24bq5a0350@vvit.net",
    },
  },
  {
    id: "social-2",
    name: "B. Srikanth",
    role: "Social Media Coordinator",
    division: "Social Media Council",
    divisionIndex: 2,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "BS",
    callsign: "24BQ5A0307",
    clearance: "LEVEL-2 COMM",
    specialization: "Media Production & Reel Creation",
    bio: "Social Media Coordinator managing visual content production, reel edits, and live festival broadcasting.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503450/B.srikanth_SMteam.jpg",
    exploreCoords: { x: 1910, y: 920 },
    socials: {
      email: "24bq5a0307@vvit.net",
    },
  },
  {
    id: "social-3",
    name: "K. Harsha",
    role: "Social Media Coordinator",
    division: "Social Media Council",
    divisionIndex: 2,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "KH",
    callsign: "24BQ5A0367",
    clearance: "LEVEL-2 COMM",
    specialization: "Audience Outreach & Online Campaigns",
    bio: "Social Media Coordinator managing delegate inquiries, viral engagement campaigns, and platform dispatches.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503400/K.HarshaVardhan_SM_member.jpg",
    exploreCoords: { x: 2130, y: 920 },
    socials: {
      email: "24bq5a0367@vvit.net",
    },
  },

  // =========================================================================
  // 4. DESIGN COUNCIL (Index 3)
  // =========================================================================
  {
    id: "design-1",
    name: "S.S. Basha",
    role: "Design Head",
    division: "Design Council",
    divisionIndex: 3,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "SB",
    callsign: "24BQ5A0369",
    clearance: "LEVEL-3 CAD",
    specialization: "Visual Identity & Creative Direction",
    bio: "Head of Design Council, leading fest visual identity, promotional posters, stage visualization, and machined graphic aesthetic.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503456/Syed_sameer_bhasha_designhead.jpg",
    exploreCoords: { x: 820, y: 1390 },
    socials: {
      email: "24bq5a0369@vvit.net",
    },
  },
  {
    id: "design-2",
    name: "Ch. Navaneeth",
    role: "Design Coordinator",
    division: "Design Council",
    divisionIndex: 3,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "CN",
    callsign: "24BQ5A0363",
    clearance: "LEVEL-2 CAD",
    specialization: "Digital Collateral & UI Assets",
    bio: "Design Coordinator crafting digital certificates, social assets, and technical infographics for AMEYA '26.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503500/Ch.navaneethkumar_DesignTeam.png",
    exploreCoords: { x: 710, y: 1520 },
    socials: {
      email: "24bq5a0363@vvit.net",
    },
  },
  {
    id: "design-3",
    name: "A.P.R. Kalyan",
    role: "Design Coordinator",
    division: "Design Council",
    divisionIndex: 3,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "AK",
    callsign: "24BQ5A0302",
    clearance: "LEVEL-2 CAD",
    specialization: "3D CAD Rendering & Motion Graphics",
    bio: "Design Coordinator developing print banners, physical stage backdrop artwork, and 3D visual assets.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503460/A.pawan_ratna_kalyan_designteam.jpg",
    exploreCoords: { x: 930, y: 1520 },
    socials: {
      email: "24bq5a0302@vvit.net",
    },
  },

  // =========================================================================
  // 5. PUBLIC RELATIONS COUNCIL (Index 4)
  // =========================================================================
  {
    id: "pr-1",
    name: "SK. Fouziya",
    role: "Public Relations Head",
    division: "Public Relations Council",
    divisionIndex: 4,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "SF",
    callsign: "23BQ1A0337",
    clearance: "LEVEL-3 PR",
    specialization: "Public Liaison & Institutional Relations",
    bio: "Head of Public Relations Council, leading inter-collegiate communications, VIP reception, and delegate hospitality.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503482/SK.IfrathFouziya_PRhead.png",
    exploreCoords: { x: 1980, y: 1390 },
    socials: {
      email: "23bq1a0337@vvit.net",
    },
  },
  {
    id: "pr-2",
    name: "B. Dileep",
    role: "PR Coordinator",
    division: "Public Relations Council",
    divisionIndex: 4,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "BD",
    callsign: "23BQ1A0304",
    clearance: "LEVEL-2 PR",
    specialization: "Inter-Collegiate Outreach & Hospitality",
    bio: "Public Relations Coordinator managing external college invitations, delegate helpdesks, and campus orientation.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503395/B.Dileep_prteam.jpg",
    exploreCoords: { x: 1870, y: 1520 },
    socials: {
      email: "23bq1a0304@vvit.net",
    },
  },
  {
    id: "pr-3",
    name: "D.V.S. Sagar",
    role: "PR Coordinator",
    division: "Public Relations Council",
    divisionIndex: 4,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "DS",
    callsign: "23BQ1A0311",
    clearance: "LEVEL-2 PR",
    specialization: "Guest Facilitation & Communications",
    bio: "Public Relations Coordinator coordinating dignitary reception, event logistics assistance, and delegate inquiries.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503407/D.V.S.Sagar_prteam.jpg",
    exploreCoords: { x: 2090, y: 1520 },
    socials: {
      email: "23bq1a0311@vvit.net",
    },
  },

  // =========================================================================
  // 6. DRAFTING COUNCIL (Index 5)
  // =========================================================================
  {
    id: "drafting-1",
    name: "K.S.S. Ganesh",
    role: "Drafting Head",
    division: "Drafting Council",
    divisionIndex: 5,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "KG",
    callsign: "24BQ5A0323",
    clearance: "LEVEL-3 DFTG",
    specialization: "Technical Rubrics & Official Documentation",
    bio: "Head of Drafting Council, authoring the official AMEYA '26 rulebook, competition rubrics, and dispute resolution guidelines.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503426/saisuryaganesh_DraftingHead.jpg",
    exploreCoords: { x: 1400, y: 1490 },
    socials: {
      email: "24bq5a0323@vvit.net",
    },
  },
  {
    id: "drafting-2",
    name: "SK. Basheer",
    role: "Drafting Coordinator",
    division: "Drafting Council",
    divisionIndex: 5,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "SB",
    callsign: "24BQ5A0351",
    clearance: "LEVEL-2 DFTG",
    specialization: "Problem Statements & Event Guidelines",
    bio: "Drafting Coordinator designing technical challenge problem statements, event constraints, and participant rulebooks.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790507046/Sk.Basheer_draftingteam.png",
    exploreCoords: { x: 1250, y: 1620 },
    socials: {
      email: "24bq5a0351@vvit.net",
    },
  },
  {
    id: "drafting-3",
    name: "SK. MD. Rafi",
    role: "Drafting Coordinator",
    division: "Drafting Council",
    divisionIndex: 5,
    department: "Department of Mechanical Engineering",
    year: "4th Year",
    avatar: "MR",
    callsign: "24BQ5A0352",
    clearance: "LEVEL-2 DFTG",
    specialization: "Score Sheets & Technical Dossiers",
    bio: "Drafting Coordinator formulating evaluation score sheets, referee dossiers, and post-round verification records.",
    image: "https://res.cloudinary.com/xxwao0ml/image/upload/v1790503389/Sk.mohmmadRafi_DraftingTeam.jpg",
    exploreCoords: { x: 1550, y: 1620 },
    socials: {
      email: "24bq5a0352@vvit.net",
    },
  },
];
