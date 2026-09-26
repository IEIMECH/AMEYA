export type EventType = "solo" | "team";

export interface Event {
  id: string;
  name: string;
  tagline: string;
  description: string;
  day: 1 | 2;
  time: string;
  venue: string;
  category: string;
  type: EventType;
  teamSize?: string;
  prizes: string;
  date?: string;
  icon: string;
  color: string;
}

export const events: Event[] = [
  // Day 1
  {
    id: "hackathon",
    name: "HackSprint 24H",
    tagline: "Code. Prototype. Deploy.",
    description:
      "A fast-paced technical prototyping sprint where teams race to build innovative hardware-software solutions for real-world mechanical and automation challenges.",
    day: 1,
    time: "09:00 AM – 03:00 PM",
    venue: "CSE Quantum Lab, Tech Towers",
    category: "Prototyping",
    type: "team",
    teamSize: "2–4 members",
    prizes: "₹10,000 | ₹6,000 | ₹3,000",
    icon: "⚡",
    color: "#e61d1d",
  },
  {
    id: "paper-presentation",
    name: "Tech Manuscript",
    tagline: "Present. Defend. Publish.",
    description:
      "Present peer-reviewed research papers spanning mechanical engineering, generative design, additive manufacturing, or supersonic propulsion before a distinguished jury.",
    day: 1,
    time: "10:00 AM – 01:00 PM",
    venue: "Seminar Hall A, Main Block",
    category: "Research",
    type: "team",
    teamSize: "1–2 members",
    prizes: "₹5,000 | ₹3,000 | ₹1,500",
    icon: "📄",
    color: "#ff3b3b",
  },
  {
    id: "cad-design",
    name: "CAD Clash Speed Modeling",
    tagline: "Precision Tolerances Under Pressure.",
    description:
      "Compete in a timed CAD design showdown. Participants receive an engineering drawing on-the-spot and must model the assembly using SolidWorks, Inventor, or Fusion 360.",
    day: 1,
    time: "11:00 AM – 01:30 PM",
    venue: "Advanced CAD / CAM Studio",
    category: "Design",
    type: "solo",
    prizes: "₹4,000 | ₹2,500 | ₹1,000",
    icon: "📐",
    color: "#ffffff",
  },
  {
    id: "quiz",
    name: "Mech Brainiac",
    tagline: "Theoretical Mastery & Speed.",
    description:
      "A high-stakes mechanical engineering quiz featuring rapid fire kinematics, thermodynamics visual rounds, and machine design diagnostics.",
    day: 1,
    time: "02:00 PM – 04:00 PM",
    venue: "Seminar Hall B, Design Block",
    category: "Conclave",
    type: "team",
    teamSize: "2 members",
    prizes: "₹3,000 | ₹2,000 | ₹1,000",
    icon: "⚙️",
    color: "#d8d8d8",
  },
  {
    id: "treasure-hunt",
    name: "Gear Hunt Conundrum",
    tagline: "Decode the Technical Clues.",
    description:
      "A campus-wide mechanical scavenger hunt with riddles rooted in manufacturing principles, gear ratios, and VVITU engineering landmarks.",
    day: 1,
    time: "03:00 PM – 05:00 PM",
    venue: "Campus Quadrangle & Workshops",
    category: "Challenge",
    type: "team",
    teamSize: "3–5 members",
    prizes: "₹4,000 | ₹2,500",
    icon: "🧭",
    color: "#e61d1d",
  },

  // Day 2
  {
    id: "robo-race",
    name: "Robo Rumble Combat & Race",
    tagline: "Build It. Battle It. Dominate.",
    description:
      "Heavyweight combat and obstacle navigation. Custom-built RC bots navigate ramps, kinetic obstacles, and battle head-to-head in the arena.",
    day: 2,
    time: "09:30 AM – 12:30 PM",
    venue: "Robotics Arena A, Workshop Block",
    category: "Robotics",
    type: "team",
    teamSize: "2–4 members",
    prizes: "₹8,000 | ₹5,000 | ₹2,000",
    icon: "🤖",
    color: "#e61d1d",
  },
  {
    id: "circuit-debug",
    name: "Circuit Breaker Mechatronics",
    tagline: "Diagnose Faults. Restore Control.",
    description:
      "Inspect faulty PLC systems, sensor-actuator loops, and micro-controller breadboards. Locate the hardware bug and restore mechanical telemetry.",
    day: 2,
    time: "10:00 AM – 12:00 PM",
    venue: "Mechatronics Lab, Workshop Block",
    category: "Mechatronics",
    type: "solo",
    prizes: "₹3,500 | ₹2,000 | ₹1,000",
    icon: "⚡",
    color: "#ff3b3b",
  },
  {
    id: "photography",
    name: "Industrial Lens Photography",
    tagline: "Beauty in Precision Machinery.",
    description:
      "Capture the soul of mechanical engineering on campus: lathe turnings, glowing welds, kinematic linkages, and workshop craftsmanship.",
    day: 2,
    time: "All Day (Submit by 3 PM)",
    venue: "Central Open Courtyard",
    category: "Exhibition",
    type: "solo",
    prizes: "₹2,500 | ₹1,500 | ₹750",
    icon: "📸",
    color: "#888888",
  },
  {
    id: "debate",
    name: "Iron Tongue Technical Debate",
    tagline: "Clash of Engineering Minds.",
    description:
      "Debate provocative topics: AI-driven autonomous manufacturing, green hydrogen vs solid-state batteries, and space robotics ethics.",
    day: 2,
    time: "02:00 PM – 04:30 PM",
    venue: "Seminar Hall A, Main Block",
    category: "Conclave",
    type: "solo",
    prizes: "₹3,000 | ₹2,000 | ₹1,000",
    icon: "🎙️",
    color: "#d8d8d8",
  },
  {
    id: "closing-ceremony",
    name: "Grand Finale & Award Ceremony",
    tagline: "Honoring Mechanical Excellence.",
    description:
      "The prestigious grand finale of Ameya 2026. Trophy distributions, felicitation of national champions, and the keynote valedictory address.",
    day: 2,
    time: "05:00 PM – 07:00 PM",
    venue: "Main Auditorium (Central)",
    category: "Valedictory",
    type: "solo",
    prizes: "Mementos & Citations",
    icon: "🏆",
    color: "#e61d1d",
  },
  // General Access
  {
    id: "visitor-pass",
    name: "Fest Visitor Pass",
    tagline: "Spectate. Network. Explore.",
    description:
      "Attend AMEYA '26 as a general spectator and delegate without competing in arenas. Access all keynote addresses, exhibitions, mechanical project expos, and the 3D campus quadrangle.",
    day: 1,
    time: "All Days (Oct 04–05)",
    venue: "All Open Arenas & Auditoriums",
    category: "Visitor Pass",
    type: "solo",
    prizes: "Certificate of Attendance",
    icon: "🎟️",
    color: "#E51D25",
  },
];
