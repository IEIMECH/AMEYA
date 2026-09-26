export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: string;
  divisionIndex: number;
  department: string;
  year: string;
  avatar: string; // initials
  callsign: string;
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

export const teamDivisions: TeamDivision[] = [
  {
    id: "executive",
    index: 0,
    name: "Executive Directorate",
    code: "EXEC // 01",
    description: "Supreme governance and festival steering committee for IEI SAME council.",
    centerCoords: { x: 1400, y: 460 },
  },
  {
    id: "technical",
    index: 1,
    name: "Technical Operations",
    code: "TECH // 02",
    description: "Hardware telemetry, combat arena control, and automated scoring systems.",
    centerCoords: { x: 780, y: 840 },
  },
  {
    id: "design",
    index: 2,
    name: "Design & Media",
    code: "DSGN // 03",
    description: "Machined UI/UX graphics, 3D CAD visualization, and audiovisual production.",
    centerCoords: { x: 2020, y: 840 },
  },
  {
    id: "logistics",
    index: 3,
    name: "Logistics & Arenas",
    code: "LOGS // 04",
    description: "RoboWars safety enclosure, power grids, and high-velocity material flow.",
    centerCoords: { x: 820, y: 1440 },
  },
  {
    id: "publicity",
    index: 4,
    name: "Publicity & Outreach",
    code: "COMM // 05",
    description: "Inter-collegiate delegate communications, media blitz, and public affairs.",
    centerCoords: { x: 1980, y: 1440 },
  },
  {
    id: "finance",
    index: 5,
    name: "Finance & Sponsorship",
    code: "FNC // 06",
    description: "Industrial partnerships, corporate grants, and fiscal allocation telemetry.",
    centerCoords: { x: 1400, y: 1560 },
  },
];

