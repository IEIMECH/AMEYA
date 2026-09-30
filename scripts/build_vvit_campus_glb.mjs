import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

// Polyfill FileReader for headless Node.js
global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
};

console.log("Building VVIT Central Complex 3D Model (Focused 6-Building Architecture)...");

const scene = new THREE.Scene();
scene.name = "VVIT_Central_Complex_Scene";

// =========================================================================
// 1. MATERIALS (Architectural Visualization Palette)
// =========================================================================
const matBrick = new THREE.MeshStandardMaterial({
  color: 0xb54334, // Terracotta red brick
  roughness: 0.65,
  metalness: 0.05,
  name: "Mat_Terracotta_Brick"
});

const matWhiteTrim = new THREE.MeshStandardMaterial({
  color: 0xf5f2eb, // Clean architectural off-white
  roughness: 0.45,
  metalness: 0.05,
  name: "Mat_White_Trim"
});

const matConcrete = new THREE.MeshStandardMaterial({
  color: 0xd8d3cb,
  roughness: 0.6,
  metalness: 0.08,
  name: "Mat_Concrete_Beige"
});

const matGlass = new THREE.MeshStandardMaterial({
  color: 0x1e293b,
  roughness: 0.1,
  metalness: 0.85,
  transparent: true,
  opacity: 0.75,
  name: "Mat_Tinted_Glass"
});

const matSolar = new THREE.MeshStandardMaterial({
  color: 0x172554, // Deep blue photovoltaic
  roughness: 0.25,
  metalness: 0.8,
  name: "Mat_Solar_Panel"
});

const matRoofDark = new THREE.MeshStandardMaterial({
  color: 0x2b2b2e,
  roughness: 0.85,
  metalness: 0.15,
  name: "Mat_Roof_Gravel"
});

const matLawn = new THREE.MeshStandardMaterial({
  color: 0x244a2b, // Lush manicured grass
  roughness: 0.9,
  metalness: 0.0,
  name: "Mat_Campus_Lawn"
});

const matRoad = new THREE.MeshStandardMaterial({
  color: 0x1e1e24, // Deep charcoal asphalt
  roughness: 0.8,
  metalness: 0.1,
  name: "Mat_Asphalt_Road"
});

const matPavement = new THREE.MeshStandardMaterial({
  color: 0x38383e,
  roughness: 0.75,
  metalness: 0.1,
  name: "Mat_Pedestrian_Pavement"
});

const matPlaza = new THREE.MeshStandardMaterial({
  color: 0x4a4a52,
  roughness: 0.7,
  metalness: 0.12,
  name: "Mat_Entrance_Plaza"
});

const matTreeTrunk = new THREE.MeshStandardMaterial({
  color: 0x422817,
  roughness: 0.9,
  name: "Mat_Tree_Trunk"
});

const matTreeLeaves = new THREE.MeshStandardMaterial({
  color: 0x1d4722,
  roughness: 0.85,
  name: "Mat_Tree_Leaves"
});

// Helper: Box Mesh
function createBox(w, h, d, material, name = "") {
  const geom = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geom, material);
  if (name) mesh.name = name;
  return mesh;
}

// Helper: Cylinder Mesh
function createCylinder(rTop, rBot, h, segs, material, name = "") {
  const geom = new THREE.CylinderGeometry(rTop, rBot, h, segs);
  const mesh = new THREE.Mesh(geom, material);
  if (name) mesh.name = name;
  return mesh;
}

// Helper: Stylized low-poly tree
function createTree(x, z, scale = 1) {
  const tree = new THREE.Group();
  tree.name = `Tree_${Math.round(x)}_${Math.round(z)}`;
  
  const trunk = createCylinder(0.25 * scale, 0.35 * scale, 2.2 * scale, 6, matTreeTrunk, "Trunk");
  trunk.position.y = 1.1 * scale;
  tree.add(trunk);
  
  const foliage1 = createCylinder(0, 1.6 * scale, 2.2 * scale, 7, matTreeLeaves, "Foliage_1");
  foliage1.position.y = 2.6 * scale;
  tree.add(foliage1);
  
  const foliage2 = createCylinder(0, 1.2 * scale, 1.9 * scale, 7, matTreeLeaves, "Foliage_2");
  foliage2.position.y = 3.6 * scale;
  tree.add(foliage2);

  const foliage3 = createCylinder(0, 0.7 * scale, 1.5 * scale, 6, matTreeLeaves, "Foliage_3");
  foliage3.position.y = 4.4 * scale;
  tree.add(foliage3);

  tree.position.set(x, 0, z);
  return tree;
}

