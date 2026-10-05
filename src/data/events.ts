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
    id: "arc-of-genius",
    name: "Arc of Genius",
    day: 1,
    category: "Technical",
    type: "solo",
    tagline: "Engineering Drawings",
    description: "Fundamental engineering graphics, drafting standards, and geometric projection challenge emphasizing orthographic projections, isometric views, and dimensional precision.",
    time: "10:00 AM - 01:00 PM",
    venue: "CAD / Drawing Hall - Block A",
    prizes: "1st: ₹3,000 + Trophy | 2nd: ₹1,500 + Certificate",
    icon: "PenTool",
    color: "#E51D25",
  },
  {
    id: "mechanica-reassembled",
    name: "Mechanica: Reassembled",
    day: 1,
    category: "Technical",
    type: "solo",
    tagline: "Assemble & Disassemble of Parts",
    description: "Hands-on mechanical challenge testing component identification, mechanical dexterity, and rapid kinematic assembly sequencing against the clock.",
    time: "11:30 AM - 02:00 PM",
    venue: "Kinematics & Dynamics Lab - Ground Floor",
    prizes: "1st: ₹3,000 + Trophy | 2nd: ₹1,500 + Certificate",
    icon: "Wrench",
    color: "#E51D25",
  },
  {
    id: "starc-circuit",
    name: "StarC Circuit",
    day: 1,
    category: "Non-technical",
    type: "solo",
    tagline: "RC Car Challenge",
    description: "High-octane radio-controlled obstacle track navigation testing maneuvering skill, acceleration, and precision steering.",
    time: "02:00 PM - 05:00 PM",
    venue: "Mechanical Quadrangle - Outdoor Arena",
    prizes: "1st: ₹3,000 + Trophy | 2nd: ₹1,500 + Certificate",
    icon: "Gauge",
    color: "#0284c7",
  },
  {
    id: "the-infinity-quest",
    name: "The Infinity Quest",
    day: 1,
    category: "Non-technical",
    type: "solo",
    tagline: "Treasure Hunt",
    description: "Campus-wide scavenger pursuit deciphering cryptic mechanical clues, logical riddles, and physical landmarks across VVITU.",
    time: "02:30 PM - 05:30 PM",
    venue: "Campus Grounds - Central Fountain Start Point",
    prizes: "1st: ₹3,000 + Trophy | 2nd: ₹1,500 + Certificate",
    icon: "MapPin",
    color: "#0284c7",
  },

  // =========================================================================
  // DAY 2 (4 Events - Solo)
  // =========================================================================
  {
    id: "dimension-x",
    name: "Dimension X",
    day: 2,
    category: "Technical",
    type: "solo",
    tagline: "AutoCAD",
    description: "Technical CAD modeling and parametric drawing competition testing speed, dimensional accuracy, and software mastery.",
    time: "10:00 AM - 01:00 PM",
    venue: "CAD / CAM Laboratory - Block A",
    prizes: "1st: ₹3,000 + Trophy | 2nd: ₹1,500 + Certificate",
    icon: "Compass",
    color: "#E51D25",
  },
  {
    id: "the-armory",
    name: "The Armory",
    day: 2,
    category: "Technical",
    type: "solo",
    tagline: "Identify Tools & Their Functions",
    description: "Comprehensive identification and functional diagnostic challenge covering workshop machinery, measuring instruments, and hand tools.",
    time: "11:00 AM - 01:30 PM",
    venue: "Machine Shop & Central Workshop",
    prizes: "1st: ₹3,000 + Trophy | 2nd: ₹1,500 + Certificate",
    icon: "Hammer",
    color: "#E51D25",
  },
  {
    id: "mind-snap",
    name: "Mind Snap",
    day: 2,
    category: "Non-technical",
    type: "solo",
    tagline: "Picto",
    description: "Fast-paced visual guessing and deduction competition decoding technical and creative concepts under rapid time limits.",
    time: "01:30 PM - 03:30 PM",
    venue: "Seminar Hall 2 - Mechanical Block",
    prizes: "1st: ₹3,000 + Trophy | 2nd: ₹1,500 + Certificate",
    icon: "Sparkles",
    color: "#0284c7",
  },
  {
    id: "bolt-rush",
    name: "Bolt Rush",
    day: 2,
    category: "Non-technical",
    type: "solo",
    tagline: "Nuts & Bolts Speed Race",
    description: "A rapid manual dexterity and reflex race matching fasteners, threading pitch sizes, and torquing nuts to bolts against the clock.",
    time: "03:00 PM - 05:00 PM",
    venue: "Production Technology Lab",
    prizes: "1st: ₹3,000 + Trophy | 2nd: ₹1,500 + Certificate",
    icon: "Timer",
    color: "#0284c7",
  },
];