export const teamMembers: TeamMember[] = [
  // 0: Executive Directorate
  {
    id: "1",
    name: "Arjun Reddy",
    role: "President",
    division: "Executive Directorate",
    divisionIndex: 0,
    department: "Mechanical Engineering",
    year: "4th Year",
    avatar: "AR",
    callsign: "AEGIS-PRIME",
    clearance: "LEVEL-4 OMNI",
    specialization: "Aerodynamics & Festival Governance",
    bio: "Driving AMEYA 2026 into a high-octane celebration of mechanical grit and autonomous systems. If it rotates, we optimize it.",
    exploreCoords: { x: 1400, y: 380 },
    socials: {
      linkedin: "https://linkedin.com/in/arjun-reddy-ameya",
      github: "https://github.com/arjun-reddy",
      email: "arjun.president@ameyafest.org",
    },
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Vice President",
    division: "Executive Directorate",
    divisionIndex: 0,
    department: "Mechanical Engineering",
    year: "4th Year",
    avatar: "PS",
    callsign: "VALKYRIE-02",
    clearance: "LEVEL-4 EXEC",
    specialization: "Kinematics & Multi-tier Protocol",
    bio: "Bridging the gap between blueprint drafting and real-world arena execution. Precision isn\'t an option; it\'s our tolerance.",
    exploreCoords: { x: 1250, y: 520 },
    socials: {
      linkedin: "https://linkedin.com/in/priya-sharma-ameya",
      email: "priya.vp@ameyafest.org",
    },
  },
  {
    id: "3",
    name: "Nandini Iyer",
    role: "Secretary General",
    division: "Executive Directorate",
    divisionIndex: 0,
    department: "Mechanical Engineering",
    year: "3rd Year",
    avatar: "NI",
    callsign: "CHRONO-SEC",
    clearance: "LEVEL-3 EXEC",
    specialization: "Operations Telemetry & Documentation",
    bio: "Master of synchronization across 6 divisions and 1,500+ competing engineering delegates.",
    exploreCoords: { x: 1550, y: 520 },
    socials: {
      linkedin: "https://linkedin.com/in/nandini-iyer",
      email: "nandini.sec@ameyafest.org",
    },
  },

  // 1: Technical Operations
  {
    id: "4",
    name: "Karthik Nair",
    role: "Technical Head",
    division: "Technical Operations",
    divisionIndex: 1,
    department: "Mechanical Engineering",
    year: "3rd Year",
    avatar: "KN",
    callsign: "CYBER-GRID",
    clearance: "LEVEL-3 TECH",
    specialization: "Micro-controllers & Sensor Fusion",
    bio: "Building bulletproof automated scoring loops and telemetry downlinks for our 30kg combat arena bots.",
    exploreCoords: { x: 780, y: 740 },
    socials: {
      linkedin: "https://linkedin.com/in/karthik-nair-tech",
      github: "https://github.com/karthik-nair",
      email: "karthik.tech@ameyafest.org",
      portfolio: "https://karthiknair.dev",
    },
  },
  {
    id: "5",
    name: "Mohammed Farhan",
    role: "Robotics Arena Lead",
    division: "Technical Operations",
    divisionIndex: 1,
    department: "Mechanical Engineering",
    year: "2nd Year",
    avatar: "MF",
    callsign: "TORQUE-BOT",
    clearance: "LEVEL-2 TECH",
    specialization: "Pneumatics & High-Discharge Power",
    bio: "If the RPM isn\'t hitting 8,000, keep tuning. Engineering combat cages that safely contain pure mechanical chaos.",
    exploreCoords: { x: 650, y: 880 },
    socials: {
      linkedin: "https://linkedin.com/in/farhan-mech",
      github: "https://github.com/farhan-mech",
    },
  },
  {
    id: "6",
    name: "Sai Teja",
    role: "Firmware Engineer",
    division: "Technical Operations",
    divisionIndex: 1,
    department: "Mechanical Engineering",
    year: "2nd Year",
    avatar: "ST",
    callsign: "KERNEL-V",
    clearance: "LEVEL-2 TECH",
    specialization: "CAN Bus & Realtime Logic",
    bio: "Turning raw hardware pulses into low-latency spectator readouts. 100% mechanical passion.",
    exploreCoords: { x: 910, y: 880 },
    socials: {
      github: "https://github.com/saiteja-eng",
      email: "saiteja@ameyafest.org",
    },
  },

  // 2: Design & Media
  {
    id: "7",
    name: "Divya Menon",
    role: "Design Lead",
    division: "Design & Media",
    divisionIndex: 2,
    department: "Mechanical Engineering",
    year: "3rd Year",
    avatar: "DM",
    callsign: "MACHINA-ART",
    clearance: "LEVEL-3 CREATIVE",
    specialization: "Parametric CAD & Billet UI Systems",
    bio: "Form follows function, but aesthetic creates respect. Machining carbon and cold steel into every visual pixel.",
    exploreCoords: { x: 2020, y: 740 },
    socials: {
      linkedin: "https://linkedin.com/in/divya-menon-design",
      portfolio: "https://divyamenon.design",
    },
  },
  {
    id: "8",
    name: "Alok Verma",
    role: "3D CAD & Motion Visualizer",
    division: "Design & Media",
    divisionIndex: 2,
    department: "Mechanical Engineering",
    year: "2nd Year",
    avatar: "AV",
    callsign: "RENDER-FORGE",
    clearance: "LEVEL-2 CREATIVE",
    specialization: "Blender & WebGL Shaders",
    bio: "Generating photorealistic assembly schematics and exploded mechanical component renders.",
    exploreCoords: { x: 1890, y: 880 },
    socials: {
      github: "https://github.com/alok-cad",
      email: "alok.design@ameyafest.org",
    },
  },
  {
    id: "9",
    name: "Ritu Sen",
    role: "Visual Communications",
    division: "Design & Media",
    divisionIndex: 2,
    department: "Mechanical Engineering",
    year: "2nd Year",
    avatar: "RS",
    callsign: "SPECTRA-MEDIA",
    clearance: "LEVEL-2 CREATIVE",
    specialization: "Editorial Systems & Photography",
    bio: "Capturing the sparks, the tension, and the high-torque triumph of every battle on the floor.",
    exploreCoords: { x: 2150, y: 880 },
    socials: {
      linkedin: "https://linkedin.com/in/ritu-sen",
    },
  },

  // 3: Logistics & Arenas
  {
    id: "10",
    name: "Vikram Rao",
    role: "Logistics Commander",
    division: "Logistics & Arenas",
    divisionIndex: 3,
    department: "Mechanical Engineering",
    year: "3rd Year",
    avatar: "VR",
    callsign: "VORTEX-SUPPLY",
    clearance: "LEVEL-3 OPS",
    specialization: "Heavy Rigging & Rapid Deployment",
    bio: "Handling 3.5 metric tons of arena steel, polycarbonate impact shields, and emergency isolation circuits.",
    exploreCoords: { x: 820, y: 1340 },
    socials: {
      linkedin: "https://linkedin.com/in/vikram-rao-mech",
      email: "vikram.logistics@ameyafest.org",
    },
  },
  {
    id: "11",
    name: "Sneha Patel",
    role: "Arena Safety Officer",
    division: "Logistics & Arenas",
    divisionIndex: 3,
    department: "Mechanical Engineering",
    year: "3rd Year",
    avatar: "SP",
    callsign: "SHIELD-WALL",
    clearance: "LEVEL-3 SAFETY",
    specialization: "Ballistics Containment & Crowd Flow",
    bio: "Zero accidents, maximum kinetic energy. Ensuring high-speed shrapnel stays inside the test perimeter.",
    exploreCoords: { x: 690, y: 1480 },
    socials: {
      linkedin: "https://linkedin.com/in/sneha-patel-safety",
      email: "sneha.events@ameyafest.org",
    },
  },
  {
    id: "12",
    name: "Aman Gupta",
    role: "Field Operations Marshall",
    division: "Logistics & Arenas",
    divisionIndex: 3,
    department: "Mechanical Engineering",
    year: "2nd Year",
    avatar: "AG",
    callsign: "PIT-CREW-LEAD",
    clearance: "LEVEL-2 OPS",
    specialization: "Tooling Pits & Battery Safety",
    bio: "Managing rapid pit resets, soldering stations, and fire-safe charging enclosures between rounds.",
    exploreCoords: { x: 950, y: 1480 },
    socials: {
      linkedin: "https://linkedin.com/in/aman-gupta",
    },
  },

  // 4: Publicity & Outreach
  {
    id: "13",
    name: "Anjali Singh",
    role: "Publicity Head",
    division: "Publicity & Outreach",
    divisionIndex: 4,
    department: "Mechanical Engineering",
    year: "2nd Year",
    avatar: "AS",
    callsign: "BEACON-CHIEF",
    clearance: "LEVEL-3 OUTREACH",
    specialization: "Inter-State Campaigns & Press Relations",
    bio: "Broadcasting AMEYA across 40+ engineering colleges. If there\'s a lathe turning in the state, they know about us.",
    exploreCoords: { x: 1980, y: 1340 },
    socials: {
      linkedin: "https://linkedin.com/in/anjali-singh-publicity",
      email: "anjali.publicity@ameyafest.org",
    },
  },
  {
    id: "14",
    name: "Lakshmi Devi",
    role: "Cultural & Delegate Liaison",
    division: "Publicity & Outreach",
    divisionIndex: 4,
    department: "Mechanical Engineering",
    year: "2nd Year",
    avatar: "LD",
    callsign: "HARMONY-01",
    clearance: "LEVEL-2 OUTREACH",
    specialization: "Delegate Experience & Ceremonies",
    bio: "Uniting hard engineering with electrifying stage moments, award banquets, and musical adrenaline.",
    exploreCoords: { x: 1850, y: 1480 },
    socials: {
      linkedin: "https://linkedin.com/in/lakshmi-devi",
      email: "lakshmi.cultural@ameyafest.org",
    },
  },
  {
    id: "15",
    name: "Rohan Roy",
    role: "Digital Web Coordinator",
    division: "Publicity & Outreach",
    divisionIndex: 4,
    department: "Mechanical Engineering",
    year: "2nd Year",
    avatar: "RR",
    callsign: "UPLINK-NET",
    clearance: "LEVEL-2 DIGITAL",
    specialization: "Social Blitz & Ticket Flow",
    bio: "Keeping the servers humming and the registration portal blitzing through peak ticket releases.",
    exploreCoords: { x: 2110, y: 1480 },
    socials: {
      github: "https://github.com/rohanroy",
    },
  },

  // 5: Finance & Sponsorship
  {
    id: "16",
    name: "Rahul Kumar",
    role: "Sponsorship Head",
    division: "Finance & Sponsorship",
    divisionIndex: 5,
    department: "Mechanical Engineering",
    year: "3rd Year",
    avatar: "RK",
    callsign: "CATALYST-FNC",
    clearance: "LEVEL-3 CORP",
    specialization: "Industrial MoUs & Corporate Grants",
    bio: "Partnering with tier-1 automotive, aerospace, and tooling leaders to fund massive prize pools.",
    exploreCoords: { x: 1400, y: 1470 },
    socials: {
      linkedin: "https://linkedin.com/in/rahul-kumar-sponsorship",
      email: "rahul.sponsor@ameyafest.org",
    },
  },
  {
    id: "17",
    name: "Meera Joshi",
    role: "Treasurer",
    division: "Finance & Sponsorship",
    divisionIndex: 5,
    department: "Mechanical Engineering",
    year: "3rd Year",
    avatar: "MJ",
    callsign: "LEDGER-GUARD",
    clearance: "LEVEL-3 FNC",
    specialization: "Budget Telemetry & Audit Chains",
    bio: "Precision accounting to the nearest rupee, optimizing procurement for every stage of AMEYA 2026.",
    exploreCoords: { x: 1260, y: 1610 },
    socials: {
      linkedin: "https://linkedin.com/in/meera-joshi",
      email: "meera.treasurer@ameyafest.org",
    },
  },
  {
    id: "18",
    name: "Sameer Khan",
    role: "Industry Liaison",
    division: "Finance & Sponsorship",
    divisionIndex: 5,
    department: "Mechanical Engineering",
    year: "2nd Year",
    avatar: "SK",
    callsign: "ALLIANCE-OPS",
    clearance: "LEVEL-2 CORP",
    specialization: "Vendor Management & Swag Logistics",
    bio: "Connecting student engineers with hiring directors, internships, and cutting-edge industrial hardware demos.",
    exploreCoords: { x: 1540, y: 1610 },
    socials: {
      linkedin: "https://linkedin.com/in/sameer-khan-eng",
    },
  },
];