// Helper: Solar panel array
function createSolarArray(w, d, angleDeg = 15) {
  const group = new THREE.Group();
  group.name = "Solar_Array";
  const numPanels = Math.max(2, Math.floor(d / 1.8));
  for (let i = 0; i < numPanels; i++) {
    const panel = createBox(w, 0.08, 1.4, matSolar, `Solar_Row_${i}`);
    panel.position.set(0, 0.35, (i - (numPanels - 1) / 2) * 1.8);
    panel.rotation.x = (angleDeg * Math.PI) / 180;
    group.add(panel);
    
    const leg1 = createBox(0.1, 0.6, 0.1, matRoofDark);
    leg1.position.set(-w * 0.45, 0.15, panel.position.z);
    group.add(leg1);
    const leg2 = createBox(0.1, 0.6, 0.1, matRoofDark);
    leg2.position.set(w * 0.45, 0.15, panel.position.z);
    group.add(leg2);
  }
  return group;
}

// =========================================================================
// 2. CENTRAL COMPLEX TERRAIN PLINTH & PLAZA
// =========================================================================
const campusGround = new THREE.Group();
campusGround.name = "CAMPUS_GROUND";

// Base terrain plinth (150m x 170m) sized precisely for the 6 buildings
const groundMesh = createBox(150, 1.5, 170, new THREE.MeshStandardMaterial({
  color: 0x121215,
  roughness: 0.95
}), "Base_Terrain");
groundMesh.position.y = -0.75;
groundMesh.position.z = -15;
campusGround.add(groundMesh);

// Central manicured lawn (120m x 140m)
const centralLawn = createBox(130, 0.1, 150, matLawn, "Central_Complex_Lawn");
centralLawn.position.set(0, 0.05, -15);
campusGround.add(centralLawn);

// Grand Entrance Plaza between Central Block and H-Block (from z = -16 to z = -48)
const entrancePlaza = createBox(46, 0.16, 32, matPlaza, "Entrance_Plaza");
entrancePlaza.position.set(0, 0.08, -36);
campusGround.add(entrancePlaza);

// Peripheral loop road
const northRoad = createBox(110, 0.15, 10, matRoad, "North_Road");
northRoad.position.set(0, 0.08, -75);
campusGround.add(northRoad);

const southRoad = createBox(110, 0.15, 10, matRoad, "South_Road");
southRoad.position.set(0, 0.08, 48);
campusGround.add(southRoad);

const westRoad = createBox(10, 0.15, 130, matRoad, "West_Road");
westRoad.position.set(-60, 0.08, -14);
campusGround.add(westRoad);

const eastRoad = createBox(10, 0.15, 130, matRoad, "East_Road");
eastRoad.position.set(60, 0.08, -14);
campusGround.add(eastRoad);

// Courtyard paved crossways linking Central Block to LF blocks
const quadPathNS = createBox(7, 0.18, 70, matPavement, "Quad_Path_NS");
quadPathNS.position.set(0, 0.1, 8);
campusGround.add(quadPathNS);

const quadPathEW = createBox(76, 0.18, 7, matPavement, "Quad_Path_EW");
quadPathEW.position.set(0, 0.1, 0);
campusGround.add(quadPathEW);

scene.add(campusGround);

// =========================================================================
// 3. CENTRAL BLOCK (Exact Square Geometry, 4 Stories)
// =========================================================================
const centralBlock = new THREE.Group();
centralBlock.name = "CENTRAL_BLOCK";
centralBlock.userData = {
  buildingId: "CENTRAL_BLOCK",
  name: "Central Block & Main Auditorium",
  zone: "Central Academic Complex",
  floors: 4,
  description: "Square administrative and central plenary complex. Houses the VVIT Main Plenary Auditorium, Vice-Chancellor chambers, central library, and inaugural arenas.",
  capacity: "800 Seats",
  events: "Inaugural Ceremony, Keynote Plenary, Valedictory Gala"
};

const CB_SIZE = 32;
const CB_FLOOR_H = 4.2;

