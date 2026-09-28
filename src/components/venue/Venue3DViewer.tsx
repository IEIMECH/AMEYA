"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  RotateCw,
  Camera,
  MapPin,
} from "lucide-react";

interface Hotspot {
  id: string;
  name: string;
  role: string;
  events: string;
  coords: [number, number, number];
  photoCoords: { top: string; left: string };
  color: string;
  capacity: string;
}

const campusHotspots: Hotspot[] = [
  {
    id: "mech",
    name: "Mechanical Engineering Block (IEI SAME HQ)",
    role: "Host Department & Core Fest Arenas",
    events: "AutoCAD, Assemble & Disassemble Parts, Engineering Drawing",
    coords: [-16, 10, 6],
    photoCoords: { top: "62%", left: "20%" },
    color: "#e61d1d",
    capacity: "450 Students",
  },
  {
    id: "audi",
    name: "Central Block & Main Auditorium",
    role: "Central Administrative & Plenary Complex",
    events: "Inaugural Ceremony, Keynote Addresses, Valedictory",
    coords: [0, 13, -5],
    photoCoords: { top: "38%", left: "53%" },
    color: "#ffffff",
    capacity: "850 Seats",
  },
  {
    id: "quad",
    name: "Central Courtyard & Arena Ground",
    role: "Outdoor Track & Kinetic Challenge Zone",
    events: "RC Car Challenge, Treasure Hunt, Nuts & Bolts Speed Race",
    coords: [0, 3, 2],
    photoCoords: { top: "48%", left: "50%" },
    color: "#ff3b3b",
    capacity: "1200 Attendees",
  },
  {
    id: "cse",
    name: "Technology & Computing Block",
    role: "East Wing Academic Block",
    events: "High-Performance Workstations, AI Prototyping",
    coords: [16, 10, 6],
    photoCoords: { top: "64%", left: "82%" },
    color: "#d8d8d8",
    capacity: "400 Students",
  },
  {
    id: "gate",
    name: "Campus Main Boulevard & Welcome Desk",
    role: "Entry Gate & Registration Kiosk",
    events: "QR Ticket Scan, Attendee Kit Distribution, Helpdesk",
    coords: [0, 2, 22],
    photoCoords: { top: "85%", left: "52%" },
    color: "#ff6b6b",
    capacity: "All Attendees",
  },
];

