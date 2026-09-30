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
} from "lucide-react";
import styles from "./Venue3DViewer.module.css";

export interface CampusBuilding {
  id: string;
  name: string;
  shortName: string;
  position: [number, number, number];
  camPos: [number, number, number];
  lookAt: [number, number, number];
  photoCoords?: { top: string; left: string };
}

export interface CameraPreset {
  id: string;
  label: string;
  camPos: [number, number, number];
  lookAt: [number, number, number];
}

// Exactly the 6 core buildings forming the VVIT Central Complex
const campusBuildings: CampusBuilding[] = [
  {
    id: "CENTRAL_BLOCK",
    name: "Central Block & Main Auditorium",
    shortName: "Central Block",
    position: [0, 8, 0],
    camPos: [0, 28, 36],
    lookAt: [0, 6, 0],
    photoCoords: { top: "45%", left: "48%" },
  },
  {
    id: "LF_1",
    name: "LF 1 — Academic Block",
    shortName: "LF 1",
    position: [28, 8, -22],
    camPos: [44, 22, -6],
    lookAt: [28, 6, -22],
    photoCoords: { top: "35%", left: "60%" },
  },
  {
    id: "LF_2",
    name: "LF 2 — Academic Block",
    shortName: "LF 2",
    position: [-28, 8, -22],
    camPos: [-44, 22, -6],
    lookAt: [-28, 6, -22],
    photoCoords: { top: "35%", left: "36%" },
  },
  {
    id: "LF_3",
    name: "LF 3 — Academic Block",
    shortName: "LF 3",
    position: [-28, 8, 22],
    camPos: [-44, 22, 38],
    lookAt: [-28, 6, 22],
    photoCoords: { top: "58%", left: "38%" },
  },
  {
    id: "LF_4",
    name: "LF 4 — Academic Block",
    shortName: "LF 4",
    position: [28, 8, 22],
    camPos: [44, 22, 38],
    lookAt: [28, 6, 22],
    photoCoords: { top: "58%", left: "60%" },
  },
  {
    id: "H_BLOCK",
    name: "H - BLOCK",
    shortName: "H - Block",
    position: [0, 6, -58],
    camPos: [0, 24, -28],
    lookAt: [0, 6, -58],
    photoCoords: { top: "25%", left: "48%" },
  },
];

const cameraPresets: CameraPreset[] = [
  {
    id: "overview",
    label: "Isometric 45°",
    camPos: [0, 48, 60],
    lookAt: [0, 4, -12],
  },
  {
    id: "central",
    label: "Central Block",
    camPos: [0, 28, 36],
    lookAt: [0, 6, 0],
  },
  {
    id: "hblock",
    label: "H - Block",
    camPos: [0, 24, -28],
    lookAt: [0, 6, -58],
  },
  {
    id: "lf1",
    label: "LF 1",
    camPos: [44, 22, -6],
    lookAt: [28, 6, -22],
  },
  {
    id: "lf2",
    label: "LF 2",
    camPos: [-44, 22, -6],
    lookAt: [-28, 6, -22],
  },
  {
    id: "lf3",
    label: "LF 3",
    camPos: [-44, 22, 38],
    lookAt: [-28, 6, 22],
  },
  {
    id: "lf4",
    label: "LF 4",
    camPos: [44, 22, 38],
    lookAt: [28, 6, 22],
  },
];

export default function Venue3DViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"3d" | "photo">("3d");
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding>(campusBuildings[0]);
  const [activePreset, setActivePreset] = useState<string>("overview");
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hoveredBuilding, setHoveredBuilding] = useState<CampusBuilding | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 48, 60));
  const targetControlsTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 4, -12));
  const isTransitioning = useRef<boolean>(false);
  const highlightSpotlight = useRef<THREE.SpotLight | null>(null);
  const campusModelRef = useRef<THREE.Group | null>(null);

  // Focus Building Callback
  const handleFocusBuilding = useCallback((building: CampusBuilding) => {
    setSelectedBuilding(building);
    setActivePreset(building.id.toLowerCase());

    if (cameraRef.current && controlsRef.current && activeTab === "3d") {
      targetControlsTarget.current.set(...building.lookAt);
      targetCamPos.current.set(...building.camPos);
      isTransitioning.current = true;

      if (highlightSpotlight.current) {
        highlightSpotlight.current.position.set(
          building.position[0],
          building.position[1] + 24,
          building.position[2]
        );
        highlightSpotlight.current.target.position.set(...building.position);
      }
    }
  }, [activeTab]);

  // Apply Camera Preset
  const handleApplyPreset = (preset: CameraPreset) => {
    setActivePreset(preset.id);
    const match = campusBuildings.find((b) => b.id.toLowerCase() === preset.id.toLowerCase());
    if (match) {
      setSelectedBuilding(match);
    }
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
    const height = Math.min(Math.max(window.innerHeight * 0.65, 420), 660);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0d);
    scene.fog = new THREE.FogExp2(0x0a0a0d, 0.005);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.5, 600);
    camera.position.set(0, 48, 60);
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
    renderer.toneMappingExposure = 1.15;

    // Orbit Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.08;
    controls.minDistance = 15;
    controls.maxDistance = 160;
    controls.target.set(0, 4, -12);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e1e24, 0.85);
    scene.add(hemiLight);

    // Warm Sun Directional Light
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.3);
    sunLight.position.set(45, 80, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 240;
    sunLight.shadow.camera.left = -90;
    sunLight.shadow.camera.right = 90;
    sunLight.shadow.camera.top = 90;
    sunLight.shadow.camera.bottom = -90;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Accent directional fill from opposite side
    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 0.5);
    fillLight.position.set(-60, 40, -50);
    scene.add(fillLight);

    // Dynamic building highlight spotlight
    const spot = new THREE.SpotLight(0xe51d25, 4.0, 75, Math.PI / 4.5, 0.35, 1.2);
    spot.position.set(0, 32, 0);
    spot.target.position.set(0, 8, 0);
    scene.add(spot);
    scene.add(spot.target);
    highlightSpotlight.current = spot;

    // Technical grid
    const grid = new THREE.GridHelper(180, 36, 0x331010, 0x141418);
    grid.position.set(0, -0.05, -15);
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

    const handleClick = () => {
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
        {/* Left: Mode switcher (3D Campus vs Aerial Photo) + Minimal Active Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", pointerEvents: "auto" }}>
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

          {activeTab === "3d" && (
            <div className={styles.activeBuildingPill}>
              <span className={styles.activeBuildingDot} />
              <span>{selectedBuilding.name}</span>
            </div>
          )}
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
                <div className={styles.loadingTitle}>GENERATING CENTRAL COMPLEX 3D MODEL</div>
                <div className={styles.loadingSub}>Loading Central Block, LF 1–4 &amp; H - Block architecture...</div>
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
                <span className={styles.hoverTooltipHint}>Click to focus camera</span>
              </div>
            )}
          </>
        ) : (
          <div className={styles.photoContainer}>
            <Image
              src="/img/venue/vvit-campus-oblique.jpg"
              alt="Vasireddy Venkatadri Institute of Technology Nambur Aerial View"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            {/* Hotspots overlay on 2D Aerial photo (6 Core Buildings Only) */}
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

        {/* Minimal Gesture Telemetry Hint (Bottom-Right) */}
        {activeTab === "3d" && (
          <div className={styles.telemetryBadge}>
            Left-click: Orbit &bull; Right-click: Pan &bull; Scroll: Zoom &bull; Click building to focus
          </div>
        )}
      </div>

      {/* Quick Navigation Location Pills Strip (Bottom: Exactly 6 Core Buildings) */}
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