for (let f = 0; f < 4; f++) {
  const floorGroup = new THREE.Group();
  floorGroup.name = `Floor_${f}`;
  const y = f * CB_FLOOR_H + CB_FLOOR_H / 2;
  
  // Core brick block
  const core = createBox(CB_SIZE, CB_FLOOR_H - 0.4, CB_SIZE, matBrick, `Core_F${f}`);
  core.position.y = y;
  floorGroup.add(core);

  // Floor slab / white cornice band
  const slab = createBox(CB_SIZE + 0.8, 0.4, CB_SIZE + 0.8, matWhiteTrim, `Slab_F${f}`);
  slab.position.y = f * CB_FLOOR_H + 0.2;
  floorGroup.add(slab);

  // Window bands on East & West facades
  const winEast = createBox(0.4, CB_FLOOR_H * 0.45, CB_SIZE * 0.75, matGlass, `Win_East_F${f}`);
  winEast.position.set(CB_SIZE / 2 + 0.1, y, 0);
  floorGroup.add(winEast);

  const winWest = createBox(0.4, CB_FLOOR_H * 0.45, CB_SIZE * 0.75, matGlass, `Win_West_F${f}`);
  winWest.position.set(-CB_SIZE / 2 - 0.1, y, 0);
  floorGroup.add(winWest);

  // South facade (+Z) window bands
  const winSouth = createBox(CB_SIZE * 0.75, CB_FLOOR_H * 0.45, 0.4, matGlass, `Win_South_F${f}`);
  winSouth.position.set(0, y, CB_SIZE / 2 + 0.1);
  floorGroup.add(winSouth);

  // North facade (-Z) upper floor windows flanking the entrance portal
  if (f >= 1) {
    const curtainLeft = createBox(CB_SIZE * 0.26, CB_FLOOR_H * 0.65, 0.4, matGlass, `Glass_N_Left_F${f}`);
    curtainLeft.position.set(-CB_SIZE * 0.3, y, -CB_SIZE / 2 - 0.1);
    floorGroup.add(curtainLeft);

    const curtainRight = createBox(CB_SIZE * 0.26, CB_FLOOR_H * 0.65, 0.4, matGlass, `Glass_N_Right_F${f}`);
    curtainRight.position.set(CB_SIZE * 0.3, y, -CB_SIZE / 2 - 0.1);
    floorGroup.add(curtainRight);
  }

  centralBlock.add(floorGroup);
}

// Rooftop parapet & skylight
const cbRoof = new THREE.Group();
cbRoof.name = "Roof_Structure";
const roofBase = createBox(CB_SIZE + 0.4, 0.9, CB_SIZE + 0.4, matRoofDark, "Roof_Slab");
roofBase.position.y = 4 * CB_FLOOR_H + 0.45;
cbRoof.add(roofBase);

// Curved white canopy / vaulted skylight structure
const skylightGeom = new THREE.CylinderGeometry(5.5, 5.5, 14, 16, 1, false, 0, Math.PI);
const skylight = new THREE.Mesh(skylightGeom, matWhiteTrim);
skylight.rotation.z = Math.PI / 2;
skylight.rotation.y = Math.PI / 2;
skylight.position.set(0, 4 * CB_FLOOR_H + 0.9, 0);
cbRoof.add(skylight);

// White penthouse elevator room
const penthouse = createBox(8, 3.2, 8, matWhiteTrim, "Elevator_Penthouse");
penthouse.position.set(6, 4 * CB_FLOOR_H + 2.5, 6);
cbRoof.add(penthouse);

centralBlock.add(cbRoof);

// MAIN ENTRANCE PORTAL on North Facade (-Z) facing H - BLOCK!
const portal = new THREE.Group();
portal.name = "Central_Main_Entrance";

// Portico monumental white frame
const portalPillars = createBox(11, 11, 3.2, matWhiteTrim, "Portal_Frame");
portalPillars.position.set(0, 5.5, -CB_SIZE / 2 - 1.6);
portal.add(portalPillars);

const portalGlass = createBox(7, 8, 3.4, matGlass, "Portal_Glass");
portalGlass.position.set(0, 4.5, -CB_SIZE / 2 - 1.65);
portal.add(portalGlass);

// Entrance stair steps descending to the entrance plaza towards H - Block
for (let s = 0; s < 4; s++) {
  const step = createBox(13 - s * 0.8, 0.25, 1.2, matConcrete, `Step_${s}`);
  step.position.set(0, 0.125 + s * 0.25, -CB_SIZE / 2 - 3.6 - s * 0.8);
  portal.add(step);
}

