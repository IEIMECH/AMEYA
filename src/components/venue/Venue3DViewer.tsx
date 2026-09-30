"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  RotateCcw,
  RotateCw,
  Camera,
  MapPin,
  Layers,
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
    name: "Mechanical Engineering Block",
    role: "Host Department & Core Fest Arenas",
    events: "AutoCAD, Assemble & Disassemble Parts, Engineering Drawing",
    coords: [-16, 10, 6],
    photoCoords: { top: "62%", left: "20%" },
    color: "#E51D25",
    capacity: "450 Seats",
  },
  {
    id: "audi",
    name: "Central Block & Main Auditorium",
    role: "Central Administrative & Plenary Complex",
    events: "Inaugural Ceremony, Keynote Addresses, Valedictory",
    coords: [0, 13, -5],
    photoCoords: { top: "38%", left: "53%" },
    color: "#FFFFFF",
    capacity: "500 Seats",
  },
  {
    id: "quad",
    name: "Central Courtyard & Arena Ground",
    role: "Outdoor Track & Kinetic Challenge Zone",
    events: "RC Car Challenge, Treasure Hunt, Nuts & Bolts Speed Race",
    coords: [0, 3, 2],
    photoCoords: { top: "48%", left: "50%" },
    color: "#FF3B3B",
    capacity: "1200 Attendees",
  },
  {
    id: "cse",
    name: "Technology & Computing Block",
    role: "East Wing Academic Block",
    events: "High-Performance Workstations, Technical Simulations",
    coords: [16, 10, 6],
    photoCoords: { top: "64%", left: "82%" },
    color: "#D8D8D8",
    capacity: "400 Students",
  },
  {
    id: "gate",
    name: "Campus Main Boulevard & Welcome Desk",
    role: "Entry Gate & Registration Desk",
    events: "QR Ticket Scan, Attendee Kit Distribution, Helpdesk",
    coords: [0, 2, 22],
    photoCoords: { top: "85%", left: "52%" },
    color: "#E51D25",
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
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 38, 54));
  const targetControlsTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 5, 0));
  const isTransitioning = useRef<boolean>(false);
  const highlightSpotlight = useRef<THREE.SpotLight | null>(null);

  useEffect(() => {
    if (activeTab !== "3d" || !canvasRef.current || !containerRef.current) return;

    let isRunning = true;
    let animId: number | null = null;
    const canvas = canvasRef.current;
    const width = containerRef.current.clientWidth;
    const height = 560;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060606);
    scene.fog = new THREE.FogExp2(0x060606, 0.011);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 600);
    camera.position.set(0, 38, 54);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x060606, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Fluid Orbit Controls with momentum damping
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.minDistance = 16;
    controls.maxDistance = 140;
    controls.target.set(0, 5, 0);
    controlsRef.current = controls;

    // Atmospheric lighting
    const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x111111, 0.85);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xFFFAEE, 2.0);
    sunLight.position.set(40, 60, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Dynamic building highlight spotlight
    const spot = new THREE.SpotLight(0xE51D25, 4.0, 60, Math.PI / 4, 0.4, 1.5);
    spot.position.set(-16, 35, 6);
    spot.target.position.set(-16, 5, 6);
    scene.add(spot);
    scene.add(spot.target);
    highlightSpotlight.current = spot;

    // Materials
    const brickMat = new THREE.MeshStandardMaterial({
      color: 0x9e2417,
      roughness: 0.7,
      metalness: 0.1,
    });
    const whiteTrimMat = new THREE.MeshStandardMaterial({
      color: 0xF2EDE8,
      roughness: 0.35,
      metalness: 0.15,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0A0F1D,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x8892B0,
      metalness: 0.85,
      roughness: 0.2,
    });
    const fieldMat = new THREE.MeshStandardMaterial({
      color: 0x0A0A0A,
      roughness: 0.95,
      metalness: 0.1,
    });
    const pavementMat = new THREE.MeshStandardMaterial({
      color: 0x1E1E1E,
      roughness: 0.6,
      metalness: 0.3,
    });

    const campusGroup = new THREE.Group();

    // Base ground plane
    const baseMesh = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), fieldMat);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.receiveShadow = true;
    campusGroup.add(baseMesh);

    // Subtle technical grid
    const grid = new THREE.GridHelper(160, 40, 0x441010, 0x181818);
    grid.position.y = 0.02;
    campusGroup.add(grid);

    // Central courtyard road & path
    const pathMesh = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), pavementMat);
    pathMesh.rotation.x = -Math.PI / 2;
    pathMesh.position.set(0, 0.05, -1);
    pathMesh.receiveShadow = true;
    campusGroup.add(pathMesh);

    // Helper to build architectural wing block
    const createWingBlock = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number
    ) => {
      const wing = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), brickMat);
      body.castShadow = true;
      body.receiveShadow = true;
      wing.add(body);

      // Glass ribbon window
      const win = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, h * 0.25, d + 0.1), glassMat);
      win.position.y = h * 0.15;
      wing.add(win);

      // Roof cornice
      const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.5, 0.6, d + 0.5), whiteTrimMat);
      roof.position.y = h / 2 + 0.3;
      wing.add(roof);

      wing.position.set(x, y + h / 2, z);
      return wing;
    };

    // 1. Central Auditorium Complex
    const audiWing = createWingBlock(24, 14, 18, 0, 0, -8);
    campusGroup.add(audiWing);

    // 2. West Wing: Mechanical Engineering Block (IEI SAME HQ)
    const mechWing = createWingBlock(14, 12, 28, -20, 0, 4);
    campusGroup.add(mechWing);

    // 3. East Wing: Technology Block
    const cseWing = createWingBlock(14, 12, 28, 20, 0, 4);
    campusGroup.add(cseWing);

    // 4. Connecting skywalk bridges
    const bridgeWest = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 4), metalMat);
    bridgeWest.position.set(-11, 8, -4);
    campusGroup.add(bridgeWest);

    const bridgeEast = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 4), metalMat);
    bridgeEast.position.set(11, 8, -4);
    campusGroup.add(bridgeEast);

    scene.add(campusGroup);

    // Smooth render & animation loop
    const tick = () => {
      if (!isRunning) return;

      // Smooth camera interpolation toward target
      if (isTransitioning.current) {
        camera.position.lerp(targetCamPos.current, 0.055);
        controls.target.lerp(targetControlsTarget.current, 0.055);

        if (camera.position.distanceTo(targetCamPos.current) < 0.15) {
          isTransitioning.current = false;
        }
      }

      if (autoRotate && !isTransitioning.current) {
        campusGroup.rotation.y += 0.002;
      }

      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

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
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [activeTab, autoRotate]);

  const handleFocusHotspot = useCallback((hs: Hotspot) => {
    setSelectedHotspot(hs);

    if (cameraRef.current && controlsRef.current && activeTab === "3d") {
      targetControlsTarget.current.set(hs.coords[0], hs.coords[1] - 4, hs.coords[2]);
      targetCamPos.current.set(hs.coords[0] + 14, hs.coords[1] + 16, hs.coords[2] + 22);
      isTransitioning.current = true;

      // Update spotlight target
      if (highlightSpotlight.current) {
        highlightSpotlight.current.position.set(hs.coords[0], hs.coords[1] + 25, hs.coords[2]);
        highlightSpotlight.current.target.position.set(hs.coords[0], hs.coords[1], hs.coords[2]);
      }
    }
  }, [activeTab]);

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      targetCamPos.current.set(0, 38, 54);
      targetControlsTarget.current.set(0, 5, 0);
      isTransitioning.current = true;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(10, 10, 10, 0.8)",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.85)",
        marginBottom: "3.5rem",
      }}
    >
      {/* Top Floating Control Bar */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          right: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 30,
          pointerEvents: "none",
        }}
      >
        {/* Left: Mode switcher */}
        <div
          style={{
            pointerEvents: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            background: "rgba(14, 14, 14, 0.85)",
            backdropFilter: "blur(16px)",
            padding: "4px",
            borderRadius: "9999px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("3d")}
            style={{
              padding: "5px 14px",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: activeTab === "3d" ? "var(--accent)" : "transparent",
              color: activeTab === "3d" ? "#FFFFFF" : "var(--text-secondary)",
              transition: "all 0.2s ease",
            }}
          >
            3D CAMPUS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("photo")}
            style={{
              padding: "5px 14px",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: activeTab === "photo" ? "var(--accent)" : "transparent",
              color: activeTab === "photo" ? "#FFFFFF" : "var(--text-secondary)",
              transition: "all 0.2s ease",
            }}
          >
            AERIAL PHOTO
          </button>
        </div>

        {/* Right: Camera Action Controls */}
        {activeTab === "3d" && (
          <div
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto Orbit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "9999px",
                fontSize: "0.72rem",
                fontFamily: "var(--font-mono)",
                background: autoRotate ? "rgba(229, 29, 37, 0.2)" : "rgba(14, 14, 14, 0.85)",
                color: autoRotate ? "var(--accent)" : "var(--text-secondary)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(16px)",
                transition: "all 0.2s ease",
              }}
            >
              <RotateCw size={12} />
              <span>ORBIT</span>
            </button>

            <button
              type="button"
              onClick={handleResetCamera}
              title="Reset Camera View"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "9999px",
                fontSize: "0.72rem",
                fontFamily: "var(--font-mono)",
                background: "rgba(14, 14, 14, 0.85)",
                color: "var(--text-secondary)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(16px)",
                transition: "all 0.2s ease",
              }}
            >
              <RotateCcw size={12} />
              <span>RESET</span>
            </button>
          </div>
        )}
      </div>

      {/* Main View Area (Req 23.11: Responsive Viewport Fit & Touch Orbit) */}
      <div style={{ position: "relative", height: "clamp(340px, 58vh, 560px)", width: "100%", touchAction: "none" }}>
        {activeTab === "3d" ? (
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              outline: "none",
              touchAction: "none",
            }}
          />
        ) : (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src="/img/campus/aerial-view.webp"
              alt="VVITU Nambur Campus Aerial View"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            {/* Hotspots overlay on 2D Aerial photo */}
            {campusHotspots.map((hs) => {
              const isSelected = selectedHotspot.id === hs.id;
              return (
                <button
                  key={hs.id}
                  onClick={() => setSelectedHotspot(hs)}
                  style={{
                    position: "absolute",
                    top: hs.photoCoords.top,
                    left: hs.photoCoords.left,
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    background: isSelected ? "var(--accent)" : "rgba(14, 14, 14, 0.85)",
                    border: `1px solid ${isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.2)"}`,
                    color: "#FFFFFF",
                    fontSize: "0.72rem",
                    fontFamily: "var(--font-mono)",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.6)",
                  }}
                >
                  <MapPin size={11} />
                  <span>{hs.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Selected Building Editorial Material Panel (Bottom-Left) */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            right: "20px",
            maxWidth: "480px",
            background: "rgba(12, 12, 12, 0.85)",
            backdropFilter: "blur(20px) saturate(140%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            padding: "1.25rem 1.5rem",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.85)",
            zIndex: 30,
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {selectedHotspot.role}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "var(--text-muted)",
              }}
            >
              Capacity: {selectedHotspot.capacity}
            </span>
          </div>

          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#FFFFFF",
              margin: "0 0 0.4rem 0",
              lineHeight: 1.2,
            }}
          >
            {selectedHotspot.name}
          </h3>

          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            <strong style={{ color: "#FFFFFF" }}>Fest Events: </strong>
            {selectedHotspot.events}
          </p>
        </div>

        {/* Minimal Gesture Telemetry Hint (Bottom-Right) */}
        {activeTab === "3d" && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              background: "rgba(12, 12, 12, 0.65)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "9999px",
              padding: "4px 12px",
              fontSize: "0.68rem",
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              pointerEvents: "none",
              backdropFilter: "blur(12px)",
            }}
          >
            Left-click: Orbit &bull; Right-click: Pan &bull; Scroll: Zoom
          </div>
        )}
      </div>

      {/* Quick Location Pills Strip */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "0.85rem 1.25rem",
          background: "rgba(10, 10, 10, 0.95)",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          overflowX: "auto",
        }}
      >
        {campusHotspots.map((hs) => {
          const isSelected = selectedHotspot.id === hs.id;
          return (
            <button
              key={hs.id}
              type="button"
              onClick={() => handleFocusHotspot(hs)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "9999px",
                background: isSelected ? "rgba(229, 29, 37, 0.15)" : "rgba(255, 255, 255, 0.03)",
                border: `1px solid ${isSelected ? "var(--accent)" : "rgba(255, 255, 255, 0.06)"}`,
                color: isSelected ? "#FFFFFF" : "var(--text-secondary)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
            >
              <MapPin size={12} color={isSelected ? "var(--accent)" : "#96908B"} />
              <span>{hs.name.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}