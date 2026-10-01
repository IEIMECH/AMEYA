"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let isRunning = true;
    let animationFrameId: number;

    // =========================================================================
    // Scene & Atmospheric Lighting Setup
    // =========================================================================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.016);

    const initialAspect = window.innerWidth / (window.innerHeight || 1);
    const initialZ = initialAspect < 1.4 ? 32 : 28;

    const camera = new THREE.PerspectiveCamera(
      40,
      initialAspect,
      0.1,
      250
    );
    camera.position.set(0, 0, initialZ);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x080808, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // Physical Billet Metal Shaders (MeshPhysicalMaterial)
    // Sun Gear: Anodized Crimson Aluminum with rich specular clearcoat
    const crimsonSunMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xcc1111,
      emissive: 0x330000,
      emissiveIntensity: 0.25,
      metalness: 0.90,
      roughness: 0.24,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
      reflectivity: 0.85,
    });

    // Planet & Outer Ring Gears: Brushed Dark Carbon Steel
    const carbonSteelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x222222,
      metalness: 0.95,
      roughness: 0.28,
      reflectivity: 0.8,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    });

    // Cold Steel Billet (Spider Arm, Impeller, Axle Sleeves)
    const coldSteelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd8d8d8,
      metalness: 0.92,
      roughness: 0.22,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    });

    // High-Polish Chrome Ball Bearings
    const chromeBearingMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.05,
      clearcoat: 1.0,
    });

    // Laser Splines: Ethereal Laser Hairlines with Additive Blending
    const laserSplineMaterial = new THREE.MeshBasicMaterial({
      color: 0xff2222,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    // HUD Reticle Rings
    const hudReticleMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3b3b,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    // High-Contrast Studio Lighting & Rim Accents
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(12, 18, 15);
    scene.add(keyLight);

    const crimsonRimLight = new THREE.DirectionalLight(0xff2222, 4.0);
    crimsonRimLight.position.set(-15, -10, -10);
    scene.add(crimsonRimLight);

    const steelFillLight = new THREE.DirectionalLight(0xcfd8dc, 1.5);
    steelFillLight.position.set(25, -12, 10);
    scene.add(steelFillLight);

    // Assembly Master Group (Holds all kinematic elements)
    const assemblyGroup = new THREE.Group();
    scene.add(assemblyGroup);

    // Base Isometric Tilt
    const baseTiltX = 0.18;
    const baseTiltY = -0.32;
    const baseTiltZ = 0.08;
    assemblyGroup.rotation.set(baseTiltX, baseTiltY, baseTiltZ);

    // Baseline Position Anchors
    let basePosX = 12.8;
    let basePosY = 0.4;
    let basePosZ = 0.0;
    let baseScale = 0.85;

    const updateAssemblyPosition = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth > 960) {
        // Desktop: scaled to 0.85, anchored on right hemisphere at X = 12.8
        basePosX = 12.8;
        basePosY = 0.4;
        basePosZ = 0.0;
        baseScale = 0.85;
      } else {
        // Mobile / Small Tablet
        basePosX = 0.0;
        basePosY = 3.0;
        basePosZ = -4.0;
        baseScale = 0.54;
      }
      assemblyGroup.position.set(basePosX, basePosY, basePosZ);
      assemblyGroup.scale.set(baseScale, baseScale, baseScale);
    };
    updateAssemblyPosition();

    // Procedural Spur Gear Geometry Generator with Sharp Tooth Chamfers
    const createSpurGearGeometry = (
      pitchRadius: number,
      numTeeth: number,
      toothHeight: number,
      holeRadius: number,
      depth: number,
      lighteningHoles = 4
    ) => {
      const shape = new THREE.Shape();
      const toothAngle = (Math.PI * 2) / numTeeth;
      const rootRadius = pitchRadius - toothHeight * 0.55;
      const tipRadius = pitchRadius + toothHeight * 0.45;

      for (let i = 0; i < numTeeth; i++) {
        const a = i * toothAngle;
        const a1 = a + toothAngle * 0.18;
        const a2 = a + toothAngle * 0.36;
        const a3 = a + toothAngle * 0.64;
        const a4 = a + toothAngle * 0.82;

        if (i === 0) {
          shape.moveTo(Math.cos(a) * rootRadius, Math.sin(a) * rootRadius);
        } else {
          shape.lineTo(Math.cos(a) * rootRadius, Math.sin(a) * rootRadius);
        }

        shape.lineTo(Math.cos(a1) * (rootRadius + toothHeight * 0.2), Math.sin(a1) * (rootRadius + toothHeight * 0.2));
        shape.lineTo(Math.cos(a2) * tipRadius, Math.sin(a2) * tipRadius);
        shape.lineTo(Math.cos(a3) * tipRadius, Math.sin(a3) * tipRadius);
        shape.lineTo(Math.cos(a4) * (rootRadius + toothHeight * 0.2), Math.sin(a4) * (rootRadius + toothHeight * 0.2));
      }
      shape.closePath();

      // Center Axle Hole
      if (holeRadius > 0) {
        const centerHole = new THREE.Path();
        centerHole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
        shape.holes.push(centerHole);
      }

      // Lightening cutouts
      if (lighteningHoles > 0 && pitchRadius > 2.2) {
        const cutoutDist = (pitchRadius + holeRadius) * 0.52;
        const cutoutRadius = Math.max(0.35, (pitchRadius - holeRadius) * 0.24);
        for (let k = 0; k < lighteningHoles; k++) {
          const ca = (k * Math.PI * 2) / lighteningHoles + Math.PI / lighteningHoles;
          const cutoutPath = new THREE.Path();
          cutoutPath.absarc(
            Math.cos(ca) * cutoutDist,
            Math.sin(ca) * cutoutDist,
            cutoutRadius,
            0,
            Math.PI * 2,
            true
          );
          shape.holes.push(cutoutPath);
        }
      }

      return new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.1,
        bevelThickness: 0.15,
      });
    };

    // Scaled-down gear dimensions
    const sunPitchRadius = 3.0;
    const sunTeeth = 18;
    const planetPitchRadius = 2.0;
    const planetTeeth = 12;
    const planetOrbitRadius = sunPitchRadius + planetPitchRadius; // 5.0 units
    const ringInnerRadius = planetOrbitRadius + planetPitchRadius; // 7.0 units
    const ringOuterRadius = 8.8;

    // 1. Central Sun Gear (Anodized Crimson Aluminum)
    const sunGeom = createSpurGearGeometry(sunPitchRadius, sunTeeth, 0.85, 1.35, 1.3, 4);
    sunGeom.center();
    const sunGear = new THREE.Mesh(sunGeom, crimsonSunMaterial);
    assemblyGroup.add(sunGear);

    // Hollow Hub Bearing Assembly
    const hubGroup = new THREE.Group();
    sunGear.add(hubGroup);

    const outerCollarGeom = new THREE.TorusGeometry(1.3, 0.14, 16, 32);
    const outerCollar = new THREE.Mesh(outerCollarGeom, coldSteelMaterial);
    hubGroup.add(outerCollar);

    const innerSleeveGeom = new THREE.TorusGeometry(0.75, 0.11, 16, 32);
    const innerSleeve = new THREE.Mesh(innerSleeveGeom, coldSteelMaterial);
    hubGroup.add(innerSleeve);

    const ballGeom = new THREE.SphereGeometry(0.2, 16, 16);
    for (let b = 0; b < 8; b++) {
      const ba = (b * Math.PI * 2) / 8;
      const ballMesh = new THREE.Mesh(ballGeom, chromeBearingMaterial);
      ballMesh.position.set(Math.cos(ba) * 1.02, Math.sin(ba) * 1.02, 0);
      hubGroup.add(ballMesh);
    }

    // 2. Three Planet Gears (Brushed Dark Carbon Steel)
    const planetGeom = createSpurGearGeometry(planetPitchRadius, planetTeeth, 0.8, 0.7, 1.2, 3);
    planetGeom.center();

    interface PlanetData {
      carrier: THREE.Group;
      mesh: THREE.Mesh;
      baseAngle: number;
    }

    const planets: PlanetData[] = [];

    for (let p = 0; p < 3; p++) {
      const baseAngle = (p * Math.PI * 2) / 3;
      const carrier = new THREE.Group();
      carrier.rotation.z = baseAngle;

      const planetMesh = new THREE.Mesh(planetGeom, carbonSteelMaterial);
      planetMesh.position.set(planetOrbitRadius, 0, 0);

      const pinGeom = new THREE.CylinderGeometry(0.5, 0.5, 1.7, 24);
      pinGeom.rotateX(Math.PI / 2);
      const pinMesh = new THREE.Mesh(pinGeom, crimsonSunMaterial);
      planetMesh.add(pinMesh);

      const capGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.2, 16);
      capGeom.rotateX(Math.PI / 2);
      const capMesh = new THREE.Mesh(capGeom, coldSteelMaterial);
      capMesh.position.z = 0.9;
      planetMesh.add(capMesh);

      carrier.add(planetMesh);
      assemblyGroup.add(carrier);

      planets.push({ carrier, mesh: planetMesh, baseAngle });
    }

    // 3. Planetary Spider Arm Carrier (Cold Steel Billet)
    const spiderArmGroup = new THREE.Group();
    for (let s = 0; s < 3; s++) {
      const sAngle = (s * Math.PI * 2) / 3;
      const armGeom = new THREE.BoxGeometry(planetOrbitRadius, 0.8, 0.3);
      armGeom.translate(planetOrbitRadius * 0.5, 0, -0.8);
      const armMesh = new THREE.Mesh(armGeom, coldSteelMaterial);
      armMesh.rotation.z = sAngle;
      spiderArmGroup.add(armMesh);
    }
    assemblyGroup.add(spiderArmGroup);

    // 4. Outer Ring Gear with Interior Teeth (Brushed Carbon Steel)
    const ringTeeth = 36;
    const ringShape = new THREE.Shape();
    ringShape.absarc(0, 0, ringOuterRadius, 0, Math.PI * 2, false);

    const innerHole = new THREE.Path();
    const toothStep = (Math.PI * 2) / ringTeeth;
    const ringToothHeight = 0.7;
    for (let t = 0; t < ringTeeth; t++) {
      const ra = t * toothStep;
      const ra1 = ra + toothStep * 0.3;
      const ra2 = ra + toothStep * 0.7;
      const rRoot = ringInnerRadius;
      const rTip = ringInnerRadius - ringToothHeight;

      if (t === 0) {
        innerHole.moveTo(Math.cos(ra) * rRoot, Math.sin(ra) * rRoot);
      } else {
        innerHole.lineTo(Math.cos(ra) * rRoot, Math.sin(ra) * rRoot);
      }
      innerHole.lineTo(Math.cos(ra1) * rTip, Math.sin(ra1) * rTip);
      innerHole.lineTo(Math.cos(ra2) * rTip, Math.sin(ra2) * rTip);
    }
    innerHole.closePath();
    ringShape.holes.push(innerHole);

    const ringGeom = new THREE.ExtrudeGeometry(ringShape, {
      depth: 1.5,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.1,
      bevelThickness: 0.15,
    });
    ringGeom.center();
    const ringGear = new THREE.Mesh(ringGeom, carbonSteelMaterial);
    assemblyGroup.add(ringGear);

    // Outer Ring Bolt Circle (Anodized Crimson Bolts)
    const boltCircleRadius = ringOuterRadius - 0.5;
    const boltGeom = new THREE.CylinderGeometry(0.16, 0.16, 1.7, 12);
    boltGeom.rotateX(Math.PI / 2);
    for (let b = 0; b < 16; b++) {
      const bAngle = (b * Math.PI * 2) / 16;
      const boltMesh = new THREE.Mesh(boltGeom, crimsonSunMaterial);
      boltMesh.position.set(Math.cos(bAngle) * boltCircleRadius, Math.sin(bAngle) * boltCircleRadius, 0);
      ringGear.add(boltMesh);
    }

    // 5. Turbomachinery Rotor Disk
    const turbomachineryGroup = new THREE.Group();
    turbomachineryGroup.position.z = -2.2;
    assemblyGroup.add(turbomachineryGroup);

    const bladeCount = 12;
    for (let i = 0; i < bladeCount; i++) {
      const angle = (i * Math.PI * 2) / bladeCount;
      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(0, 0);
      bladeShape.lineTo(4.8, 0.85);
      bladeShape.lineTo(5.4, 0.28);
      bladeShape.lineTo(1.3, -0.4);
      bladeShape.closePath();

      const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelSize: 0.05,
        bevelThickness: 0.05,
      });
      const bladeMesh = new THREE.Mesh(bladeGeom, coldSteelMaterial);
      bladeMesh.rotation.z = angle;
      bladeMesh.rotation.x = 0.35;
      turbomachineryGroup.add(bladeMesh);
    }

    // Concentric CAD Coordinate Rings
    const cadRing1 = new THREE.Mesh(new THREE.RingGeometry(9.6, 9.66, 64), hudReticleMaterial);
    cadRing1.position.z = -1.1;
    assemblyGroup.add(cadRing1);

    const cadRing2 = new THREE.Mesh(new THREE.RingGeometry(10.8, 10.84, 48), hudReticleMaterial);
    cadRing2.position.z = -1.9;
    assemblyGroup.add(cadRing2);

    // 6. Laser Splines (Clamped strictly to right hemisphere)
    const splinePoints1 = [
      new THREE.Vector3(7.5, -14, -18),
      new THREE.Vector3(15.0, -6, -8),
      new THREE.Vector3(22.0, 2, 2),
      new THREE.Vector3(18.0, 10, 10),
      new THREE.Vector3(9.5, 16, 16),
    ];
    const curve1 = new THREE.CatmullRomCurve3(splinePoints1);
    const tubeGeom1 = new THREE.TubeGeometry(curve1, 80, 0.032, 8, false);
    const tubeMesh1 = new THREE.Mesh(tubeGeom1, laserSplineMaterial);
    scene.add(tubeMesh1);

    const splinePoints2 = [
      new THREE.Vector3(9.0, -11, 10),
      new THREE.Vector3(17.5, -4, 3),
      new THREE.Vector3(24.0, 4, -4),
      new THREE.Vector3(16.5, 12, -12),
      new THREE.Vector3(8.5, 14, -2),
    ];
    const curve2 = new THREE.CatmullRomCurve3(splinePoints2);
    const tubeGeom2 = new THREE.TubeGeometry(curve2, 80, 0.028, 8, false);
    const tubeMesh2 = new THREE.Mesh(tubeGeom2, laserSplineMaterial);
    scene.add(tubeMesh2);

    const splinePoints3 = [
      new THREE.Vector3(11.0, -15, -10),
      new THREE.Vector3(19.5, -7, 0),
      new THREE.Vector3(26.0, 1, 8),
      new THREE.Vector3(19.0, 9, 14),
      new THREE.Vector3(10.5, 13, 18),
    ];
    const curve3 = new THREE.CatmullRomCurve3(splinePoints3);
    const tubeGeom3 = new THREE.TubeGeometry(curve3, 80, 0.030, 8, false);
    const tubeMesh3 = new THREE.Mesh(tubeGeom3, laserSplineMaterial);
    scene.add(tubeMesh3);

    // =========================================================================
    // Mechanical State Machine & Torque Physics Engine
    // State Machine: IDLE | HOVER | ACCELERATING | DECELERATING
    // =========================================================================
    type GearState = "IDLE" | "HOVER" | "GRABBING";
    let gearState: GearState = "IDLE";

    const BASE_ROT_PER_SEC = 0.035; // ~1.2566 rad/s baseline rotation
    const BASE_RAD_PER_SEC = BASE_ROT_PER_SEC * Math.PI * 2;

    let isPointerOverGear = false;
    let hoverAwareness = 0;
    let currentZOffset = 0;
    let activePointerId: number | null = null;

    // Direct angular manipulation & physical momentum handoff (Req 4 & 23.4)
    let isHoldingGear = false;
    let lastPointerAngle = 0;
    let lastPointerTimestamp = 0;
    let userAngularVelocity = 0;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;
    let lastScrollY = 0;
    let vortexScrollVelocity = 0;

    // Helper: Finite Number Guard
    const sanitizeNumber = (val: number, fallback: number): number => {
      return Number.isFinite(val) ? val : fallback;
    };

    // Projected 2D Hit Testing for the 3D Gear Assembly with Hysteresis
    const tempVec = new THREE.Vector3();
    const checkPointerOverGear = (clientX: number, clientY: number, isEngaged: boolean = false): boolean => {
      if (!camera || !assemblyGroup) return false;
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const ndcX = (clientX / width) * 2 - 1;
      const ndcY = -(clientY / height) * 2 + 1;

      assemblyGroup.getWorldPosition(tempVec);
      const projected = tempVec.clone().project(camera);

      const aspect = width / height;
      const dx = (ndcX - projected.x) * aspect;
      const dy = ndcY - projected.y;
      const dist = Math.hypot(dx, dy);

      // Base disc boundary threshold (~0.88 NDC on desktop, 0.65 on mobile)
      // Generous hysteresis threshold while holding (~1.25x) to maintain torque
      const baseRadius = width > 960 ? 0.88 : 0.65;
      const hitRadius = isEngaged ? baseRadius * 1.35 : baseRadius;
      return dist <= hitRadius;
    };

    // Helper to get screen center of gear assembly
    const getGearScreenCenter = () => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      if (!camera || !assemblyGroup) return { x: width * 0.5, y: height * 0.5 };
      assemblyGroup.getWorldPosition(tempVec);
      const proj = tempVec.clone().project(camera);
      return {
        x: (proj.x + 1) * 0.5 * width,
        y: (-proj.y + 1) * 0.5 * height,
      };
    };

    // Pointer Event Listeners with continuous velocity & direct angular rotation
    const onPointerMove = (e: PointerEvent) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const isTouchOrMobile = e.pointerType === "touch" || width < 768;
      const damp = isTouchOrMobile ? 0.15 : 1.0;
      mouse.targetX = (e.clientX / width - 0.5) * 2 * damp;
      mouse.targetY = -(e.clientY / height - 0.5) * 2 * damp;

      const over = checkPointerOverGear(e.clientX, e.clientY, isHoldingGear);
      isPointerOverGear = over;

      if (isHoldingGear) {
        // Direct manipulation: rotate gear by angular delta from pointer
        const center = getGearScreenCenter();
        const currentAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
        let deltaAngle = currentAngle - lastPointerAngle;
        if (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
        if (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;

        const now = performance.now();
        const dt = Math.max((now - lastPointerTimestamp) * 0.001, 0.001);

        // Impart direct rotation immediately
        sunAngle += deltaAngle;
        orbitAngle += deltaAngle / 3;

        // Smooth angular velocity tracking for release momentum
        const instantOmega = deltaAngle / dt;
        userAngularVelocity = userAngularVelocity * 0.3 + instantOmega * 0.7;

        lastPointerAngle = currentAngle;
        lastPointerTimestamp = now;
      } else {
        gearState = over ? "HOVER" : "IDLE";
      }
    };

    const onCanvasPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      const over = checkPointerOverGear(e.clientX, e.clientY, false);
      if (over) {
        activePointerId = e.pointerId;
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {
          // Defensive
        }
        isHoldingGear = true;
        gearState = "GRABBING";

        const center = getGearScreenCenter();
        lastPointerAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
        lastPointerTimestamp = performance.now();
        // Do NOT reset or halt rotation; preserve current motion naturally
      }
    };

    const releaseTorque = () => {
      if (activePointerId !== null) {
        try {
          if (canvas.hasPointerCapture(activePointerId)) {
            canvas.releasePointerCapture(activePointerId);
          }
        } catch {
          // Defensive
        }
        activePointerId = null;
      }
      isHoldingGear = false;
      gearState = isPointerOverGear ? "HOVER" : "IDLE";
    };

    const onPointerUp = (e: PointerEvent) => {
      if (activePointerId === null || e.pointerId === activePointerId) {
        releaseTorque();
      }
    };

    const onPointerCancel = (e: PointerEvent) => {
      onPointerUp(e);
    };

    const onCanvasPointerLeave = () => {
      if (!isHoldingGear) {
        isPointerOverGear = false;
        gearState = "IDLE";
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerCancel, { passive: true });
    canvas.addEventListener("pointerdown", onCanvasPointerDown, { passive: true });
    canvas.addEventListener("pointerleave", onCanvasPointerLeave, { passive: true });

    const onScroll = () => {
      scrollY = window.scrollY || 0;
      const scrollDelta = Math.abs(scrollY - lastScrollY);
      vortexScrollVelocity += Math.min(scrollDelta * 0.0015, 0.05);
      lastScrollY = scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Kinematic Motion Parameters
    let sunAngle = 0;
    let orbitAngle = 0;
    let lastTime = performance.now();

    // =========================================================================
    // Authoritative Single 60 FPS Mechanical Physics Loop
    // =========================================================================
    const animate = (currentTime: number) => {
      if (!isRunning) return;

      // Safe Delta Time with NaN & zero guards
      const validCurrentTime = Number.isFinite(currentTime) && currentTime > 0 ? currentTime : performance.now();
      const rawDelta = (validCurrentTime - lastTime) * 0.001;
      const delta = Number.isFinite(rawDelta) && rawDelta > 0 ? Math.min(rawDelta, 0.1) : 0.016;
      lastTime = validCurrentTime;

      // Mouse smoothing
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Scroll Velocity Decay
      vortexScrollVelocity *= 0.94;
      if (!Number.isFinite(vortexScrollVelocity)) vortexScrollVelocity = 0;

      // Hover Awareness Smooth Interpolation
      const targetAwareness = isPointerOverGear || isHoldingGear ? 1.0 : 0.0;
      hoverAwareness += (targetAwareness - hoverAwareness) * 0.08;
      hoverAwareness = sanitizeNumber(hoverAwareness, 0);

      // Natural baseline continuous motion + User momentum (Req 4: never slows down when held)
      const baseDeltaAngle = BASE_RAD_PER_SEC * delta;

      // Decay any user flick/spin velocity smoothly with physical damping
      if (!isHoldingGear && Math.abs(userAngularVelocity) > 0.01) {
        sunAngle += userAngularVelocity * delta;
        orbitAngle += (userAngularVelocity / 3) * delta;
        userAngularVelocity = THREE.MathUtils.damp(userAngularVelocity, 0, 2.5, delta);
      }

      // Continuous baseline mechanical progression: holding keeps it moving forward naturally!
      const effectiveOmega = baseDeltaAngle + (vortexScrollVelocity * 0.08);
      sunAngle += sanitizeNumber(effectiveOmega, baseDeltaAngle);
      orbitAngle += sanitizeNumber(effectiveOmega / 3, baseDeltaAngle / 3);

      // Prevent angle overflow over long uptime
      if (Math.abs(sunAngle) > 100000) sunAngle = sunAngle % (Math.PI * 2);
      if (Math.abs(orbitAngle) > 100000) orbitAngle = orbitAngle % (Math.PI * 2);

      // 1. Central Sun Gear rotates clockwise
      sunGear.rotation.z = sunAngle;

      // 2. Planetary spider arm carrier rotates at 1/3 speed
      spiderArmGroup.rotation.z = orbitAngle;

      // 3. Planet gears counter-rotate opposite to sun gear
      planets.forEach((p) => {
        p.carrier.rotation.z = orbitAngle + p.baseAngle;
        p.mesh.rotation.z = -sunAngle * 2.5;
      });

      // 4. Outer Ring Gear counter-rotates slowly
      ringGear.rotation.z = -orbitAngle * 0.25;

      // 5. Impeller turbomachinery & CAD rings
      turbomachineryGroup.rotation.z = sunAngle * 0.6;
      cadRing1.rotation.z = -sunAngle * 0.15;
      cadRing2.rotation.z = sunAngle * 0.1;

      // Mechanical Parallax & Torque Vibration
      const parallaxFactor = 1.0 + hoverAwareness * 0.45;
      const torqueVibration = isHoldingGear
        ? Math.sin(validCurrentTime * 0.05) * 0.005
        : 0;

      const targetRotX = baseTiltX + (mouse.y * 0.14 * parallaxFactor) + torqueVibration;
      const targetRotY = baseTiltY + (mouse.x * 0.16 * parallaxFactor);

      assemblyGroup.rotation.x = sanitizeNumber(targetRotX, baseTiltX);
      assemblyGroup.rotation.y = sanitizeNumber(targetRotY, baseTiltY);
      assemblyGroup.rotation.z = baseTiltZ;

      // Subtle mechanical axial step forward when hovered / accelerated
      const targetZOffset = isHoldingGear ? 0.45 : (hoverAwareness * 0.25);
      currentZOffset = THREE.MathUtils.lerp(currentZOffset, targetZOffset, 0.08);

      // Maintain separate base position + axial offset
      assemblyGroup.position.x = basePosX;
      assemblyGroup.position.y = basePosY;
      assemblyGroup.position.z = basePosZ + sanitizeNumber(currentZOffset, 0);
      assemblyGroup.scale.set(baseScale, baseScale, baseScale);

      // Dynamic Camera Clamping based on Aspect Ratio
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const currentAspect = width / height;
      const baseZ = currentAspect < 1.4 ? 32 : 28;

      const scrollFactor = Math.min(Math.max((window.scrollY || 0) / 800, 0), 1.0);
      const targetCameraZ = baseZ - scrollFactor * 6;
      const targetPitch = scrollFactor * (12 * (Math.PI / 180));

      const newCamZ = THREE.MathUtils.lerp(camera.position.z, targetCameraZ, 0.08);
      const newCamX = THREE.MathUtils.lerp(camera.position.x, mouse.x * 2.5, 0.05);
      const newCamY = THREE.MathUtils.lerp(camera.position.y, mouse.y * 1.8 + scrollFactor * 1.8, 0.05);

      camera.position.z = sanitizeNumber(newCamZ, baseZ);
      camera.position.x = sanitizeNumber(newCamX, 0);
      camera.position.y = sanitizeNumber(newCamY, 0);

      const newRotX = THREE.MathUtils.lerp(camera.rotation.x, targetPitch + mouse.y * 0.04, 0.05);
      const newRotY = THREE.MathUtils.lerp(camera.rotation.y, -mouse.x * 0.06, 0.05);

      camera.rotation.x = sanitizeNumber(newRotX, 0);
      camera.rotation.y = sanitizeNumber(newRotY, 0);

      // Guaranteed Visible Render
      assemblyGroup.visible = true;
      sunGear.visible = true;
      ringGear.visible = true;
      spiderArmGroup.visible = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Dynamic Resize Listener
    const handleResize = () => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const aspect = width / height;
      camera.aspect = aspect;
      camera.position.z = aspect < 1.4 ? 32 : 28;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateAssemblyPosition();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("pointerdown", onCanvasPointerDown);
      canvas.removeEventListener("pointerleave", onCanvasPointerLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#080808",
        touchAction: "pan-y",
        display: "block",
        visibility: "visible",
        opacity: 1,
        backgroundImage: `
          radial-gradient(circle at 75% 35%, rgba(204, 17, 17, 0.14) 0%, rgba(99, 8, 8, 0.08) 42%, transparent 70%),
          radial-gradient(circle at 88% 18%, rgba(255, 59, 59, 0.06) 0%, transparent 40%),
          linear-gradient(135deg, #080808 0%, #0d0d0d 50%, #080808 100%)
        `,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          visibility: "visible",
          opacity: 1,
          pointerEvents: "auto",
          touchAction: "pan-y",
        }}
      />
    </div>
  );
}