centralBlock.add(portal);
centralBlock.position.set(0, 0, 0);
scene.add(centralBlock);

// =========================================================================
// 4. H - BLOCK (Directly Opposite Central Block's Main Entrance)
// =========================================================================
const hBlock = new THREE.Group();
hBlock.name = "H_BLOCK";
hBlock.userData = {
  buildingId: "H_BLOCK",
  name: "H - BLOCK",
  zone: "Northern Academic & Services Sector",
  floors: 3,
  description: "Northern academic and student services block directly opposite Central Block's main entrance. Features open event halls, hospitality suites, and curved roof canopy.",
  capacity: "500 Occupants",
  events: "Technical Registration, Help Desk, Refreshment Concourse"
};

const HB_W = 52;
const HB_D = 20;
const HB_H = 13.5;

// Main 3-story core
const hbCore = createBox(HB_W, HB_H, HB_D, matBrick, "H_Block_Core");
hbCore.position.set(0, HB_H / 2, 0);
hBlock.add(hbCore);

// Horizontal white cornice slabs per floor
for (let f = 0; f <= 3; f++) {
  const slab = createBox(HB_W + 0.6, 0.4, HB_D + 0.6, matWhiteTrim, `HB_Slab_${f}`);
  slab.position.set(0, f * 4.2 + 0.2, 0);
  hBlock.add(slab);
}

// Curved white roof canopy
const hbRoofGeom = new THREE.CylinderGeometry(HB_D * 0.52, HB_D * 0.52, HB_W * 0.95, 16, 1, false, 0, Math.PI);
const hbCanopy = new THREE.Mesh(hbRoofGeom, matWhiteTrim);
hbCanopy.rotation.z = Math.PI / 2;
hbCanopy.position.set(0, HB_H, 0);
hBlock.add(hbCanopy);

// Continuous ribbon windows across floors
for (let f = 0; f < 3; f++) {
  const winNorth = createBox(HB_W * 0.85, 1.4, 0.4, matGlass, `HB_WinN_F${f}`);
  winNorth.position.set(0, 2.5 + f * 4.2, -HB_D / 2 - 0.2);
  hBlock.add(winNorth);

  const winSouth = createBox(HB_W * 0.85, 1.4, 0.4, matGlass, `HB_WinS_F${f}`);
  winSouth.position.set(0, 2.5 + f * 4.2, HB_D / 2 + 0.2);
  hBlock.add(winSouth);
}

// Front entrance portico facing Central Block across the entrance plaza
const hbPortico = createBox(10, 6, 3, matWhiteTrim, "HB_Portico");
hbPortico.position.set(0, 3, HB_D / 2 + 1.5);
hBlock.add(hbPortico);

// Position H - BLOCK directly opposite Central Block's Main Entrance (z = -58)
hBlock.position.set(0, 0, -58);
scene.add(hBlock);

// =========================================================================
// 5. FOUR L-SHAPED BUILDINGS (LF 1, LF 2, LF 3, LF 4)
//    WITH OUTWARD-FACING L-GEOMETRY
// =========================================================================
// Each LF building is an L-shaped structure:
// Wing A (Long arm): length 36m, width 13m, height 16.8m (4 stories)
// Wing B (Short arm): length 24m, width 13m, height 16.8m (4 stories)
// In local coordinates:
// Corner elbow is at (0, 0).
// Wing A extends along +X, Wing B extends along +Z.
// The open / concave side faces (+X, +Z).
// By rotating each LF building, its open side faces OUTWARD into the world,
// while its elbow points inward towards the Central Block.

