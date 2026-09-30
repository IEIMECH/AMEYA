export type EventCategory = "Technical" | "Non-technical";

export interface Event {
  id: string;
  name: string;
  day: 1 | 2;
  category: EventCategory;
  type: "solo";
  tagline?: string;
  description?: string;
  time?: string;
  venue?: string;
  prizes?: string;
  icon?: string;
  color?: string;
}

export const events: Event[] = [
  // =========================================================================
  // DAY 1 (4 Events - Solo)
  // =========================================================================
  {
    id: "autocad",
    name: "AutoCAD",
    day: 1,
    category: "Technical",
    type: "solo",
    tagline: "Computer-Aided Precision Design",
    description: "Technical CAD modeling and parametric drawing competition testing speed, dimensional accuracy, and software mastery.",
    icon: "Compass",
    color: "#E51D25",
  },
  {
    id: "assemble-disassemble",
    name: "Assemble and Disassemble the Mechanical Parts",
    day: 1,
    category: "Technical",
    type: "solo",
    tagline: "Kinematic Assembly & Precision Speed",
    description: "Hands-on mechanical challenge testing component identification, mechanical dexterity, and assembly sequencing against the clock.",
    icon: "Wrench",
    color: "#E51D25",
  },
  {
    id: "rc-car-challenge",
    name: "RC Car Challenge",
    day: 1,
    category: "Non-technical",
    type: "solo",
    tagline: "Kinetic Track Navigation",
    description: "High-octane radio-controlled obstacle track navigation testing maneuvering skill, acceleration, and precision steering.",
    icon: "Gauge",
    color: "#F2EDE8",
  },
  {
    id: "picto",
    name: "Picto",
    day: 1,
    category: "Non-technical",
    type: "solo",
    tagline: "Visual Deduction & Fast Recognition",
    description: "Fast-paced visual guessing and deduction competition decoding technical and creative concepts under rapid time limits.",
    icon: "Sparkles",
    color: "#F2EDE8",
  },

  // =========================================================================
  // DAY 2 (4 Events - Solo)
  // =========================================================================
  {
    id: "engineering-drawing",
    name: "Engineering Drawing",
    day: 2,
    category: "Technical",
    type: "solo",
    tagline: "Geometric Projection & Drafting Standards",
    description: "Fundamental engineering graphics and drafting challenge emphasizing orthographic projections, isometric views, and dimensional precision.",
    icon: "PenTool",
    color: "#E51D25",
  },
  {
    id: "identify-tools",
    name: "Identify the tools & its function",
    day: 2,
    category: "Technical",
    type: "solo",
    tagline: "Workshop Tools & Manufacturing Telemetry",
    description: "Comprehensive identification and functional diagnostic challenge covering workshop machinery, measuring instruments, and hand tools.",
    icon: "Hammer",
    color: "#E51D25",
  },
  {
    id: "treasure-hunt",
    name: "Treasure Hunt",
    day: 2,
    category: "Non-technical",
    type: "solo",
    tagline: "Campus Exploration & Clue Decoding",
    description: "Campus-wide scavenger pursuit deciphering cryptic clues, logical puzzles, and mechanical landmarks across VVITU.",
    icon: "MapPin",
    color: "#F2EDE8",
  },
  {
    id: "nuts-and-bolts-speed-race",
    name: "Nuts and Bolts Speed Race",
    day: 2,
    category: "Non-technical",
    type: "solo",
    tagline: "Thread Matching & Fastener Velocity",
    description: "A rapid manual dexterity and reflex race matching fasteners, threading pitch sizes, and torquing nuts to bolts against the clock.",
    icon: "Timer",
    color: "#F2EDE8",
  },
];