export default function Venue3DViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"3d" | "photo">("3d");
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(campusHotspots[0]);
  const [autoRotate, setAutoRotate] = useState(false);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (activeTab !== "3d" || !canvasRef.current || !containerRef.current) return;

    let isRunning = true;
    let animId: number | null = null;
    const canvas = canvasRef.current;
    const width = containerRef.current.clientWidth;
    const height = 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080808);
    scene.fog = new THREE.FogExp2(0x080808, 0.012);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 600);
    camera.position.set(0, 38, 54);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x080808, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.minDistance = 18;
    controls.maxDistance = 140;
    controls.target.set(0, 5, 0);
    controlsRef.current = controls;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111111, 0.9);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaf0, 2.2);
    sunLight.position.set(40, 60, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const neonAccent = new THREE.DirectionalLight(0xe61d1d, 1.2);
    neonAccent.position.set(-30, 25, -20);
    scene.add(neonAccent);

    const brickMat = new THREE.MeshStandardMaterial({
      color: 0xaa2e1f,
      roughness: 0.75,
      metalness: 0.1,
    });

    const whiteTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.15,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });

    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.85,
      roughness: 0.2,
    });

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.2,
    });

    const lawnMat = new THREE.MeshStandardMaterial({
      color: 0x181818,
      roughness: 0.85,
      metalness: 0.2,
    });

    const fieldMat = new THREE.MeshStandardMaterial({
      color: 0x121212,
      roughness: 0.92,
      metalness: 0.15,
    });

    const pavementMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.6,
      metalness: 0.35,
    });

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c0c,
      roughness: 0.85,
      metalness: 0.1,
    });

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.7, metalness: 0.3 });

    const campusGroup = new THREE.Group();

    const baseGeom = new THREE.PlaneGeometry(160, 160);
    const baseMesh = new THREE.Mesh(baseGeom, fieldMat);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.receiveShadow = true;
    campusGroup.add(baseMesh);

    const grid = new THREE.GridHelper(160, 40, 0xe61d1d, 0x331010);
    grid.position.y = 0.02;
    campusGroup.add(grid);

    const lawnGeom = new THREE.PlaneGeometry(36, 36);
    const lawnMesh = new THREE.Mesh(lawnGeom, lawnMat);
    lawnMesh.rotation.x = -Math.PI / 2;
    lawnMesh.position.set(0, 0.08, -1);
    lawnMesh.receiveShadow = true;
    campusGroup.add(lawnMesh);

    const roadGeom = new THREE.PlaneGeometry(8, 48);
    const roadMesh = new THREE.Mesh(roadGeom, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.set(0, 0.09, 14);
    roadMesh.receiveShadow = true;
    campusGroup.add(roadMesh);

    const pathHGeom = new THREE.PlaneGeometry(34, 2.5);
    const pathHMesh = new THREE.Mesh(pathHGeom, pavementMat);
    pathHMesh.rotation.x = -Math.PI / 2;
    pathHMesh.position.set(0, 0.1, -1);
    campusGroup.add(pathHMesh);

    const createWingBlock = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      hasSolar: boolean = false
    ) => {
      const wingGroup = new THREE.Group();
      wingGroup.position.set(x, y, z);

      const bodyGeom = new THREE.BoxGeometry(w, h, d);
      const body = new THREE.Mesh(bodyGeom, brickMat);
      body.castShadow = true;
      body.receiveShadow = true;
      wingGroup.add(body);

      const parapetGeom = new THREE.BoxGeometry(w + 0.3, 0.4, d + 0.3);
      const parapet = new THREE.Mesh(parapetGeom, whiteTrimMat);
      parapet.position.y = h / 2 + 0.2;
      parapet.castShadow = true;
      wingGroup.add(parapet);

      const floors = 3;
      for (let f = 0; f < floors; f++) {
        const floorY = -h / 2 + (h / (floors + 1)) * (f + 1);
        const winFrontGeom = new THREE.BoxGeometry(w * 0.85, 0.8, 0.2);
        const winFront = new THREE.Mesh(winFrontGeom, glassMat);
        winFront.position.set(0, floorY, d / 2 + 0.02);
        wingGroup.add(winFront);

        const winBackGeom = new THREE.BoxGeometry(w * 0.85, 0.8, 0.2);
        const winBack = new THREE.Mesh(winBackGeom, glassMat);
        winBack.position.set(0, floorY, -d / 2 - 0.02);
        wingGroup.add(winBack);
      }

      if (hasSolar) {
        const rows = 4;
        const cols = 2;
        const panelW = 3.8;
        const panelD = 1.4;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const panelGeom = new THREE.BoxGeometry(panelW, 0.08, panelD);
            const panel = new THREE.Mesh(panelGeom, solarMat);
            const px = (c - 0.5) * 4.6;
            const pz = (r - (rows - 1) / 2) * 2.8;
            panel.position.set(px, h / 2 + 0.6, pz);
            panel.rotation.x = -0.25;
            panel.castShadow = true;
            wingGroup.add(panel);

            const legGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.5);
            const leg = new THREE.Mesh(legGeom, metalMat);
            leg.position.set(px, h / 2 + 0.3, pz);
            wingGroup.add(leg);
          }
        }
      }

      return wingGroup;
    };

    const mechWing = createWingBlock(11, 7.5, 17, -16, 3.75, 7, true);
    campusGroup.add(mechWing);

    const cseWing = createWingBlock(11, 7.5, 17, 16, 3.75, 7, true);
    campusGroup.add(cseWing);

    const eceWing = createWingBlock(11, 7.5, 13, -16, 3.75, -12, false);
    campusGroup.add(eceWing);

    const civilWing = createWingBlock(11, 7.5, 13, 16, 3.75, -12, false);
    campusGroup.add(civilWing);

    const centralGroup = new THREE.Group();
    centralGroup.position.set(0, 4.5, -5);

    const centralMain = new THREE.Mesh(new THREE.BoxGeometry(14, 9, 11), brickMat);
    centralMain.castShadow = true;
    centralMain.receiveShadow = true;
    centralGroup.add(centralMain);

    const portalArch = new THREE.Mesh(new THREE.BoxGeometry(5.2, 8.5, 1.2), whiteTrimMat);
    portalArch.position.set(0, -0.25, 5.6);
    portalArch.castShadow = true;
    centralGroup.add(portalArch);

    const portalDoor = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.2, 0.2), glassMat);
    portalDoor.position.set(0, -2.8, 6.2);
    centralGroup.add(portalDoor);

    const cWin1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 0.2), glassMat);
    cWin1.position.set(0, 0.8, 6.2);
    centralGroup.add(cWin1);
    const cWin2 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 0.2), glassMat);
    cWin2.position.set(0, 2.6, 6.2);
    centralGroup.add(cWin2);

    const canopyGeom = new THREE.CylinderGeometry(2.6, 2.6, 3.8, 32, 1, false, 0, Math.PI);
    const canopy = new THREE.Mesh(canopyGeom, whiteTrimMat);
    canopy.rotation.z = Math.PI / 2;
    canopy.position.set(0, 4.7, 0);
    canopy.castShadow = true;
    centralGroup.add(canopy);

    campusGroup.add(centralGroup);

    const bridgeGeom = new THREE.BoxGeometry(5.5, 1.8, 2.2);
    const bridgeLeft = new THREE.Mesh(bridgeGeom, whiteTrimMat);
    bridgeLeft.position.set(-8, 5.5, -5);
    bridgeLeft.castShadow = true;
    campusGroup.add(bridgeLeft);

    const bridgeRight = new THREE.Mesh(bridgeGeom, whiteTrimMat);
    bridgeRight.position.set(8, 5.5, -5);
    bridgeRight.castShadow = true;
    campusGroup.add(bridgeRight);

    const carGeom = new THREE.BoxGeometry(1.4, 0.7, 2.6);
    const whiteCarMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.6, roughness: 0.3 });
    const darkCarMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.2 });

    const carPositions = [
      { x: -2.8, z: 12, mat: whiteCarMat },
      { x: -2.8, z: 16, mat: darkCarMat },
      { x: 2.8, z: 14, mat: whiteCarMat },
      { x: 2.8, z: 19, mat: whiteCarMat },
    ];
    carPositions.forEach((cp) => {
      const car = new THREE.Mesh(carGeom, cp.mat);
      car.position.set(cp.x, 0.45, cp.z);
      car.castShadow = true;
      campusGroup.add(car);
    });

    const treePositions = [
      [-7, -1], [7, -1], [-7, 8], [7, 8],
      [-5.5, 14], [-5.5, 20], [-5.5, 26],
      [5.5, 14], [5.5, 20], [5.5, 26],
      [-24, 0], [-24, 8], [-24, 16], [-24, -8], [-24, -16],
      [24, 0], [24, 8], [24, 16], [24, -8], [24, -16],
      [-8, -20], [0, -20], [8, -20],
    ];

    treePositions.forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.8), trunkMat);
      trunk.position.y = 0.9;
      tree.add(trunk);

      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), leafMat);
      foliage.position.y = 2.4;
      foliage.castShadow = true;
      tree.add(foliage);

      campusGroup.add(tree);
    });

    const pinGroup = new THREE.Group();
    campusHotspots.forEach((hs) => {
      const pinSubGroup = new THREE.Group();
      pinSubGroup.position.set(hs.coords[0], hs.coords[1], hs.coords[2]);

      const sphereMat = new THREE.MeshBasicMaterial({ color: hs.color });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), sphereMat);
      pinSubGroup.add(sphere);

      const ringGeom = new THREE.RingGeometry(0.9, 1.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: hs.color, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2;
      pinSubGroup.add(ring);

      const stemGeom = new THREE.CylinderGeometry(0.06, 0.06, 2.5);
      const stemMat = new THREE.MeshBasicMaterial({ color: hs.color, transparent: true, opacity: 0.7 });
      const stem = new THREE.Mesh(stemGeom, stemMat);
      stem.position.y = -1.25;
      pinSubGroup.add(stem);

      pinSubGroup.name = hs.id;
      pinGroup.add(pinSubGroup);
    });
    campusGroup.add(pinGroup);

    scene.add(campusGroup);

    const startTime = performance.now();
    const animate = () => {
      if (!isRunning) return;
      const elapsedTime = (performance.now() - startTime) * 0.001;

      if (autoRotate && controlsRef.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 1.0;
      } else if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }

      pinGroup.children.forEach((pin, i) => {
        pin.position.y = campusHotspots[i].coords[1] + Math.sin(elapsedTime * 2.5 + i) * 0.4;
      });

      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [activeTab, autoRotate]);

  const handleFocusHotspot = (hs: Hotspot) => {
    setSelectedHotspot(hs);
    if (cameraRef.current && controlsRef.current && activeTab === "3d") {
      controlsRef.current.target.set(hs.coords[0], hs.coords[1] - 4, hs.coords[2]);
      cameraRef.current.position.set(hs.coords[0] + 12, hs.coords[1] + 14, hs.coords[2] + 20);
    }
  };

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 38, 54);
      controlsRef.current.target.set(0, 5, 0);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        background: "#0c0c0e",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "4px",
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.85)",
        marginBottom: "3rem",
      }}
    >
      {/* Top Control Bar with Dual-View Switcher */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.5rem",
          background: "#111111",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#ff3b3b",
              boxShadow: "0 0 10px #ff3b3b",
            }}
          />
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>
              VVITU Quadrangle Campus Explorer
            </h3>
            <span style={{ fontSize: "0.75rem", color: "#888888" }}>
              Nambur, Guntur • Department of Mechanical Engineering (Ameya &apos;26)
            </span>
          </div>
        </div>

        <div
          style={{
            display: "inline-flex",
            background: "rgba(255, 255, 255, 0.04)",
            padding: "3px",
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <button
            suppressHydrationWarning
            type="button"
            onClick={() => setActiveTab("3d")}
            style={{
              padding: "6px 14px",
              borderRadius: "3px",
              border: activeTab === "3d" ? "1px solid var(--crimson-core, #E51D25)" : "1px solid transparent",
              fontSize: "0.78rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.18s ease",
              background: activeTab === "3d" ? "var(--crimson-core, #E51D25)" : "transparent",
              color: activeTab === "3d" ? "#FFFFFF" : "var(--text-secondary, #96908B)",
            }}
            aria-pressed={activeTab === "3d"}
          >
            3D DIGITAL TWIN
          </button>
          <button
            suppressHydrationWarning
            type="button"
            onClick={() => setActiveTab("photo")}
            style={{
              padding: "6px 14px",
              borderRadius: "3px",
              border: activeTab === "photo" ? "1px solid var(--crimson-core, #E51D25)" : "1px solid transparent",
              fontSize: "0.78rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.18s ease",
              background: activeTab === "photo" ? "var(--crimson-core, #E51D25)" : "transparent",
              color: activeTab === "photo" ? "#FFFFFF" : "var(--text-secondary, #96908B)",
            }}
            aria-pressed={activeTab === "photo"}
          >
            REAL AERIAL VIEW
          </button>
        </div>

        {activeTab === "3d" && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "3px",
                background: autoRotate ? "var(--crimson-core, #E51D25)" : "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${autoRotate ? "var(--crimson-core, #E51D25)" : "rgba(255, 255, 255, 0.1)"}`,
                color: autoRotate ? "#FFFFFF" : "var(--text-secondary, #96908B)",
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
              aria-pressed={autoRotate}
            >
              <RotateCw size={12} />
              {autoRotate ? "AUTO SPIN ACTIVE" : "AUTO SPIN"}
            </button>
            <button
              suppressHydrationWarning
              type="button"
              onClick={handleResetCamera}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "3px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "var(--text-secondary, #96908B)",
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              <Camera size={12} />
              RESET VIEW
            </button>
          </div>
        )}
      </div>

      <div style={{ position: "relative", width: "100%", height: "520px", background: "#080808" }}>
        {activeTab === "3d" && (
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", display: "block", cursor: "grab" }}
          />
        )}

        {activeTab === "photo" && (
          <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
            <Image
              src="/img/venue/vvit-campus-aerial.jpg"
              alt="Aerial campus photography of VVIIT central quadrangle and mechanical engineering laboratories"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              fill
              style={{ objectFit: "cover" }}
              priority
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,8,20,0.6) 100%)",
                pointerEvents: "none",
              }}
            />

            {campusHotspots.map((hs) => {
              const isSelected = selectedHotspot.id === hs.id;
              return (
                <div
                  key={hs.id}
                  onClick={() => setSelectedHotspot(hs)}
                  style={{
                    position: "absolute",
                    top: hs.photoCoords.top,
                    left: hs.photoCoords.left,
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    zIndex: 20,
                  }}
                >
                  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div
                      style={{
                        position: "absolute",
                        width: isSelected ? "44px" : "32px",
                        height: isSelected ? "44px" : "32px",
                        borderRadius: "50%",
                        background: `${hs.color}30`,
                        border: `2px solid ${hs.color}`,
                        animation: "pulse 2s infinite ease-out",
                      }}
                    />
                    <div
                      style={{
                        width: isSelected ? "18px" : "14px",
                        height: isSelected ? "18px" : "14px",
                        borderRadius: "50%",
                        background: hs.color,
                        boxShadow: `0 0 16px ${hs.color}`,
                        border: "2px solid #ffffff",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      top: "24px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#111111",
                      border: `1px solid ${isSelected ? hs.color : "rgba(255,255,255,0.2)"}`,
                      padding: "4px 10px",
                      borderRadius: "8px",
                      whiteSpace: "nowrap",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: isSelected ? hs.color : "#ffffff",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                    }}
                  >
                    {hs.name.split(" ")[0]}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            right: "20px",
            maxWidth: "460px",
            background: "rgba(17, 17, 17, 0.95)",
            border: `1px solid ${selectedHotspot.color}50`,
            borderRadius: "18px",
            padding: "1.25rem 1.5rem",
            backdropFilter: "blur(16px)",
            boxShadow: `0 10px 40px rgba(0, 0, 0, 0.7), 0 0 20px ${selectedHotspot.color}25`,
            zIndex: 30,
            transition: "all 0.3s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                color: selectedHotspot.color,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                background: `${selectedHotspot.color}15`,
                padding: "2px 8px",
                borderRadius: "99px",
                border: `1px solid ${selectedHotspot.color}40`,
              }}
            >
              {selectedHotspot.role}
            </span>
            <span style={{ fontSize: "0.75rem", color: "#888888" }}>
              Capacity: {selectedHotspot.capacity}
            </span>
          </div>

          <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0" }}>
            {selectedHotspot.name}
          </h4>

          <p style={{ fontSize: "0.85rem", color: "#b0b0b0", lineHeight: 1.5, margin: 0 }}>
            <strong style={{ color: "#ff3b3b" }}>Fest Activities: </strong>
            {selectedHotspot.events}
          </p>
        </div>

        {activeTab === "3d" && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(17, 17, 17, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "99px",
              padding: "4px 12px",
              fontSize: "0.75rem",
              color: "#888888",
              pointerEvents: "none",
              backdropFilter: "blur(8px)",
            }}
          >
            🖱️ Left-Click to Orbit • Right-Click to Pan • Scroll to Zoom
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "1rem 1.5rem",
          background: "#111111",
          overflowX: "auto",
        }}
      >
        {campusHotspots.map((hs) => {
          const isSelected = selectedHotspot.id === hs.id;
          return (
            <button
              key={hs.id}
              suppressHydrationWarning
              onClick={() => handleFocusHotspot(hs)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "12px",
                background: isSelected ? `${hs.color}20` : "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${isSelected ? hs.color : "rgba(255, 255, 255, 0.08)"}`,
                color: isSelected ? hs.color : "#888888",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
            >
              <MapPin size={14} color={hs.color} />
              {hs.name.split(" ")[0]} {hs.name.includes("Auditorium") ? "Auditorium" : "Block"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