function createLFBuilding(id, name, posX, posZ, rotYDeg) {
  const lf = new THREE.Group();
  lf.name = id;
  lf.userData = {
    buildingId: id,
    name: name,
    zone: "Central Academic Quadrant",
    floors: 4,
    description: "4-Story L-shaped academic block with outward-facing wings. Features smart lecture halls, departmental laboratories, and rooftop solar microgrid arrays.",
    capacity: "600 Students",
    events: "Technical Paper Presentation, PPT Championships, CAD Arenas"
  };

  const WING_A_L = 36;
  const WING_W = 13;
  const WING_B_L = 24;
  const FLOOR_H = 4.2;

  for (let f = 0; f < 4; f++) {
    const floorGroup = new THREE.Group();
    floorGroup.name = `Floor_${f}`;
    const y = f * FLOOR_H + FLOOR_H / 2;

    // Wing A: Extends along +X from elbow (0, 0) to (WING_A_L, 0)
    const wingA = createBox(WING_A_L, FLOOR_H - 0.4, WING_W, matBrick, `WingA_F${f}`);
    wingA.position.set(WING_A_L / 2, y, 0);
    floorGroup.add(wingA);

    // Wing B: Extends along +Z from elbow (0, 0) to (0, WING_B_L)
    const wingB = createBox(WING_W, FLOOR_H - 0.4, WING_B_L, matBrick, `WingB_F${f}`);
    wingB.position.set(0, y, WING_B_L / 2);
    floorGroup.add(wingB);

    // Continuous white floor slabs
    const slabA = createBox(WING_A_L + 0.6, 0.4, WING_W + 0.6, matWhiteTrim, `SlabA_F${f}`);
    slabA.position.set(WING_A_L / 2, f * FLOOR_H + 0.2, 0);
    floorGroup.add(slabA);

    const slabB = createBox(WING_W + 0.6, 0.4, WING_B_L + 0.6, matWhiteTrim, `SlabB_F${f}`);
    slabB.position.set(0, f * FLOOR_H + 0.2, WING_B_L / 2);
    floorGroup.add(slabB);

    // Courtyard open balconies along the inner elbow
    const balconyA = createBox(WING_A_L - WING_W, FLOOR_H * 0.35, 1.2, matWhiteTrim, `BalconyA_F${f}`);
    balconyA.position.set(WING_A_L / 2 + WING_W / 4, y - FLOOR_H * 0.2, WING_W / 2 + 0.6);
    floorGroup.add(balconyA);

    // Outer windows
    const winA = createBox(WING_A_L * 0.75, FLOOR_H * 0.45, 0.3, matGlass, `WinA_F${f}`);
    winA.position.set(WING_A_L / 2, y, -WING_W / 2 - 0.15);
    floorGroup.add(winA);

    const winB = createBox(0.3, FLOOR_H * 0.45, WING_B_L * 0.75, matGlass, `WinB_F${f}`);
    winB.position.set(-WING_W / 2 - 0.15, y, WING_B_L / 2);
    floorGroup.add(winB);

    lf.add(floorGroup);
  }

  // Rooftop slabs & solar arrays
  const roof = new THREE.Group();
  roof.name = "Roof_Structure";
  const rY = 4 * FLOOR_H + 0.35;

  const roofSlabA = createBox(WING_A_L + 0.4, 0.7, WING_W + 0.4, matRoofDark, "Roof_SlabA");
  roofSlabA.position.set(WING_A_L / 2, rY, 0);
  roof.add(roofSlabA);

  const roofSlabB = createBox(WING_W + 0.4, 0.7, WING_B_L + 0.4, matRoofDark, "Roof_SlabB");
  roofSlabB.position.set(0, rY, WING_B_L / 2);
  roof.add(roofSlabB);

  // Solar arrays on Wing A and Wing B
  const solarsA = createSolarArray(WING_A_L * 0.65, WING_W * 0.6, 18);
  solarsA.position.set(WING_A_L / 2, rY + 0.35, 0);
  roof.add(solarsA);

  const solarsB = createSolarArray(WING_W * 0.6, WING_B_L * 0.65, 18);
  solarsB.position.set(0, rY + 0.35, WING_B_L / 2);
  solarsB.rotation.y = Math.PI / 2;
  roof.add(solarsB);

  // Stair tower at corner elbow
  const stairTower = createBox(WING_W * 0.6, 4 * FLOOR_H + 3.8, WING_W * 0.6, matWhiteTrim, "Stair_Tower");
  stairTower.position.set(0, (4 * FLOOR_H + 3.8) / 2, 0);
  roof.add(stairTower);

  lf.add(roof);

  // Rotation and placement
  lf.rotation.y = (rotYDeg * Math.PI) / 180;
  lf.position.set(posX, 0, posZ);

  return lf;
}

// -------------------------------------------------------------------------
// Four Outward-Oriented LF Buildings:
//
// LF 1: Top-Right (Northeast) -> Elbow at inner corner, open side faces NORTHEAST (+X, -Z)
// LF 2: Top-Left (Northwest)  -> Elbow at inner corner, open side faces NORTHWEST (-X, -Z)
// LF 3: Bottom-Left (Southwest)-> Elbow at inner corner, open side faces SOUTHWEST (-X, +Z)
// LF 4: Bottom-Right (Southeast)-> Elbow at inner corner, open side faces SOUTHEAST (+X, +Z)
// -------------------------------------------------------------------------

