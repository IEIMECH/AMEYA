"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  RotateCcw,
  RotateCw,
  MapPin,
  Compass,
  Layers,
  Sparkles,
} from "lucide-react";
import styles from "./Venue3DViewer.module.css";

export interface CampusFloor {
  level: string;
  title: string;
  desc: string;
}

export interface CampusBuilding {
  id: string;
  name: string;
  shortName: string;
  designation: string;
  zone: string;
  capacity: string;
  events: string;
  description: string;
  position: [number, number, number];
  camPos: [number, number, number];
  lookAt: [number, number, number];
  photoCoords?: { top: string; left: string };
  floors?: CampusFloor[];
}

export interface CameraPreset {
  id: string;
  label: string;
  camPos: [number, number, number];
  lookAt: [number, number, number];
}

const campusBuildings: CampusBuilding[] = [
  {
    id: "CENTRAL_BLOCK",
    name: "Central Block & Main Auditorium",
    shortName: "Central Block",
    designation: "Central Administration & Plenary Complex",
    zone: "Central Academic Complex",
    capacity: "800 Seats",
    events: "Inaugural Ceremony, Keynote Plenary, Valedictory Gala",
    description:
      "Square 4-story administrative nucleus featuring monumental arched portal, curved daylight skylight, central conference chambers, and the main fest plenary hall.",
    position: [0, 8, 0],
    camPos: [0, 28, 42],
    lookAt: [0, 6, 0],
    photoCoords: { top: "45%", left: "48%" },
    floors: [
      {
        level: "Ground Floor",
        title: "Main Plenary Auditorium & VIP Atrium",
        desc: "Acoustic 800-seat plenary theatre, VIP welcoming suites, and Secretariat.",
      },
      {
        level: "1st Floor",
        title: "Deaneries & Administrative Council",
        desc: "Principal chamber, administrative directorate, and fest registration control.",
      },
      {
        level: "2nd Floor",
        title: "Central Library & Digital Knowledge Core",
        desc: "Engineering archive, e-resource portals, and study concourse.",
      },
      {
        level: "3rd Floor",
        title: "Executive Seminar Halls & Board Room",
        desc: "Dual multimedia conference halls for VIP speakers and council reviews.",
      },
      {
        level: "Rooftop",
        title: "Vaulted Skylight & Solar Array",
        desc: "Central curved architectural daylight canopy illuminating all 4 tiers.",
      },
    ],
  },
  {
    id: "LF_3",
    name: "LF 3 — Academic Block (IEI SAME HQ)",
    shortName: "LF 3 (SAME)",
    designation: "Southwest Academic Wing (SAME HQ)",
    zone: "Central Quadrant (SW)",
    capacity: "650 Students",
    events: "IEI SAME Fest Operations, Design & Drafting Studio, Project Expo",
    description:
      "4-Story L-shaped block facing the entrance spine road. Houses IEI SAME student executive chambers, precision drafting studios, and mechatronics exhibits.",
    position: [-34, 8, 34],
    camPos: [-50, 24, 52],
    lookAt: [-34, 6, 34],
    photoCoords: { top: "60%", left: "38%" },
    floors: [
      {
        level: "Ground Floor",
        title: "IEI SAME Fest Operations Control",
        desc: "Central student coordination desk, kit distribution, and briefing room.",
      },
      {
        level: "1st Floor",
        title: "Engineering Graphics & Drafting Hall",
        desc: "Precision drafting tables and technical graphics facility.",
      },
      {
        level: "2nd Floor",
        title: "Robotics & Micro-Mechatronics Lab",
        desc: "Kinetic test tracks, mechatronics workstations.",
      },
      {
        level: "3rd Floor",
        title: "Digital Prototyping Workshop",
        desc: "3D printers and laser cutters.",
      },
      {
        level: "Rooftop",
        title: "Rooftop Solar Array",
        desc: "Grid-tied solar panels.",
      },
    ],
  },
  {
    id: "ARUNA_1",
    name: "Aruna 1 — Engineering Tower",
    shortName: "Aruna 1",
    designation: "Western Academic Complex",
    zone: "Western Quadrangle",
    capacity: "1,200 Students",
    events: "Kinetic Track Arena, Assemble & Disassemble Parts, AutoCAD Championship",
    description:
      "Prominent elongated 4-story engineering building (96m) featuring heavy mechanical workshops, barrel-vaulted roof canopy, white monumental entrance portico, and CNC machine shops.",
    position: [-82, 9, 5],
    camPos: [-52, 28, 15],
    lookAt: [-82, 8, 5],
    photoCoords: { top: "52%", left: "22%" },
    floors: [
      {
        level: "Ground Floor",
        title: "Heavy Machine Shop & Foundry Workshop",
        desc: "Lathes, CNC milling centers, welding bays, and mechanical assembly floor.",
      },
      {
        level: "1st Floor",
        title: "Computer-Aided Design (CAD/CAM) Lab",
        desc: "High-spec workstations running SolidWorks, AutoCAD, and ANSYS.",
      },
      {
        level: "2nd Floor",
        title: "Thermal Engineering & Fluid Mechanics Lab",
        desc: "Wind tunnel test rig, IC engine dynamometers, and pump testbeds.",
      },
      {
        level: "3rd Floor",
        title: "Mechatronics & Kinematics Studio",
        desc: "Mechanism demonstration kits and gear train test rigs.",
      },
      {
        level: "Rooftop",
        title: "Vaulted Canopy & Solar Field",
        desc: "Full-length arched canopy flanked by solar panel arrays.",
      },
    ],
  },
  {
    id: "H_BLOCK",
    name: "H - BLOCK",
    shortName: "H - Block",
    designation: "Northern Academic & Services Sector",
    zone: "Northern Perimeter",
    capacity: "500 Occupants",
    events: "Fest Registration, Help Desk, Refreshment Concourse",
    description:
      "Northern academic and student service facility (formerly labeled university cafeteria in older drafts). Features large open halls, curved roof canopy, and hospitality lounges.",
    position: [0, 8, -85],
    camPos: [0, 28, -52],
    lookAt: [0, 6, -85],
    photoCoords: { top: "25%", left: "48%" },
    floors: [
      {
        level: "Ground Floor",
        title: "Central Registration & Welcome Lounge",
        desc: "QR check-in counters and attendee kit distribution.",
      },
      {
        level: "1st Floor",
        title: "Hospitality & Dining Concourse",
        desc: "Air-conditioned dining lounge and refreshment stations.",
      },
      {
        level: "2nd Floor",
        title: "Faculty & VIP Discussion Suites",
        desc: "Meeting rooms and conference lounge.",
      },
    ],
  },
  {
    id: "LF_1",
    name: "LF 1 — Academic Block",
    shortName: "LF 1",
    designation: "Northeast Academic Quadrant",
    zone: "Central Quadrant (NE)",
    capacity: "600 Students",
    events: "Technical Paper Presentation, PPT Championships",
    description:
      "4-Story L-shaped block framing the northeast courtyard. Connected via skybridge to Central Block, equipped with smart lecture halls and rooftop solar microgrid.",
    position: [34, 8, -34],
    camPos: [50, 24, -16],
    lookAt: [34, 6, -34],
    photoCoords: { top: "35%", left: "60%" },
    floors: [
      {
        level: "Ground Floor",
        title: "Department Concourse & Reception",
        desc: "Faculty offices and student guidance center.",
      },
      {
        level: "1st Floor",
        title: "Smart Lecture Halls 101–108",
        desc: "Tiered presentation rooms with 4K projection.",
      },
      {
        level: "2nd Floor",
        title: "Computational Design Suite",
        desc: "High-spec CAD workstations.",
      },
      {
        level: "3rd Floor",
        title: "Advanced Research Labs",
        desc: "Project testing facilities.",
      },
      {
        level: "Rooftop",
        title: "Photovoltaic Solar Matrix",
        desc: "Clean power harvesting installation.",
      },
    ],
  },
  {
    id: "LF_2",
    name: "LF 2 — Academic Block",
    shortName: "LF 2",
    designation: "Northwest Academic Quadrant",
    zone: "Central Quadrant (NW)",
    capacity: "600 Students",
    events: "Coding Marathon, Algorithm Hackathon",
    description:
      "4-Story L-shaped block framing the northwest courtyard and open-air amphitheater. Connected via elevated skybridge.",
    position: [-34, 8, -34],
    camPos: [-50, 24, -16],
    lookAt: [-34, 6, -34],
    photoCoords: { top: "35%", left: "36%" },
    floors: [
      {
        level: "Ground Floor",
        title: "Amphitheater Concourse & Labs",
        desc: "Direct access to cultural stage.",
      },
      {
        level: "1st Floor",
        title: "Smart Lecture Halls 201–208",
        desc: "Acoustically treated halls.",
      },
      {
        level: "2nd Floor",
        title: "AI & Neural Computing Lab",
        desc: "GPU simulation rigs.",
      },
      {
        level: "3rd Floor",
        title: "Software Innovation Hub",
        desc: "Collaborative hackathon space.",
      },
      {
        level: "Rooftop",
        title: "Solar Array & Green Deck",
        desc: "Renewable energy system.",
      },
    ],
  },
  {
    id: "LF_4",
    name: "LF 4 — Academic Block",
    shortName: "LF 4",
    designation: "Southeast Academic Wing",
    zone: "Central Quadrant (SE)",
    capacity: "600 Students",
    events: "Technical Quiz, Robo-Wars Prep Zone",
    description:
      "4-Story L-shaped block overlooking the campus lake and sports fields. Connected via elevated skybridge.",
    position: [34, 8, 34],
    camPos: [50, 24, 52],
    lookAt: [34, 6, 34],
    photoCoords: { top: "60%", left: "60%" },
    floors: [
      {
        level: "Ground Floor",
        title: "Student Club Hub & Common Rooms",
        desc: "Society spaces and indoor technical displays.",
      },
      {
        level: "1st Floor",
        title: "Lecture Theatres 401–408",
        desc: "Multi-tier lecture classrooms.",
      },
      {
        level: "2nd Floor",
        title: "IoT & Embedded Systems Lab",
        desc: "Microcontroller testbenches.",
      },
      {
        level: "3rd Floor",
        title: "Cloud Simulation & Server Room",
        desc: "Network testing suites.",
      },
      {
        level: "Rooftop",
        title: "Solar Power Array",
        desc: "Photovoltaic generation array.",
      },
    ],
  },
  {
    id: "AMPHITHEATER",
    name: "Open-Air Amphitheater Plaza",
    shortName: "Amphitheater",
    designation: "Central Cultural Stage",
    zone: "Central Courtyard North",
    capacity: "600 Spectators",
    events: "Cultural Showcases, Acoustic Sessions, Award Ceremonies",
    description:
      "Semicircular tiered brick amphitheater and performance stage set behind the Central Block between LF1 and LF2.",
    position: [0, 2, -26],
    camPos: [0, 18, -6],
    lookAt: [0, 1, -26],
    photoCoords: { top: "36%", left: "48%" },
  },
  {
    id: "PLAYGROUND",
    name: "VVIT Sports Arena & 400m Track Ground",
    shortName: "Sports Arena",
    designation: "Athletic Field & Outdoor Arenas",
    zone: "Southern Sports Zone",
    capacity: "2,000 Spectators",
    events: "RC Car Championship, Aeromodelling Drone Flight, Sports Show",
    description:
      "Full-scale 400m red-clay running track, inner grass football stadium, cricket pitch, and basketball courts.",
    position: [50, 2, 85],
    camPos: [40, 24, 55],
    lookAt: [50, 1, 85],
    photoCoords: { top: "80%", left: "70%" },
  },
  {
    id: "VVIT_POND",
    name: "VVIT Lake & Conservation Pond",
    shortName: "Campus Lake",
    designation: "Natural Campus Ecological Feature",
    zone: "Eastern Eco-Reserve",
    capacity: "Scenic Promenade",
    events: "Evening Light Installation, Aquatic Drone Telemetry",
    description:
      "Natural curved water reservoir with stone revetment promenade and perimeter shade trees.",
    position: [80, 2, 15],
    camPos: [55, 20, 30],
    lookAt: [80, 1, 15],
    photoCoords: { top: "50%", left: "82%" },
  },
  {
    id: "BUS_PARKING",
    name: "Central Transit & Bus Terminal",
    shortName: "Bus Terminal",
    designation: "Campus Student Transit Hub",
    zone: "Southwest Transport Hub",
    capacity: "60+ College Buses",
    events: "Shuttle Station, Regional Delegate Arrival & Departure",
    description:
      "Paved parking yard accommodating VVIT's fleet of yellow transit buses serving coastal Andhra districts.",
    position: [-45, 2, 95],
    camPos: [-32, 18, 75],
    lookAt: [-45, 1, 95],
    photoCoords: { top: "78%", left: "30%" },
  },
  {
    id: "VIVA_SCHOOL",
    name: "VIVA The School by VVIT",
    shortName: "VIVA School",
    designation: "Autonomous International School Campus",
    zone: "Southwestern Sector",
    capacity: "500 Students",
    events: "Auxiliary Technical Display, Regional STEM Showcase",
    description:
      "Autonomous international school complex located on the campus perimeter. Features distinct multi-wing classrooms and courtyards.",
    position: [-85, 7, -110],
    camPos: [-60, 24, -80],
    lookAt: [-85, 6, -110],
    photoCoords: { top: "20%", left: "20%" },
  },
];

