"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
}

export interface CameraPreset {
  id: string;
  label: string;
  camPos: [number, number, number];
  lookAt: [number, number, number];
}

// Exactly the central complex buildings: Central Block, Loyalty 1-4, H-Block, and OAT
const campusBuildings: CampusBuilding[] = [
  {
    id: "Central_Block",
    name: "CENTRAL BLOCK",
    shortName: "Central Block",
    position: [0, 8, 0],
    camPos: [0, 28, 38],
    lookAt: [0, 6, 0],
  },
  {
    id: "Loyalty_1",
    name: "LOYALTY 1",
    shortName: "Loyalty 1",
    position: [36, 8, -26],
    camPos: [48, 24, -10],
    lookAt: [36, 6, -26],
  },
  {
    id: "Loyalty_2",
    name: "LOYALTY 2",
    shortName: "Loyalty 2",
    position: [36, 8, 26],
    camPos: [48, 24, 42],
    lookAt: [36, 6, 26],
  },
  {
    id: "Loyalty_3",
    name: "LOYALTY 3",
    shortName: "Loyalty 3",
    position: [-36, 8, 26],
    camPos: [-48, 24, 42],
    lookAt: [-36, 6, 26],
  },
  {
    id: "Loyalty_4",
    name: "LOYALTY 4",
    shortName: "Loyalty 4",
    position: [-36, 8, -26],
    camPos: [-48, 24, -10],
    lookAt: [-36, 6, -26],
  },
  {
    id: "H_Block",
    name: "H - BLOCK",
    shortName: "H - Block",
    position: [0, 6, -66],
    camPos: [0, 24, -36],
    lookAt: [0, 6, -66],
  },
  {
    id: "OAT",
    name: "OAT",
    shortName: "OAT",
    position: [0, 3, 38],
    camPos: [0, 24, 62],
    lookAt: [0, 3, 38],
  },
];

// Presets specified by user: Isometric 45°, Top View, Front View
const cameraPresets: CameraPreset[] = [
  {
    id: "isometric",
    label: "Isometric 45°",
    camPos: [0, 56, 70],
    lookAt: [0, 4, -8],
  },
  {
    id: "topview",
    label: "Top View",
    camPos: [0, 108, 0.001],
    lookAt: [0, 0, 0],
  },
  {
    id: "frontview",
    label: "Front View",
    camPos: [0, 28, -96],
    lookAt: [0, 6, -10],
  },
];

export default function Venue3DViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding>(campusBuildings[0]);
  const [activePreset, setActivePreset] = useState<string>("isometric");
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hoveredBuilding, setHoveredBuilding] = useState<CampusBuilding | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 56, 70));
  const targetControlsTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 4, -8));
  const isTransitioning = useRef<boolean>(false);
  const highlightSpotlight = useRef<THREE.SpotLight | null>(null);
  const campusModelRef = useRef<THREE.Group | null>(null);

  // Focus Building Callback
  const handleFocusBuilding = useCallback((building: CampusBuilding) => {
    setSelectedBuilding(building);
    setActivePreset("");

    if (cameraRef.current && controlsRef.current) {
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
  }, []);

  // Apply Camera Preset (Isometric 45°, Top View, Front View)
  const handleApplyPreset = (preset: CameraPreset) => {
    setActivePreset(preset.id);
    if (cameraRef.current && controlsRef.current) {
      targetCamPos.current.set(...preset.camPos);
      targetControlsTarget.current.set(...preset.lookAt);
      isTransitioning.current = true;
    }
  };

  // Reset Camera View to Isometric 45°
  const handleResetCamera = () => {
    handleApplyPreset(cameraPresets[0]);
  };

  // Three.js Scene Setup & Model Loading
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let isRunning = true;
    let animId: number | null = null;
    const canvas = canvasRef.current;
    const width = containerRef.current.clientWidth;
    const height = Math.min(Math.max(window.innerHeight * 0.65, 420), 660);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0d);
    scene.fog = new THREE.FogExp2(0x0a0a0d, 0.0045);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.5, 600);
    camera.position.set(0, 56, 70);
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
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 15;
    controls.maxDistance = 180;
    controls.target.set(0, 4, -8);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
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
    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 0.55);
    fillLight.position.set(-60, 40, -50);
    scene.add(fillLight);

    // Dynamic building highlight spotlight
    const spot = new THREE.SpotLight(0xe51d25, 4.0, 80, Math.PI / 4.5, 0.35, 1.2);
    spot.position.set(0, 32, 0);
    spot.target.position.set(0, 8, 0);
    scene.add(spot);
    scene.add(spot.target);
    highlightSpotlight.current = spot;

    // Technical grid
    const grid = new THREE.GridHelper(180, 36, 0x331010, 0x141418);
    grid.position.set(0, -0.05, -5);
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

    const getMatchedBuilding = (hitObject: THREE.Object3D | null): CampusBuilding | null => {
      let curr = hitObject;
      while (curr && curr !== campusRoot && curr !== scene) {
        const nameOrId = curr.userData?.buildingId || curr.name;
        if (nameOrId) {
          const lower = nameOrId.toLowerCase();
          const match = campusBuildings.find(
            (b) =>
              b.id.toLowerCase() === lower ||
              b.name.toLowerCase() === lower ||
              lower.includes(b.id.toLowerCase())
          );
          if (match) return match;
        }
        curr = curr.parent;
      }
      return null;
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(campusRoot.children, true);

      let foundBuilding: CampusBuilding | null = null;
      for (const hit of intersects) {
        foundBuilding = getMatchedBuilding(hit.object);
        if (foundBuilding) break;
      }

      setHoveredBuilding(foundBuilding);
      canvas.style.cursor = foundBuilding ? "pointer" : "grab";
    };

    const handleClick = () => {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(campusRoot.children, true);

      for (const hit of intersects) {
        const foundBuilding = getMatchedBuilding(hit.object);
        if (foundBuilding) {
          handleFocusBuilding(foundBuilding);
          return;
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
  }, [autoRotate, handleFocusBuilding]);

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Top Floating Control Bar */}
      <div className={styles.topBar}>
        {/* Left: Active Building Indicator Pill */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", pointerEvents: "auto" }}>
          <div className={styles.activeBuildingPill}>
            <span className={styles.activeBuildingDot} />
            <span>{selectedBuilding.name}</span>
          </div>
        </div>

        {/* Right: Camera Action Controls */}
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
            title="Reset to Isometric View"
            className={styles.actionBtn}
          >
            <RotateCcw size={12} />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Preset Camera Viewpoints Bar: Isometric 45°, Top View, Front View */}
      <div className={styles.presetsBar}>
        <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "#71717a", padding: "4px 6px" }}>
          VIEW:
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

      {/* Main View Area (Unobscured 3D Viewport) */}
      <div className={styles.viewportArea}>
        <canvas ref={canvasRef} className={styles.canvas} />

        {/* Loading Indicator */}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner} />
            <div className={styles.loadingTitle}>GENERATING VVIT CENTRAL COMPLEX 3D MODEL</div>
            <div className={styles.loadingSub}>Loading Central Block, Loyalty 1–4, H-Block &amp; OAT...</div>
          </div>
        )}

        {/* Minimal Hover Tooltip HUD */}
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

        {/* Minimal Gesture Telemetry Hint (Bottom-Right) */}
        <div className={styles.telemetryBadge}>
          Left-click: Orbit &bull; Right-click: Pan &bull; Scroll: Zoom &bull; Click building to focus
        </div>
      </div>

      {/* Quick Navigation Location Pills Strip (Bottom: Central Block, Loyalty 1-4, H-Block, OAT) */}
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