// LF 1 (Northeast): rotY = 90 deg -> open side faces Northeast
const lf1 = createLFBuilding("LF_1", "LF 1 — Academic Block", 28, -22, 90);
scene.add(lf1);

// LF 2 (Northwest): rotY = 180 deg -> open side faces Northwest
const lf2 = createLFBuilding("LF_2", "LF 2 — Academic Block", -28, -22, 180);
scene.add(lf2);

// LF 3 (Southwest): rotY = 270 deg -> open side faces Southwest
const lf3 = createLFBuilding("LF_3", "LF 3 — Academic Block", -28, 22, 270);
scene.add(lf3);

// LF 4 (Southeast): rotY = 0 deg -> open side faces Southeast
const lf4 = createLFBuilding("LF_4", "LF 4 — Academic Block", 28, 22, 0);
scene.add(lf4);

// =========================================================================
// 6. CONNECTING SKYBRIDGES (Linking LF Blocks to Central Block)
// =========================================================================
const bridgesGroup = new THREE.Group();
bridgesGroup.name = "CONNECTING_BRIDGES";

function createBridge(x1, z1, x2, z2, y = 7.5) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);

  const bridge = new THREE.Group();
  const walk = createBox(3.2, 0.4, len, matWhiteTrim);
  walk.position.set(0, y, 0);
  bridge.add(walk);

  const railL = createBox(0.1, 1.4, len, matGlass);
  railL.position.set(-1.6, y + 0.8, 0);
  bridge.add(railL);
  const railR = createBox(0.1, 1.4, len, matGlass);
  railR.position.set(1.6, y + 0.8, 0);
  bridge.add(railR);

  const pillar1 = createCylinder(0.35, 0.35, y, 8, matConcrete);
  pillar1.position.set(0, y / 2, 0);
  bridge.add(pillar1);

  bridge.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
  bridge.rotation.y = angle;
  return bridge;
}

// Skybridges connecting the four LF blocks to Central Block
bridgesGroup.add(createBridge(24, -18, 16, -12)); // LF1 to Central
bridgesGroup.add(createBridge(-24, -18, -16, -12)); // LF2 to Central
bridgesGroup.add(createBridge(-24, 18, -16, 12)); // LF3 to Central
bridgesGroup.add(createBridge(24, 18, 16, 12)); // LF4 to Central

scene.add(bridgesGroup);

// =========================================================================
// 7. PERIMETER VEGETATION (Subtle Trees Framing the 6 Buildings)
// =========================================================================
const vegetation = new THREE.Group();
vegetation.name = "CAMPUS_VEGETATION";

// Trees framing the entrance boulevard
for (let z = -25; z >= -48; z -= 11) {
  vegetation.add(createTree(-26, z, 1.1));
  vegetation.add(createTree(26, z, 1.1));
}

// Trees in the 4 quad courtyards
vegetation.add(createTree(-18, -10, 0.9));
vegetation.add(createTree(18, -10, 0.9));
vegetation.add(createTree(-18, 10, 0.9));
vegetation.add(createTree(18, 10, 0.9));

// Boundary framing trees
for (let x = -60; x <= 60; x += 20) {
  vegetation.add(createTree(x, -72, 1.2));
  vegetation.add(createTree(x, 46, 1.2));
}

scene.add(vegetation);

// =========================================================================
// 8. EXPORT TO BINARY GLB
// =========================================================================
const outputPath = path.resolve('public/models/vvit-campus.glb');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const exporter = new GLTFExporter();

console.log("Parsing VVIT Central Complex geometry into binary GLB format...");
exporter.parse(
  scene,
  (glbBuffer) => {
    const buffer = Buffer.from(glbBuffer);
    fs.writeFileSync(outputPath, buffer);
    const sizeKb = Math.round(buffer.length / 1024);
    console.log(`Successfully generated VVIT Central Complex 3D Model: ${outputPath} (${sizeKb} KB)`);
  },
  (error) => {
    console.error("Error exporting GLB:", error);
  },
  {
    binary: true,
    embedImages: true,
    truncateDrawRange: true
  }
);
