"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let isRunning = true;
    let animationFrameId: number;

    // Scene & Atmospheric Fog Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.016);

    const initialAspect = window.innerWidth / window.innerHeight;
    const initialZ = initialAspect < 1.4 ? 32 : 28;

    const camera = new THREE.PerspectiveCamera(
      40,
      initialAspect,
      0.1,
      250
    );
    camera.position.set(0, 0, initialZ);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x080808, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    // High-contrast directional key light (cold white)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(12, 18, 15);
    scene.add(keyLight);

    // Surgical Crimson rim backlight from rear-bottom
    const crimsonRimLight = new THREE.DirectionalLight(0xff2222, 4.0);
    crimsonRimLight.position.set(-15, -10, -10);
    scene.add(crimsonRimLight);

    // Secondary cold steel fill light
    const steelFillLight = new THREE.DirectionalLight(0xcfd8dc, 1.5);
    steelFillLight.position.set(25, -12, 10);
    scene.add(steelFillLight);

    // Assembly Master Group (Holds all kinematic elements)
    const assemblyGroup = new THREE.Group();
    scene.add(assemblyGroup);

    // Base Isometric Tilt (Reveals teeth depth, chamfers, and gear extrusion)
    const baseTiltX = 0.18;
    const baseTiltY = -0.32;
    const baseTiltZ = 0.08;
    assemblyGroup.rotation.set(baseTiltX, baseTiltY, baseTiltZ);

    // Assembly Positioning: Anchor to the right hemisphere on desktop, clear of typography
    const updateAssemblyPosition = () => {
      if (window.innerWidth > 960) {
        // Desktop: Scaled down by ~15% (scale: 0.85) and anchored at X = 12.8, giving headline dominant breathing room
        assemblyGroup.position.set(12.8, 0.4, 0);
        assemblyGroup.scale.set(0.85, 0.85, 0.85);
      } else {
        // Mobile / Small Tablet (scaled down to 0.54)
        assemblyGroup.position.set(0, 3.0, -4);
        assemblyGroup.scale.set(0.54, 0.54, 0.54);
      }
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

      // Sharp tooth chamfer: 3 bevel segments, 0.1 size, 0.15 thickness
      return new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.1,
        bevelThickness: 0.15,
      });
    };

    // Scaled-down gear dimensions (outer ring gear radius scaled down to 8.8)
    const sunPitchRadius = 3.0;
    const sunTeeth = 18;
    const planetPitchRadius = 2.0;
    const planetTeeth = 12;
    const planetOrbitRadius = sunPitchRadius + planetPitchRadius; // 5.0 units
    const ringInnerRadius = planetOrbitRadius + planetPitchRadius; // 7.0 units
    const ringOuterRadius = 8.8; // Exact 8.8 radius requested

    // 1. Central Sun Gear (Anodized Crimson Aluminum)
    const sunGeom = createSpurGearGeometry(sunPitchRadius, sunTeeth, 0.85, 1.35, 1.3, 4);
    sunGeom.center();
    const sunGear = new THREE.Mesh(sunGeom, crimsonSunMaterial);
    assemblyGroup.add(sunGear);

    // Hollow Hub Bearing Assembly (Replaces solid sticker with precision bearing race)
    const hubGroup = new THREE.Group();
    sunGear.add(hubGroup);

    // Outer bearing steel collar
    const outerCollarGeom = new THREE.TorusGeometry(1.3, 0.14, 16, 32);
    const outerCollar = new THREE.Mesh(outerCollarGeom, coldSteelMaterial);
    hubGroup.add(outerCollar);

    // Inner keyed axle sleeve
    const innerSleeveGeom = new THREE.TorusGeometry(0.75, 0.11, 16, 32);
    const innerSleeve = new THREE.Mesh(innerSleeveGeom, coldSteelMaterial);
    hubGroup.add(innerSleeve);

    // 8 Chrome Ball Bearings arranged in a circle
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

      // Planet Center Pin Axle (Crimson Anodized)
      const pinGeom = new THREE.CylinderGeometry(0.5, 0.5, 1.7, 24);
      pinGeom.rotateX(Math.PI / 2);
      const pinMesh = new THREE.Mesh(pinGeom, crimsonSunMaterial);
      planetMesh.add(pinMesh);

      // Axle retaining bolt (Cold steel)
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

    // 5. Turbomachinery Rotor Disk (Cold Steel Impeller Blades Behind Assembly)
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

    // Concentric CAD Coordinate Rings (HUD Reticle Lines in Glowing Crimson)
    const cadRing1 = new THREE.Mesh(new THREE.RingGeometry(9.6, 9.66, 64), hudReticleMaterial);
    cadRing1.position.z = -1.1;
    assemblyGroup.add(cadRing1);

    const cadRing2 = new THREE.Mesh(new THREE.RingGeometry(10.8, 10.84, 48), hudReticleMaterial);
    cadRing2.position.z = -1.9;
    assemblyGroup.add(cadRing2);

    // 6. Laser Splines: CLAMPED STRICTLY TO RIGHT HEMISPHERE (X > 6, X < 32)
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

    // Interaction & Scroll Physics
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;
    let lastScrollY = 0;
    let vortexScrollVelocity = 0;

    const onPointerMove = (e: PointerEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove);

    const onScroll = () => {
      scrollY = window.scrollY;
      const scrollDelta = Math.abs(scrollY - lastScrollY);
      vortexScrollVelocity += Math.min(scrollDelta * 0.0015, 0.05);
      lastScrollY = scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Kinematic Motion Parameters
    const baseOmega = 0.011;
    let sunAngle = 0;
    let orbitAngle = 0;
    let lastTime = performance.now();

    // 60 FPS Animation Loop
    const animate = (currentTime: number) => {
      if (!isRunning) return;
      const delta = Math.min((currentTime - lastTime) * 0.001, 0.1);
      lastTime = currentTime;

      // Mouse smoothing
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Scroll Velocity Decay (0.94 decay factor)
      vortexScrollVelocity *= 0.94;
      const effectiveOmega = baseOmega + vortexScrollVelocity * 0.08;

      // Kinematic Rotations
      sunAngle += effectiveOmega;
      sunGear.rotation.z = sunAngle;

      orbitAngle += effectiveOmega / 3;
      spiderArmGroup.rotation.z = orbitAngle;

      planets.forEach((p) => {
        p.carrier.rotation.z = orbitAngle + p.baseAngle;
        p.mesh.rotation.z = -sunAngle * 2.5;
      });

      ringGear.rotation.z = -orbitAngle * 0.25;
      turbomachineryGroup.rotation.z = sunAngle * 0.6;
      cadRing1.rotation.z = -sunAngle * 0.15;
      cadRing2.rotation.z = sunAngle * 0.1;

      // Subtle isometric depth modulation with mouse
      assemblyGroup.rotation.x = baseTiltX + mouse.y * 0.14;
      assemblyGroup.rotation.y = baseTiltY + mouse.x * 0.16;
      assemblyGroup.rotation.z = baseTiltZ;

      // Dynamic Camera Clamping based on Aspect Ratio
      const currentAspect = window.innerWidth / window.innerHeight;
      const baseZ = currentAspect < 1.4 ? 32 : 28;

      // Smooth Camera Dolly along Z-axis (baseZ -> baseZ - 6 over first 800px)
      const scrollFactor = Math.min(Math.max(scrollY / 800, 0), 1.0);
      const targetCameraZ = baseZ - scrollFactor * 6;
      const targetPitch = scrollFactor * (12 * (Math.PI / 180));

      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCameraZ, 0.08);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 2.5, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 1.8 + scrollFactor * 1.8, 0.05);

      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetPitch + mouse.y * 0.04, 0.05);
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -mouse.x * 0.06, 0.05);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Dynamic Resize Clamping Listener
    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      camera.aspect = aspect;
      camera.position.z = aspect < 1.4 ? 32 : 28;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      updateAssemblyPosition();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", onPointerMove);
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
          pointerEvents: "auto",
        }}
      />
    </div>
  );
}
