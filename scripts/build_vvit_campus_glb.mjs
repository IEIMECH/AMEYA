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

console.log("Generating VVIT Central Complex 3D Model with Inward-Facing Loyalty Blocks & Straight OAT...");

const scene = new THREE.Scene();
scene.name = "VVIT_Central_Campus_Complex";

// =========================================================================
// 1. MATERIALS (Curated Architectural Palette)
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
  color: 0x44444c,
  roughness: 0.7,
  metalness: 0.12,
  name: "Mat_Entrance_Plaza"
});

const matStage = new THREE.MeshStandardMaterial({
  color: 0x2e2e34,
  roughness: 0.6,
  metalness: 0.2,
  name: "Mat_Stage_Wood"
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
  
  const foliage1 = createCylinder(0, 1.5 * scale, 2.0 * scale, 7, matTreeLeaves, "Foliage_1");
  foliage1.position.y = 2.5 * scale;
  tree.add(foliage1);
  
  const foliage2 = createCylinder(0, 1.1 * scale, 1.7 * scale, 7, matTreeLeaves, "Foliage_2");
  foliage2.position.y = 3.4 * scale;
  tree.add(foliage2);

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
// 2. GROUND & WALKWAYS (Clean Architectural Plinth)
// =========================================================================
const groundGroup = new THREE.Group();
groundGroup.name = "Ground";

// Base terrain plinth (135m x 175m)
const basePlinth = createBox(135, 1.5, 175, new THREE.MeshStandardMaterial({
  color: 0x121215,
  roughness: 0.95
}), "Base_Plinth");
basePlinth.position.set(0, -0.75, -5);
groundGroup.add(basePlinth);

// Manicured campus lawn
const lawn = createBox(125, 0.1, 165, matLawn, "Campus_Lawn");
lawn.position.set(0, 0.05, -5);
groundGroup.add(lawn);

scene.add(groundGroup);

const walkwaysGroup = new THREE.Group();
walkwaysGroup.name = "Walkways";

// OPEN PLAZA between Central Block and H - BLOCK (from z = -17 to z = -56)
const openPlaza = createBox(50, 0.15, 38, matPlaza, "Open_Plaza");
openPlaza.position.set(0, 0.08, -37);
walkwaysGroup.add(openPlaza);

// Courtyard paved crossways surrounding Central Block
const quadPathNS = createBox(8, 0.16, 50, matPavement, "Quad_Path_NS");
quadPathNS.position.set(0, 0.08, 0);
walkwaysGroup.add(quadPathNS);

const quadPathEW = createBox(76, 0.16, 8, matPavement, "Quad_Path_EW");
quadPathEW.position.set(0, 0.08, 0);
walkwaysGroup.add(quadPathEW);

// Perimeter access loop
const northPave = createBox(90, 0.15, 8, matRoad, "North_Access_Road");
northPave.position.set(0, 0.08, -80);
walkwaysGroup.add(northPave);

const southPave = createBox(90, 0.15, 8, matRoad, "South_Access_Road");
southPave.position.set(0, 0.08, 70);
walkwaysGroup.add(southPave);

scene.add(walkwaysGroup);

// =========================================================================
// 3. CENTRAL BLOCK (Exact Square Building, 34m x 34m, 4 Stories)
// =========================================================================
const centralBlock = new THREE.Group();
centralBlock.name = "Central_Block";
centralBlock.userData = {
  buildingId: "CENTRAL_BLOCK",
  name: "CENTRAL BLOCK",
  zone: "Central Academic Core",
  floors: 4,
  description: "Exact square administrative nucleus and plenary auditorium. Sits at the geometric center of the complex."
};

const CB_SIZE = 34; // Exact square footprint
const CB_FLOOR_H = 4.2;

for (let f = 0; f < 4; f++) {
  const floorGroup = new THREE.Group();
  floorGroup.name = `Floor_${f}`;
  const y = f * CB_FLOOR_H + CB_FLOOR_H / 2;
  
  // Square brick core
  const core = createBox(CB_SIZE, CB_FLOOR_H - 0.4, CB_SIZE, matBrick, `CB_Core_F${f}`);
  core.position.y = y;
  floorGroup.add(core);

  // White floor slab band
  const slab = createBox(CB_SIZE + 0.8, 0.4, CB_SIZE + 0.8, matWhiteTrim, `CB_Slab_F${f}`);
  slab.position.y = f * CB_FLOOR_H + 0.2;
  floorGroup.add(slab);

  // Facade ribbon windows on East (+X) and West (-X)
  const winEast = createBox(0.4, CB_FLOOR_H * 0.45, CB_SIZE * 0.75, matGlass, `CB_WinE_F${f}`);
  winEast.position.set(CB_SIZE / 2 + 0.1, y, 0);
  floorGroup.add(winEast);

  const winWest = createBox(0.4, CB_FLOOR_H * 0.45, CB_SIZE * 0.75, matGlass, `CB_WinW_F${f}`);
  winWest.position.set(-CB_SIZE / 2 - 0.1, y, 0);
  floorGroup.add(winWest);

  // Facade windows on North (-Z, flanking entrance)
  if (f >= 1) {
    const curtainLeft = createBox(CB_SIZE * 0.28, CB_FLOOR_H * 0.65, 0.4, matGlass, `CB_WinN_L_F${f}`);
    curtainLeft.position.set(-CB_SIZE * 0.3, y, -CB_SIZE / 2 - 0.1);
    floorGroup.add(curtainLeft);

    const curtainRight = createBox(CB_SIZE * 0.28, CB_FLOOR_H * 0.65, 0.4, matGlass, `CB_WinN_R_F${f}`);
    curtainRight.position.set(CB_SIZE * 0.3, y, -CB_SIZE / 2 - 0.1);
    floorGroup.add(curtainRight);
  }

  // Facade windows on South (+Z, above stage connection)
  if (f >= 1) {
    const winSouth = createBox(CB_SIZE * 0.75, CB_FLOOR_H * 0.45, 0.4, matGlass, `CB_WinS_F${f}`);
    winSouth.position.set(0, y, CB_SIZE / 2 + 0.1);
    floorGroup.add(winSouth);
  }

  centralBlock.add(floorGroup);
}

// Rooftop parapet & skylight
const cbRoof = new THREE.Group();
cbRoof.name = "Roof_Structure";
const roofBase = createBox(CB_SIZE + 0.4, 0.9, CB_SIZE + 0.4, matRoofDark, "CB_Roof_Slab");
roofBase.position.y = 4 * CB_FLOOR_H + 0.45;
cbRoof.add(roofBase);

// Curved white skylight canopy
const skylightGeom = new THREE.CylinderGeometry(5.5, 5.5, 14, 16, 1, false, 0, Math.PI);
const skylight = new THREE.Mesh(skylightGeom, matWhiteTrim);
skylight.rotation.z = Math.PI / 2;
skylight.rotation.y = Math.PI / 2;
skylight.position.set(0, 4 * CB_FLOOR_H + 0.9, 0);
cbRoof.add(skylight);

// White penthouse elevator room
const penthouse = createBox(8, 3.2, 8, matWhiteTrim, "CB_Elevator_Penthouse");
penthouse.position.set(7, 4 * CB_FLOOR_H + 2.5, 7);
cbRoof.add(penthouse);

centralBlock.add(cbRoof);

// MAIN ENTRANCE PORTAL on North Facade (-Z) facing H - BLOCK across Open Plaza
const portal = new THREE.Group();
portal.name = "Central_Main_Entrance";

const portalPillars = createBox(11, 11, 3.2, matWhiteTrim, "Portal_Frame");
portalPillars.position.set(0, 5.5, -CB_SIZE / 2 - 1.6);
portal.add(portalPillars);

const portalGlass = createBox(7, 8, 3.4, matGlass, "Portal_Glass");
portalGlass.position.set(0, 4.5, -CB_SIZE / 2 - 1.65);
portal.add(portalGlass);

// Entrance stair steps descending to the open plaza
for (let s = 0; s < 4; s++) {
  const step = createBox(13 - s * 0.8, 0.25, 1.2, matConcrete, `Step_${s}`);
  step.position.set(0, 0.125 + s * 0.25, -CB_SIZE / 2 - 3.6 - s * 0.8);
  portal.add(step);
}

centralBlock.add(portal);

// Rear stage portal on South Facade (+Z) connecting directly into the OAT Stage
const rearPortal = createBox(12, 6, 1.5, matWhiteTrim, "Central_Rear_Portal");
rearPortal.position.set(0, 3, CB_SIZE / 2 + 0.75);
centralBlock.add(rearPortal);

centralBlock.position.set(0, 0, 0);
scene.add(centralBlock);

// =========================================================================
// 4. OAT STAGE (Attached Directly to Back of Central Block)
// =========================================================================
const oatStage = new THREE.Group();
oatStage.name = "OAT_Stage";
oatStage.userData = {
  buildingId: "OAT",
  name: "OAT STAGE",
  description: "Performance stage attached directly to the rear of Central Block."
};

const STAGE_W = 24;
const STAGE_D = 8;
const STAGE_H = 1.2;

// Elevated stage platform
const stagePlatform = createBox(STAGE_W, STAGE_H, STAGE_D, matStage, "Stage_Platform");
stagePlatform.position.set(0, STAGE_H / 2, CB_SIZE / 2 + STAGE_D / 2);
oatStage.add(stagePlatform);

// Stage concrete base foundation
const stageBase = createBox(STAGE_W + 0.8, 0.4, STAGE_D + 0.8, matConcrete, "Stage_Base");
stageBase.position.set(0, 0.2, CB_SIZE / 2 + STAGE_D / 2);
oatStage.add(stageBase);

// Stage backdrop columns flanking the rear entrance
const stageColL = createBox(1.2, 5.5, 1.2, matWhiteTrim, "Stage_Col_L");
stageColL.position.set(-STAGE_W / 2 + 1, 2.75, CB_SIZE / 2 + 1);
oatStage.add(stageColL);

const stageColR = createBox(1.2, 5.5, 1.2, matWhiteTrim, "Stage_Col_R");
stageColR.position.set(STAGE_W / 2 - 1, 2.75, CB_SIZE / 2 + 1);
oatStage.add(stageColR);

scene.add(oatStage);

// =========================================================================
// 5. STRAIGHT OAT (Open-Air Theatre Stepped Seating Aligned with Central Block)
// =========================================================================
const oat = new THREE.Group();
oat.name = "OAT";
oat.userData = {
  buildingId: "OAT",
  name: "OAT",
  description: "Straight Open-Air Theatre with stepped seating, aligned directly behind Central Block and stage."
};

const OAT_W = 32;
const NUM_TIERS = 8;
const TIER_DEPTH = 3.6;
const TIER_RISE = 0.45;
const OAT_START_Z = CB_SIZE / 2 + STAGE_D + 2; // Starts right behind the stage

// 8 Straight terraced seating tiers
for (let t = 0; t < NUM_TIERS; t++) {
  const tierZ = OAT_START_Z + t * TIER_DEPTH + TIER_DEPTH / 2;
  const tierY = (t + 1) * TIER_RISE;
  
  // Left seating bank
  const seatL = createBox((OAT_W - 4) / 2, tierY, TIER_DEPTH, matBrick, `OAT_Tier_${t}_L`);
  seatL.position.set(-(OAT_W - 4) / 4 - 2, tierY / 2, tierZ);
  oat.add(seatL);

  const seatCapL = createBox((OAT_W - 4) / 2 + 0.2, 0.15, TIER_DEPTH + 0.2, matWhiteTrim, `OAT_Cap_${t}_L`);
  seatCapL.position.set(-(OAT_W - 4) / 4 - 2, tierY + 0.075, tierZ);
  oat.add(seatCapL);

  // Right seating bank
  const seatR = createBox((OAT_W - 4) / 2, tierY, TIER_DEPTH, matBrick, `OAT_Tier_${t}_R`);
  seatR.position.set((OAT_W - 4) / 4 + 2, tierY / 2, tierZ);
  oat.add(seatR);

  const seatCapR = createBox((OAT_W - 4) / 2 + 0.2, 0.15, TIER_DEPTH + 0.2, matWhiteTrim, `OAT_Cap_${t}_R`);
  seatCapR.position.set((OAT_W - 4) / 4 + 2, tierY + 0.075, tierZ);
  oat.add(seatCapR);

  // Central stepped aisle stairs
  const stair = createBox(3.6, (t + 1) * TIER_RISE * 0.9, TIER_DEPTH, matConcrete, `OAT_Stair_${t}`);
  stair.position.set(0, ((t + 1) * TIER_RISE * 0.9) / 2, tierZ);
  oat.add(stair);
}

scene.add(oat);

// =========================================================================
// 6. H - BLOCK (Directly Opposite Central Block's Main Entrance)
// =========================================================================
const hBlock = new THREE.Group();
hBlock.name = "H_Block";
hBlock.userData = {
  buildingId: "H_BLOCK",
  name: "H - BLOCK",
  zone: "North Academic Sector",
  floors: 3,
  description: "Northern academic and student services block directly opposite Central Block's main entrance across the Open Plaza."
};

const HB_W = 54;
const HB_D = 20;
const HB_H = 13.5;

// Main 3-story core
const hbCore = createBox(HB_W, HB_H, HB_D, matBrick, "HB_Core");
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

// Front entrance portico facing Central Block across the Open Plaza
const hbPortico = createBox(10, 6, 3, matWhiteTrim, "HB_Portico");
hbPortico.position.set(0, 3, HB_D / 2 + 1.5);
hBlock.add(hbPortico);

// Position H - BLOCK opposite Central Block's entrance (z = -66)
hBlock.position.set(0, 0, -66);
scene.add(hBlock);

// =========================================================================
// 7. MASTER L-SHAPED LOYALTY BUILDING GENERATOR
//    (ALL 4 LOYALTY BLOCKS MUST FACE INWARD TOWARD CENTRAL BLOCK)
// =========================================================================
// Master L-shape geometry:
// In local coordinates:
// Outer corner/elbow is at (0, 0, 0).
// Wing A extends along +X (length 30m, width 13m).
// Wing B extends along +Z (length 32m, width 13m).
// The inner concave corner is at (13, 0, 13).
// The open nook of the L opens toward (+X, +Z).
// By placing the outer elbow at the outer quadrant corner and rotating:
// - Loyalty 4 (Upper-Left): rotY = 0 -> open nook faces (+X, +Z) = Southeast (directly toward Central Block!)
// - Loyalty 1 (Upper-Right): rotY = 270 (-90) -> open nook faces (-X, +Z) = Southwest (directly toward Central Block!)
// - Loyalty 2 (Lower-Right): rotY = 180 -> open nook faces (-X, -Z) = Northwest (directly toward Central Block!)
// - Loyalty 3 (Lower-Left): rotY = 90 -> open nook faces (+X, -Z) = Northeast (directly toward Central Block!)

function createMasterLoyaltyBlock(id, name, posX, posZ, rotYDeg) {
  const lf = new THREE.Group();
  lf.name = id;
  lf.userData = {
    buildingId: id,
    name: name,
    zone: "Central Academic Quadrant",
    floors: 4,
    description: "4-Story L-shaped academic block facing inward toward the Central Block."
  };

  const WING_A_L = 30; // Wing extending along X
  const WING_W = 13;   // Standard wing thickness
  const WING_B_L = 32; // Wing extending along Z
  const FLOOR_H = 4.2;

  for (let f = 0; f < 4; f++) {
    const floorGroup = new THREE.Group();
    floorGroup.name = `Floor_${f}`;
    const y = f * FLOOR_H + FLOOR_H / 2;

    // Wing A: from x = 0 to x = WING_A_L, z = [0, WING_W]
    const wingA = createBox(WING_A_L, FLOOR_H - 0.4, WING_W, matBrick, `WingA_F${f}`);
    wingA.position.set(WING_A_L / 2, y, WING_W / 2);
    floorGroup.add(wingA);

    // Wing B: from x = [0, WING_W], z = [0, WING_B_L]
    const wingB = createBox(WING_W, FLOOR_H - 0.4, WING_B_L, matBrick, `WingB_F${f}`);
    wingB.position.set(WING_W / 2, y, WING_B_L / 2);
    floorGroup.add(wingB);

    // Continuous floor slabs
    const slabA = createBox(WING_A_L + 0.6, 0.4, WING_W + 0.6, matWhiteTrim, `SlabA_F${f}`);
    slabA.position.set(WING_A_L / 2, f * FLOOR_H + 0.2, WING_W / 2);
    floorGroup.add(slabA);

    const slabB = createBox(WING_W + 0.6, 0.4, WING_B_L + 0.6, matWhiteTrim, `SlabB_F${f}`);
    slabB.position.set(WING_W / 2, f * FLOOR_H + 0.2, WING_B_L / 2);
    floorGroup.add(slabB);

    // Balcony colonnade on inside courtyard face (facing Central Block)
    const balconyA = createBox(WING_A_L - WING_W, FLOOR_H * 0.35, 1.2, matWhiteTrim, `BalconyA_F${f}`);
    balconyA.position.set(WING_A_L / 2 + WING_W / 4, y - FLOOR_H * 0.2, WING_W + 0.6);
    floorGroup.add(balconyA);

    const balconyB = createBox(1.2, FLOOR_H * 0.35, WING_B_L - WING_W, matWhiteTrim, `BalconyB_F${f}`);
    balconyB.position.set(WING_W + 0.6, y - FLOOR_H * 0.2, WING_B_L / 2 + WING_W / 4);
    floorGroup.add(balconyB);

    // Outer facade ribbon windows
    const winOuterA = createBox(WING_A_L * 0.8, FLOOR_H * 0.45, 0.3, matGlass, `WinOuterA_F${f}`);
    winOuterA.position.set(WING_A_L / 2, y, -0.15);
    floorGroup.add(winOuterA);

    const winOuterB = createBox(0.3, FLOOR_H * 0.45, WING_B_L * 0.8, matGlass, `WinOuterB_F${f}`);
    winOuterB.position.set(-0.15, y, WING_B_L / 2);
    floorGroup.add(winOuterB);

    lf.add(floorGroup);
  }

  // Roof slabs & solar panel arrays
  const roof = new THREE.Group();
  roof.name = "Roof_Structure";
  const rY = 4 * FLOOR_H + 0.35;

  const roofSlabA = createBox(WING_A_L + 0.4, 0.7, WING_W + 0.4, matRoofDark, "Roof_SlabA");
  roofSlabA.position.set(WING_A_L / 2, rY, WING_W / 2);
  roof.add(roofSlabA);

  const roofSlabB = createBox(WING_W + 0.4, 0.7, WING_B_L + 0.4, matRoofDark, "Roof_SlabB");
  roofSlabB.position.set(WING_W / 2, rY, WING_B_L / 2);
  roof.add(roofSlabB);

  // Solar arrays along both wings
  const solarsA = createSolarArray(WING_A_L * 0.65, WING_W * 0.6, 18);
  solarsA.position.set(WING_A_L / 2 + 2, rY + 0.35, WING_W / 2);
  roof.add(solarsA);

  const solarsB = createSolarArray(WING_W * 0.6, WING_B_L * 0.65, 18);
  solarsB.position.set(WING_W / 2, rY + 0.35, WING_B_L / 2 + 2);
  solarsB.rotation.y = Math.PI / 2;
  roof.add(solarsB);

  // Corner elbow stair tower
  const stairTower = createBox(WING_W * 0.65, 4 * FLOOR_H + 3.8, WING_W * 0.65, matWhiteTrim, "Stair_Tower");
  stairTower.position.set(WING_W * 0.35, (4 * FLOOR_H + 3.8) / 2, WING_W * 0.35);
  roof.add(stairTower);

  lf.add(roof);

  // Rotation and placement
  lf.rotation.y = (rotYDeg * Math.PI) / 180;
  lf.position.set(posX, 0, posZ);

  return lf;
}

// -------------------------------------------------------------------------
// Positioning the 4 Inward-Facing Loyalty Blocks:
//
// LOYALTY 4: Upper-Left (Elbow at outer corner X = -52, Z = -42)
//            rotY = 0 -> L faces Southeast toward Central Block
// LOYALTY 1: Upper-Right (Elbow at outer corner X = +52, Z = -42)
//            rotY = 270 (-90) -> L faces Southwest toward Central Block
// LOYALTY 2: Lower-Right (Elbow at outer corner X = +52, Z = +42)
//            rotY = 180 -> L faces Northwest toward Central Block
// LOYALTY 3: Lower-Left (Elbow at outer corner X = -52, Z = +42)
//            rotY = 90 -> L faces Northeast toward Central Block
// -------------------------------------------------------------------------

const loyalty4 = createMasterLoyaltyBlock("Loyalty_4", "LOYALTY 4", -52, -42, 0);
scene.add(loyalty4);

const loyalty1 = createMasterLoyaltyBlock("Loyalty_1", "LOYALTY 1", 52, -42, 270);
scene.add(loyalty1);

const loyalty2 = createMasterLoyaltyBlock("Loyalty_2", "LOYALTY 2", 52, 42, 180);
scene.add(loyalty2);

const loyalty3 = createMasterLoyaltyBlock("Loyalty_3", "LOYALTY 3", -52, 42, 90);
scene.add(loyalty3);

// =========================================================================
// 8. BRIDGES (ONLY LOYALTY 1 <-> 2 AND LOYALTY 3 <-> 4)
//    NO BRIDGES TO CENTRAL BLOCK!
// =========================================================================
function createPedestrianBridge(x1, z1, x2, z2, name, y = 7.5) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);

  const bridge = new THREE.Group();
  bridge.name = name;

  // Walkway floor
  const walk = createBox(3.2, 0.4, len, matWhiteTrim, `${name}_Floor`);
  walk.position.set(0, y, 0);
  bridge.add(walk);

  // Tinted glass railings
  const railL = createBox(0.1, 1.4, len, matGlass, `${name}_Rail_L`);
  railL.position.set(-1.6, y + 0.8, 0);
  bridge.add(railL);

  const railR = createBox(0.1, 1.4, len, matGlass, `${name}_Rail_R`);
  railR.position.set(1.6, y + 0.8, 0);
  bridge.add(railR);

  // Support pillar
  const pillar = createCylinder(0.35, 0.35, y, 8, matConcrete, `${name}_Pillar`);
  pillar.position.set(0, y / 2, 0);
  bridge.add(pillar);

  bridge.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
  bridge.rotation.y = angle;
  return bridge;
}