const cameraPresets: CameraPreset[] = [
  {
    id: "overview",
    label: "Isometric 45°",
    camPos: [0, 65, 95],
    lookAt: [0, 4, 0],
  },
  {
    id: "central",
    label: "Central Complex",
    camPos: [0, 32, 50],
    lookAt: [0, 6, 0],
  },
  {
    id: "aruna",
    label: "Aruna 1 (West)",
    camPos: [-52, 28, 15],
    lookAt: [-82, 8, 5],
  },
  {
    id: "hblock",
    label: "H - BLOCK (North)",
    camPos: [0, 28, -52],
    lookAt: [0, 6, -85],
  },
  {
    id: "sports",
    label: "Sports Ground",
    camPos: [38, 24, 55],
    lookAt: [50, 2, 85],
  },
  {
    id: "bus",
    label: "Bus Terminal",
    camPos: [-30, 18, 72],
    lookAt: [-45, 2, 95],
  },
];

export default function Venue3DViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"3d" | "photo">("3d");
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding>(campusBuildings[0]);
  const [activePreset, setActivePreset] = useState<string>("overview");
  const [selectedFloorIdx, setSelectedFloorIdx] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hoveredBuilding, setHoveredBuilding] = useState<CampusBuilding | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 65, 95));
  const targetControlsTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 4, 0));
  const isTransitioning = useRef<boolean>(false);
  const highlightSpotlight = useRef<THREE.SpotLight | null>(null);
  const campusModelRef = useRef<THREE.Group | null>(null);

  // Focus building callback
  const handleFocusBuilding = useCallback((building: CampusBuilding) => {
    setSelectedBuilding(building);
    setSelectedFloorIdx(0);

    if (cameraRef.current && controlsRef.current && activeTab === "3d") {
      targetControlsTarget.current.set(...building.lookAt);
      targetCamPos.current.set(...building.camPos);
      isTransitioning.current = true;

      if (highlightSpotlight.current) {
        highlightSpotlight.current.position.set(
          building.position[0],
          building.position[1] + 28,
          building.position[2]
        );
        highlightSpotlight.current.target.position.set(...building.position);
      }
    }
  }, [activeTab]);

  // Apply Camera Preset
  const handleApplyPreset = (preset: CameraPreset) => {
    setActivePreset(preset.id);
    if (cameraRef.current && controlsRef.current) {
      targetCamPos.current.set(...preset.camPos);
      targetControlsTarget.current.set(...preset.lookAt);
      isTransitioning.current = true;
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    handleApplyPreset(cameraPresets[0]);
  };

  // Three.js Scene Setup & Model Loading
  useEffect(() => {
    if (activeTab !== "3d" || !canvasRef.current || !containerRef.current) return;

    let isRunning = true;
    let animId: number | null = null;
    const canvas = canvasRef.current;
    const width = containerRef.current.clientWidth;
    const height = Math.min(Math.max(window.innerHeight * 0.65, 420), 650);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0d);
    scene.fog = new THREE.FogExp2(0x0a0a0d, 0.0045);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 900);
    camera.position.set(0, 65, 95);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Orbit Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 15;
    controls.maxDistance = 250;
    controls.target.set(0, 4, 0);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e1e24, 0.85);
    scene.add(hemiLight);

    // Warm Sun Directional Light
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(65, 95, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 300;
    sunLight.shadow.camera.left = -140;
    sunLight.shadow.camera.right = 140;
    sunLight.shadow.camera.top = 140;
    sunLight.shadow.camera.bottom = -140;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Accent directional fill from opposite side
    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 0.6);
    fillLight.position.set(-70, 40, -60);
    scene.add(fillLight);

    // Dynamic building highlight spotlight
    const spot = new THREE.SpotLight(0xe51d25, 4.2, 85, Math.PI / 5, 0.35, 1.2);
    spot.position.set(0, 36, 0);
    spot.target.position.set(0, 8, 0);
    scene.add(spot);
    scene.add(spot.target);
    highlightSpotlight.current = spot;

    // Subtle technical grid
    const grid = new THREE.GridHelper(300, 60, 0x331010, 0x141418);
    grid.position.y = -0.05;
    scene.add(grid);

    // Campus Root Group
    const campusRoot = new THREE.Group();
    campusRoot.name = "CAMPUS_ROOT";
    scene.add(campusRoot);
    campusModelRef.current = campusRoot;

    // Load Standalone Binary GLB Campus Model
    const loader = new GLTFLoader();
    setIsLoading(true);

    loader.load(
      "/models/vvit-campus.glb",
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        campusRoot.add(model);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.warn("Failed to load /models/vvit-campus.glb:", error);
        setIsLoading(false);
      }
    );

    // Raycasting for interactive hover and click
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(campusRoot.children, true);

      let foundBuilding: CampusBuilding | null = null;
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== campusRoot && curr !== scene) {
          if (curr.userData?.buildingId || curr.name) {
            const bId = curr.userData?.buildingId || curr.name;
            const match = campusBuildings.find((b) => b.id === bId);
            if (match) {
              foundBuilding = match;
              break;
            }
          }
          curr = curr.parent;
        }
        if (foundBuilding) break;
      }

      setHoveredBuilding(foundBuilding);
      canvas.style.cursor = foundBuilding ? "pointer" : "grab";
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(campusRoot.children, true);

      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== campusRoot && curr !== scene) {
          const bId = curr.userData?.buildingId || curr.name;
          const match = campusBuildings.find((b) => b.id === bId);
          if (match) {
            handleFocusBuilding(match);
            return;
          }
          curr = curr.parent;
        }
      }
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("click", handleClick);

    // Animation Render Loop
    const tick = () => {
      if (!isRunning) return;

      if (isTransitioning.current) {
        camera.position.lerp(targetCamPos.current, 0.055);
        controls.target.lerp(targetControlsTarget.current, 0.055);

        if (camera.position.distanceTo(targetCamPos.current) < 0.15) {
          isTransitioning.current = false;
        }
      }

      if (autoRotate && !isTransitioning.current) {
        campusRoot.rotation.y += 0.0018;
      }

      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth;
      cameraRef.current.aspect = newW / height;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [activeTab, autoRotate, handleFocusBuilding]);

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Top Floating Control Bar */}
      <div className={styles.topBar}>
        {/* Left: Mode switcher (3D Campus vs Satellite Photo) */}
        <div className={styles.modeSwitcher}>
          <button
            type="button"
            onClick={() => setActiveTab("3d")}
            className={`${styles.modeBtn} ${activeTab === "3d" ? styles.modeBtnActive : ""}`}
          >
            3D CAMPUS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("photo")}
            className={`${styles.modeBtn} ${activeTab === "photo" ? styles.modeBtnActive : ""}`}
          >
            AERIAL PHOTO
          </button>
        </div>

        {/* Right: Camera Action Controls */}
        {activeTab === "3d" && (
          <div className={styles.topActions}>
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto Orbit"
              className={`${styles.actionBtn} ${autoRotate ? styles.actionBtnActive : ""}`}
            >
              <RotateCw size={12} />
              <span>ORBIT</span>
            </button>

            <button
              type="button"
              onClick={handleResetCamera}
              title="Reset Camera View"
              className={styles.actionBtn}
            >
              <RotateCcw size={12} />
              <span>RESET</span>
            </button>
          </div>
        )}
      </div>

      {/* Preset Camera Viewpoints Bar (Upper Right) */}
      {activeTab === "3d" && (
        <div className={styles.presetsBar}>
          <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "#71717a", padding: "4px 6px" }}>
            PRESETS:
          </span>
          {cameraPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className={`${styles.presetBtn} ${activePreset === preset.id ? styles.presetBtnActive : ""}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Main View Area */}
      <div className={styles.viewportArea}>
        {activeTab === "3d" ? (
          <>
            <canvas ref={canvasRef} className={styles.canvas} />

            {/* Loading Indicator */}
            {isLoading && (
              <div className={styles.loadingOverlay}>
                <div className={styles.loadingSpinner} />
                <div className={styles.loadingTitle}>GENERATING VVIT 3D CAMPUS</div>
                <div className={styles.loadingSub}>Loading architectural geometry, solar arrays &amp; academic quads...</div>
              </div>
            )}

            {/* Hover Tooltip HUD */}
            {hoveredBuilding && (
              <div
                className={styles.hoverTooltip}
                style={{
                  left: `${mousePos.x}px`,
                  top: `${mousePos.y}px`,
                }}
              >
                <div className={styles.hoverTooltipName}>{hoveredBuilding.name}</div>
                <span className={styles.hoverTooltipHint}>Click to inspect architectural details</span>
              </div>
            )}
          </>
        ) : (
          <div className={styles.photoContainer}>
            <Image
              src="/img/venue/vvit-campus-oblique.jpg"
              alt="Vasireddy Venkatadri Institute of Technology Nambur Aerial Satellite View"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            {/* Hotspots overlay on 2D Aerial photo */}
            {campusBuildings.map((building) => {
              if (!building.photoCoords) return null;
              const isSelected = selectedBuilding.id === building.id;
              return (
                <button
                  key={building.id}
                  onClick={() => setSelectedBuilding(building)}
                  className={styles.photoHotspot}
                  style={{
                    top: building.photoCoords.top,
                    left: building.photoCoords.left,
                    background: isSelected ? "var(--accent)" : "rgba(14, 14, 16, 0.88)",
                    border: `1px solid ${isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.2)"}`,
                    color: "#FFFFFF",
                  }}
                >
                  <MapPin size={11} />
                  <span>{building.shortName}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Selected Building Architectural Dossier (Bottom-Left) */}
        <div className={styles.dossierPanel}>
          <div className={styles.dossierHeader}>
            <span className={styles.dossierBadge}>{selectedBuilding.designation}</span>
            <span className={styles.dossierCapacity}>Capacity: {selectedBuilding.capacity}</span>
          </div>

          <h3 className={styles.dossierTitle}>{selectedBuilding.name}</h3>

          <p className={styles.dossierDesc}>{selectedBuilding.description}</p>

          <div className={styles.dossierEvents}>
            <strong style={{ color: "#FFFFFF" }}>Fest Events Hosted: </strong>
            {selectedBuilding.events}
          </div>

          {/* Floor Level Breakdown System */}
          {selectedBuilding.floors && selectedBuilding.floors.length > 0 && (
            <div className={styles.floorsSection}>
              <div className={styles.floorsHeader}>
                <span className={styles.floorsLabel}>Floor Level Breakdown</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)" }}>
                  Tier {selectedFloorIdx + 1} of {selectedBuilding.floors.length}
                </span>
              </div>

              <div className={styles.floorsGrid}>
                {selectedBuilding.floors.map((floor, idx) => (
                  <button
                    key={floor.level}
                    type="button"
                    onClick={() => setSelectedFloorIdx(idx)}
                    className={`${styles.floorChip} ${selectedFloorIdx === idx ? styles.floorChipActive : ""}`}
                  >
                    {floor.level.replace(" Floor", "")}
                  </button>
                ))}
              </div>

              <div className={styles.floorDetail}>
                <div className={styles.floorDetailTitle}>
                  {selectedBuilding.floors[selectedFloorIdx]?.title}
                </div>
                <div>{selectedBuilding.floors[selectedFloorIdx]?.desc}</div>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Gesture Telemetry Hint (Bottom-Right) */}
        {activeTab === "3d" && (
          <div className={styles.telemetryBadge}>
            Left-click: Orbit &bull; Right-click: Pan &bull; Scroll: Zoom &bull; Click building to inspect
          </div>
        )}
      </div>

      {/* Quick Location Pills Strip (Bottom) */}
      <div className={styles.locationStrip}>
        {campusBuildings.map((building) => {
          const isSelected = selectedBuilding.id === building.id;
          return (
            <button
              key={building.id}
              type="button"
              onClick={() => handleFocusBuilding(building)}
              className={`${styles.locationPill} ${isSelected ? styles.locationPillActive : ""}`}
            >
              <MapPin size={12} color={isSelected ? "var(--accent)" : "#96908B"} />
              <span>{building.shortName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