// Bridge between LOYALTY 1 and LOYALTY 2 on East Side
// Loyalty 1 southern tip: X ≈ 45.5, Z = -10
// Loyalty 2 northern tip: X ≈ 45.5, Z = +10
const bridgeL1L2 = createPedestrianBridge(45.5, -10, 45.5, 10, "Bridge_L1_L2");
scene.add(bridgeL1L2);

// Bridge between LOYALTY 4 and LOYALTY 3 on West Side
// Loyalty 4 southern tip: X ≈ -45.5, Z = -10
// Loyalty 3 northern tip: X ≈ -45.5, Z = +10
const bridgeL3L4 = createPedestrianBridge(-45.5, -10, -45.5, 10, "Bridge_L3_L4");
scene.add(bridgeL3L4);

// =========================================================================
// 9. MINIMAL LANDSCAPING (Subtle trees that never block top view)
// =========================================================================
const landscaping = new THREE.Group();
landscaping.name = "Landscaping";

// Boulevard trees flanking the Open Plaza
for (let z = -25; z >= -55; z -= 10) {
  landscaping.add(createTree(-28, z, 1.0));
  landscaping.add(createTree(28, z, 1.0));
}

// Subtle corner courtyard trees
landscaping.add(createTree(-18, -10, 0.85));
landscaping.add(createTree(18, -10, 0.85));
landscaping.add(createTree(-18, 10, 0.85));
landscaping.add(createTree(18, 10, 0.85));

// Trees flanking the OAT seating area
for (let z = 32; z <= 56; z += 12) {
  landscaping.add(createTree(-20, z, 0.9));
  landscaping.add(createTree(20, z, 0.9));
}

scene.add(landscaping);

// =========================================================================
// 10. EXPORT TO BINARY GLB
// =========================================================================
const outputPath = path.resolve('public/models/vvit-campus.glb');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const exporter = new GLTFExporter();

console.log("Parsing VVIT Central Complex scene into binary GLB format...");
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
