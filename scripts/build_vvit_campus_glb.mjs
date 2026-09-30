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

console.log("Initializing VVIT 3D Campus Builder...");

const scene = new THREE.Scene();
scene.name = "VVIT_Campus_Scene";

// =========================================================================
// 1. PALETTE & MATERIALS (Architectural Minimal / Technical Aesthetic)
// =========================================================================
const matBrick = new THREE.MeshStandardMaterial({
  color: 0xb54334, // Terracotta red brick
  roughness: 0.65,
  metalness: 0.05,
  name: "Mat_Terracotta_Brick"
});

const matBrickDark = new THREE.MeshStandardMaterial({
  color: 0x8a3126,
  roughness: 0.7,
  metalness: 0.05,
  name: "Mat_Brick_Dark"
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

const matEarth = new THREE.MeshStandardMaterial({
  color: 0xbf5b30, // Red sports clay earth
  roughness: 0.95,
  metalness: 0.0,
  name: "Mat_Sports_Earth"
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

const matWater = new THREE.MeshStandardMaterial({
  color: 0x0284c7, // Clean pond water
  roughness: 0.08,
  metalness: 0.2,
  transparent: true,
  opacity: 0.82,
  name: "Mat_Pond_Water"
});

const matBusYellow = new THREE.MeshStandardMaterial({
  color: 0xeab308,
  roughness: 0.35,
  metalness: 0.2,
  name: "Mat_Bus_Yellow"
});

const matTreeTrunk = new THREE.MeshStandardMaterial({
  color: 0x4a3525,
  roughness: 0.9,
  name: "Mat_Tree_Trunk"
});

const matTreeLeaves = new THREE.MeshStandardMaterial({
  color: 0x1e3a1f,
  roughness: 0.85,
  name: "Mat_Tree_Canopy"
});

// Helper: Box mesh
function createBox(w, h, d, mat, name = "") {
  const geom = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (name) mesh.name = name;
  return mesh;
}

// Helper: Cylinder mesh
function createCylinder(rt, rb, h, segs, mat, name = "") {
  const geom = new THREE.CylinderGeometry(rt, rb, h, segs);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (name) mesh.name = name;
  return mesh;
}

// Helper: Stylized low-poly tree
function createTree(x, z, scale = 1) {
  const tree = new THREE.Group();
  tree.name = `Tree_${Math.round(x)}_${Math.round(z)}`;
  
  // Trunk
  const trunk = createCylinder(0.25 * scale, 0.35 * scale, 2.2 * scale, 6, matTreeTrunk, "Trunk");
  trunk.position.y = 1.1 * scale;
  tree.add(trunk);
  
  // 3-tiered cone canopy
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

// Helper: Stylized college bus
function createBus(x, z, rotY = 0) {
  const bus = new THREE.Group();
  bus.name = `Bus_${Math.round(x)}_${Math.round(z)}`;
  
  // Body
  const body = createBox(2.8, 1.8, 6.5, matBusYellow, "Bus_Body");
  body.position.y = 1.2;
  bus.add(body);
  
  // Windows strip
  const glass = createBox(2.84, 0.7, 5.8, matGlass, "Bus_Windows");
  glass.position.y = 1.5;
  bus.add(glass);
  
  // White roof
  const roof = createBox(2.7, 0.2, 6.4, matWhiteTrim, "Bus_Roof");
  roof.position.y = 2.2;
  bus.add(roof);

  bus.position.set(x, 0, z);
  bus.rotation.y = rotY;
  return bus;
}

// Helper: Solar panel array
function createSolarArray(w, d, angleDeg = 15) {
  const group = new THREE.Group();
  group.name = "Solar_Array";
  const numPanels = Math.floor(d / 1.8);
  for (let i = 0; i < numPanels; i++) {
    const panel = createBox(w, 0.08, 1.4, matSolar, `Solar_Row_${i}`);
    panel.position.set(0, 0.35, (i - (numPanels - 1) / 2) * 1.8);
    panel.rotation.x = (angleDeg * Math.PI) / 180;
    group.add(panel);
    
    // Mount legs
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
// 2. BASE TERRAIN & CAMPUS ROADS
// =========================================================================
const campusGround = new THREE.Group();
campusGround.name = "CAMPUS_GROUND";

// Main ground plinth (320m x 260m)
const groundMesh = createBox(320, 1.5, 260, new THREE.MeshStandardMaterial({
  color: 0x141416,
  roughness: 0.95
}), "Base_Terrain");
groundMesh.position.y = -0.75;
campusGround.add(groundMesh);

// Central lawn zone around main complex
const centralLawn = createBox(130, 0.1, 130, matLawn, "Central_Complex_Lawn");
centralLawn.position.set(0, 0.05, 0);
campusGround.add(centralLawn);

// Western lawn (Aruna buffer)
const westLawn = createBox(60, 0.1, 140, matLawn, "West_Lawn");
westLawn.position.set(-75, 0.05, 0);
campusGround.add(westLawn);

// Roads Network
const roadsGroup = new THREE.Group();
roadsGroup.name = "ROAD_NETWORK";

// Main entry spine road running north-south in front of Central Block
const mainSpineRoad = createBox(14, 0.15, 220, matRoad, "Main_Spine_Road");
mainSpineRoad.position.set(0, 0.08, 20);
roadsGroup.add(mainSpineRoad);

// East-West central ring road
const ringRoadNorth = createBox(240, 0.15, 12, matRoad, "Ring_Road_North");
ringRoadNorth.position.set(0, 0.08, -65);
roadsGroup.add(ringRoadNorth);

const ringRoadSouth = createBox(240, 0.15, 12, matRoad, "Ring_Road_South");
ringRoadSouth.position.set(0, 0.08, 75);
roadsGroup.add(ringRoadSouth);

const roadWest = createBox(12, 0.15, 150, matRoad, "Road_West");
roadWest.position.set(-115, 0.08, 5);
roadsGroup.add(roadWest);

const roadEast = createBox(12, 0.15, 150, matRoad, "Road_East");
roadEast.position.set(115, 0.08, 5);
roadsGroup.add(roadEast);

// Courtyard intersecting paved pedestrian axes
const quadPathNS = createBox(8, 0.18, 90, matPavement, "Quad_Path_NS");
quadPathNS.position.set(0, 0.1, 0);
roadsGroup.add(quadPathNS);

const quadPathEW = createBox(90, 0.18, 8, matPavement, "Quad_Path_EW");
quadPathEW.position.set(0, 0.1, 0);
roadsGroup.add(quadPathEW);

campusGround.add(roadsGroup);
scene.add(campusGround);

// =========================================================================
// 3. CENTRAL ACADEMIC COMPLEX (THE FOCAL POINT)
// =========================================================================

// --- 3A. SQUARE CENTRAL BLOCK ---
const centralBlock = new THREE.Group();
centralBlock.name = "CENTRAL_BLOCK";
centralBlock.userData = {
  buildingId: "CENTRAL_BLOCK",
  name: "Central Block & Main Auditorium",
  zone: "Central Academic Complex",
  floors: 4,
  description: "Square administrative and central lecture complex. Houses the VVIT Main Plenary Auditorium, Vice-Chancellor chambers, central library, and inaugural arenas.",
  capacity: "800 Seats",
  events: "Inaugural Ceremony, Keynote Plenary, Valedictory Gala"
};

// Floor dimensions: 32m x 32m square, 4 stories, total height = 18m
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

  // Upper floor glass curtain wall modules on south front facade
  if (f >= 1) {
    const curtainLeft = createBox(CB_SIZE * 0.28, CB_FLOOR_H * 0.65, 0.4, matGlass, `Glass_Left_F${f}`);
    curtainLeft.position.set(-CB_SIZE * 0.3, y, CB_SIZE / 2 + 0.1);
    floorGroup.add(curtainLeft);

    const curtainRight = createBox(CB_SIZE * 0.28, CB_FLOOR_H * 0.65, 0.4, matGlass, `Glass_Right_F${f}`);
    curtainRight.position.set(CB_SIZE * 0.3, y, CB_SIZE / 2 + 0.1);
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

// Curved white canopy / vaulted skylight structure (visible in satellite/aerial photos)
const skylightGeom = new THREE.CylinderGeometry(5.5, 5.5, 14, 16, 1, false, 0, Math.PI);
const skylight = new THREE.Mesh(skylightGeom, matWhiteTrim);
skylight.rotation.z = Math.PI / 2;
skylight.rotation.y = Math.PI / 2;
skylight.position.set(0, 4 * CB_FLOOR_H + 0.9, 0);
cbRoof.add(skylight);

// White penthouse elevator room
const penthouse = createBox(8, 3.2, 8, matWhiteTrim, "Elevator_Penthouse");
penthouse.position.set(6, 4 * CB_FLOOR_H + 2.5, -6);
cbRoof.add(penthouse);

centralBlock.add(cbRoof);

// Iconic South Entrance Portal (White portico spanning floors 0-2 with tall arch)
const portal = new THREE.Group();
portal.name = "Entrance_Portal";
const portalPillars = createBox(10, 11, 3.2, matWhiteTrim, "Portal_Frame");
portalPillars.position.set(0, 5.5, CB_SIZE / 2 + 1.6);
portal.add(portalPillars);

const portalOpening = createBox(6, 8, 3.4, matGlass, "Portal_Glass_Opening");
portalOpening.position.set(0, 4.5, CB_SIZE / 2 + 1.65);
portal.add(portalOpening);

// Entrance stair steps
for (let s = 0; s < 4; s++) {
  const step = createBox(12 - s * 0.8, 0.25, 1.2, matConcrete, `Step_${s}`);
  step.position.set(0, 0.125 + s * 0.25, CB_SIZE / 2 + 3.6 + s * 0.8);
  portal.add(step);
}

centralBlock.add(portal);
centralBlock.position.set(0, 0, 0);
scene.add(centralBlock);

// --- 3B. FOUR L-SHAPED BUILDINGS (LF 1, LF 2, LF 3, LF 4) ---
// Each LF building is an identical architectural template composed of:
// - Long leg: 44m length, 14m width, 4 stories (16.8m height)
// - Short leg: 30m length, 14m width, 4 stories
// Formed in an 'L' shape enclosing the corners around Central Block.

function createLFBuilding(id, name, posX, posZ, rotYDeg) {
  const lf = new THREE.Group();
  lf.name = id;
  lf.userData = {
    buildingId: id,
    name: name,
    zone: "Central Academic Quadrant",
    floors: 4,
    description: `Multi-tier L-shaped academic block housing advanced departmental lecture theatres, CAD laboratories, faculty chambers, and smart classrooms.`,
    capacity: "600 Students",
    events: "Technical Arenas, Paper Presentations, Kinematic Exhibits"
  };

  const LEG_A_L = 40; // Length of primary wing
  const LEG_W = 13.5; // Wing thickness
  const LEG_B_L = 26; // Length of secondary wing
  const FLOOR_H = 4.2;

  for (let f = 0; f < 4; f++) {
    const floorGroup = new THREE.Group();
    floorGroup.name = `Floor_${f}`;
    const y = f * FLOOR_H + FLOOR_H / 2;

    // Wing 1 (Long leg)
    const wing1 = createBox(LEG_A_L, FLOOR_H - 0.4, LEG_W, matBrick, `Wing1_F${f}`);
    wing1.position.set(0, y, 0);
    floorGroup.add(wing1);

    // Wing 2 (Short leg perpendicular forming 'L')
    const wing2 = createBox(LEG_W, FLOOR_H - 0.4, LEG_B_L, matBrick, `Wing2_F${f}`);
    wing2.position.set(LEG_A_L / 2 - LEG_W / 2, y, LEG_B_L / 2 + LEG_W / 2);
    floorGroup.add(wing2);

    // White floor slab band running continuously across both wings
    const slab1 = createBox(LEG_A_L + 0.6, 0.4, LEG_W + 0.6, matWhiteTrim, `Slab1_F${f}`);
    slab1.position.set(0, f * FLOOR_H + 0.2, 0);
    floorGroup.add(slab1);

    const slab2 = createBox(LEG_W + 0.6, 0.4, LEG_B_L + 0.6, matWhiteTrim, `Slab2_F${f}`);
    slab2.position.set(LEG_A_L / 2 - LEG_W / 2, f * FLOOR_H + 0.2, LEG_B_L / 2 + LEG_W / 2);
    floorGroup.add(slab2);

    // Inner courtyard balcony / open corridor colonnade (White framing on courtyard-facing side)
    const balcony1 = createBox(LEG_A_L - LEG_W, FLOOR_H * 0.4, 1.2, matWhiteTrim, `Balcony1_F${f}`);
    balcony1.position.set(-LEG_W / 2, y - FLOOR_H * 0.2, LEG_W / 2 + 0.6);
    floorGroup.add(balcony1);

    // Window modules on outer facade
    const winRow1 = createBox(LEG_A_L * 0.8, FLOOR_H * 0.45, 0.3, matGlass, `Win_Row1_F${f}`);
    winRow1.position.set(0, y, -LEG_W / 2 - 0.15);
    floorGroup.add(winRow1);

    const winRow2 = createBox(0.3, FLOOR_H * 0.45, LEG_B_L * 0.8, matGlass, `Win_Row2_F${f}`);
    winRow2.position.set(LEG_A_L / 2 + 0.15, y, LEG_B_L / 2 + LEG_W / 2);
    floorGroup.add(winRow2);

    lf.add(floorGroup);
  }

  // Rooftop parapet & solar panel arrays
  const roof = new THREE.Group();
  roof.name = "Roof_Structure";
  const rY = 4 * FLOOR_H + 0.35;

  const roofSlab1 = createBox(LEG_A_L + 0.4, 0.7, LEG_W + 0.4, matRoofDark, "Roof_Slab1");
  roofSlab1.position.set(0, rY, 0);
  roof.add(roofSlab1);

  const roofSlab2 = createBox(LEG_W + 0.4, 0.7, LEG_B_L + 0.4, matRoofDark, "Roof_Slab2");
  roofSlab2.position.set(LEG_A_L / 2 - LEG_W / 2, rY, LEG_B_L / 2 + LEG_W / 2);
  roof.add(roofSlab2);

  // Solar panel arrays along the roof of Wing 1 & Wing 2 (Prominent in aerial photos)
  const solars1 = createSolarArray(LEG_A_L * 0.65, LEG_W * 0.6, 18);
  solars1.position.set(-LEG_A_L * 0.1, rY + 0.35, 0);
  roof.add(solars1);

  const solars2 = createSolarArray(LEG_W * 0.6, LEG_B_L * 0.65, 18);
  solars2.position.set(LEG_A_L / 2 - LEG_W / 2, rY + 0.35, LEG_B_L / 2 + LEG_W / 2);
  solars2.rotation.y = Math.PI / 2;
  roof.add(solars2);

  // Stair tower at the corner elbow
  const stairTower = createBox(LEG_W * 0.6, 4 * FLOOR_H + 3.8, LEG_W * 0.6, matWhiteTrim, "Stair_Tower");
  stairTower.position.set(LEG_A_L / 2 - LEG_W / 2, (4 * FLOOR_H + 3.8) / 2, 0);
  roof.add(stairTower);

  lf.add(roof);

  // Orient and position around the Central Block
  lf.rotation.y = (rotYDeg * Math.PI) / 180;
  lf.position.set(posX, 0, posZ);

  return lf;
}

// 4 LF Buildings surrounding Central Block symmetrically:
// LF 1: Upper / Right (Northeast)
const lf1 = createLFBuilding("LF_1", "LF 1 — Academic Block", 34, -34, 180);
scene.add(lf1);

// LF 2: Upper / Left (Northwest)
const lf2 = createLFBuilding("LF_2", "LF 2 — Academic Block", -34, -34, 270);
scene.add(lf2);

// LF 3: Lower / Left (Southwest)
const lf3 = createLFBuilding("LF_3", "LF 3 — Academic Block", -34, 34, 0);
scene.add(lf3);

// LF 4: Lower / Right (Southeast)
const lf4 = createLFBuilding("LF_4", "LF 4 — Academic Block", 34, 34, 90);
scene.add(lf4);

// --- 3C. CONNECTING SKYBRIDGES & CORRIDORS ---
const bridgesGroup = new THREE.Group();
bridgesGroup.name = "CONNECTING_BRIDGES";

function createBridge(x1, z1, x2, z2, y = 7.5) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);

  const bridge = new THREE.Group();
  // Floor
  const walk = createBox(3.5, 0.4, len, matWhiteTrim);
  walk.position.set(0, y, 0);
  bridge.add(walk);

  // Glass railings
  const railL = createBox(0.1, 1.4, len, matGlass);
  railL.position.set(-1.7, y + 0.8, 0);
  bridge.add(railL);
  const railR = createBox(0.1, 1.4, len, matGlass);
  railR.position.set(1.7, y + 0.8, 0);
  bridge.add(railR);

  // Support pillars
  const pillar1 = createCylinder(0.35, 0.35, y, 8, matConcrete);
  pillar1.position.set(-1.4, y / 2, -len * 0.3);
  bridge.add(pillar1);
  const pillar2 = createCylinder(0.35, 0.35, y, 8, matConcrete);
  pillar2.position.set(1.4, y / 2, len * 0.3);
  bridge.add(pillar2);

  bridge.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
  bridge.rotation.y = angle;
  return bridge;
}

// 4 Skybridges connecting each LF building into the Central Block
bridgesGroup.add(createBridge(20, -20, 14, -14)); // LF1 to Central
bridgesGroup.add(createBridge(-20, -20, -14, -14)); // LF2 to Central
bridgesGroup.add(createBridge(-20, 20, -14, 14)); // LF3 to Central
bridgesGroup.add(createBridge(20, 20, 14, 14)); // LF4 to Central

scene.add(bridgesGroup);

// --- 3D. AMPHITHEATER (Behind Central Block, between LF1 & LF2) ---
const amphiGroup = new THREE.Group();
amphiGroup.name = "AMPHITHEATER";
amphiGroup.userData = {
  buildingId: "AMPHITHEATER",
  name: "Open-Air Amphitheater Plaza",
  zone: "Central Courtyard North",
  capacity: "600 Spectators",
  description: "Tiered open-air student amphitheater and performance stage. Venue for acoustic showcases, student band performances, and cultural assembly."
};

const amphiStage = createBox(22, 0.8, 8, matConcrete, "Amphi_Stage");
amphiStage.position.set(0, 0.4, -22);
amphiGroup.add(amphiStage);

// 6 Tiered seating steps
for (let t = 0; t < 6; t++) {
  const rTier = 16 + t * 2.8;
  const tierGeom = new THREE.CylinderGeometry(rTier, rTier, 0.5, 24, 1, false, Math.PI * 0.1, Math.PI * 0.8);
  const tierMesh = new THREE.Mesh(tierGeom, matBrick);
  tierMesh.position.set(0, 0.25 + t * 0.5, -28);
  tierMesh.rotation.y = Math.PI;
  amphiGroup.add(tierMesh);
}

scene.add(amphiGroup);

// =========================================================================
// 4. H - BLOCK (North of Central Complex)
// =========================================================================
const hBlock = new THREE.Group();
hBlock.name = "H_BLOCK";
hBlock.userData = {
  buildingId: "H_BLOCK",
  name: "H - BLOCK",
  zone: "Northern Academic & Services Sector",
  floors: 3,
  description: "Northern academic and student service facility. Recreated as requested (formerly labeled university cafeteria in older satellite drafts). Features large open halls and technical utility stations.",
  capacity: "450 Occupants",
  events: "Technical Registration, Help Desk, Refreshment Concourse"
};

const HB_W = 54;
const HB_D = 22;
const HB_H = 13.5;

// Main 3-story block
const hbCore = createBox(HB_W, HB_H, HB_D, matBrick, "H_Block_Core");
hbCore.position.set(0, HB_H / 2, 0);
hBlock.add(hbCore);

// Pitched / curved white roof canopy
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

hBlock.position.set(0, 0, -85);
scene.add(hBlock);

// =========================================================================
// 5. ARUNA 1 (Western Academic Complex)
// =========================================================================
const aruna1 = new THREE.Group();
aruna1.name = "ARUNA_1";
aruna1.userData = {
  buildingId: "ARUNA_1",
  name: "Aruna 1 — Engineering Tower",
  zone: "Western Academic Quadrangle",
  floors: 4,
  description: "Prominent elongated 4-story engineering building. Features extensive mechanical workshops, precision labs, CAD simulation suites, and distinctive curved rooftop canopy.",
  capacity: "1,200 Students",
  events: "Kinetic Track Arena, Assemble & Disassemble, AutoCAD Championship"
};

const ARUNA_W = 28;
const ARUNA_L = 96;
const ARUNA_H = 18;

// Main 4-story elongated block
const arunaCore = createBox(ARUNA_W, ARUNA_H, ARUNA_L, matBrick, "Aruna_Core");
arunaCore.position.set(0, ARUNA_H / 2, 0);
aruna1.add(arunaCore);

// Horizontal white cornice slabs per floor
for (let f = 0; f < 4; f++) {
  const slab = createBox(ARUNA_W + 0.8, 0.4, ARUNA_L + 0.8, matWhiteTrim, `Aruna_Slab_${f}`);
  slab.position.set(0, f * 4.5 + 0.2, 0);
  aruna1.add(slab);

  // Window grid modules
  const winEast = createBox(0.4, 2.2, ARUNA_L * 0.85, matGlass, `Aruna_WinE_${f}`);
  winEast.position.set(ARUNA_W / 2 + 0.2, f * 4.5 + 2.4, 0);
  aruna1.add(winEast);

  const winWest = createBox(0.4, 2.2, ARUNA_L * 0.85, matGlass, `Aruna_WinW_${f}`);
  winWest.position.set(-ARUNA_W / 2 - 0.2, f * 4.5 + 2.4, 0);
  aruna1.add(winWest);
}

// Rooftop vaulted arched canopy (White barrel canopy running along spine)
const arunaRoofGeom = new THREE.CylinderGeometry(ARUNA_W * 0.42, ARUNA_W * 0.42, ARUNA_L * 0.8, 16, 1, false, 0, Math.PI);
const arunaCanopy = new THREE.Mesh(arunaRoofGeom, matWhiteTrim);
arunaCanopy.rotation.x = Math.PI / 2;
arunaCanopy.position.set(0, ARUNA_H, 0);
aruna1.add(arunaCanopy);

// Solar panels flanking the canopy on flat roof decks
const arunaSolars = createSolarArray(ARUNA_W * 0.35, ARUNA_L * 0.65, 15);
arunaSolars.position.set(ARUNA_W * 0.25, ARUNA_H + 0.3, 0);
aruna1.add(arunaSolars);

// Entrance Portico with monumental white pillars
const portico = createBox(ARUNA_W * 0.4, ARUNA_H * 0.8, 6, matWhiteTrim, "Aruna_Portico");
portico.position.set(0, (ARUNA_H * 0.8) / 2, ARUNA_L / 2 + 3);
aruna1.add(portico);

aruna1.position.set(-82, 0, 5);
scene.add(aruna1);

// =========================================================================
// 6. VIVA THE SCHOOL BY VVIT (Southwestern Campus)
// =========================================================================
const vivaSchool = new THREE.Group();
vivaSchool.name = "VIVA_SCHOOL";
vivaSchool.userData = {
  buildingId: "VIVA_SCHOOL",
  name: "VIVA The School by VVIT",
  zone: "Southwestern Campus Compound",
  floors: 3,
  description: "Autonomous international school complex located on the campus perimeter. Features distinct multi-wing classrooms, internal courtyards, and dedicated activity spaces.",
  capacity: "500 Students",
  events: "Auxiliary Exhibition, Regional STEM Showcase"
};

const VS_W = 50;
const VS_L = 36;
const VS_H = 12.5;

// Main U-shaped or rectangular multi-story complex
const vsMain = createBox(VS_W, VS_H, VS_L, matConcrete, "Viva_Main_Block");
vsMain.position.set(0, VS_H / 2, 0);
vivaSchool.add(vsMain);

// Terracotta facade bands
const vsFacade = createBox(VS_W + 0.4, VS_H * 0.65, VS_L * 0.6, matBrick, "Viva_Facade_Accent");
vsFacade.position.set(0, VS_H / 2, 0);
vivaSchool.add(vsFacade);

// Rooftop parapet
const vsRoof = createBox(VS_W + 0.6, 0.6, VS_L + 0.6, matRoofDark, "Viva_Roof");
vsRoof.position.set(0, VS_H + 0.3, 0);
vivaSchool.add(vsRoof);

vivaSchool.position.set(-85, 0, -110);
scene.add(vivaSchool);

// =========================================================================
// 7. VVIT POND & AQUATIC BODY (Eastern Campus)
// =========================================================================
const pondGroup = new THREE.Group();
pondGroup.name = "VVIT_POND";
pondGroup.userData = {
  buildingId: "VVIT_POND",
  name: "VVIT Lake & Conservation Pond",
  zone: "Eastern Eco-Reserve",
  description: "Natural water catchment basin and ecological pond. Features stone perimeter banks, aquatic vegetation, and relaxing campus promenade.",
  capacity: "Campus Nature Landmark",
  events: "Evening Light Installation, Drone Aquatic Telemetry"
};

// Natural irregular pond shape constructed with curved spline
const pondShape = new THREE.Shape();
pondShape.moveTo(0, 0);
pondShape.bezierCurveTo(15, 8, 30, 5, 38, -10);
pondShape.bezierCurveTo(42, -22, 35, -38, 20, -42);
pondShape.bezierCurveTo(8, -45, -5, -36, -12, -22);
pondShape.bezierCurveTo(-18, -10, -10, -5, 0, 0);

const pondGeom = new THREE.ShapeGeometry(pondShape);
const pondMesh = new THREE.Mesh(pondGeom, matWater);
pondMesh.rotation.x = -Math.PI / 2;
pondMesh.position.set(0, 0.2, 0);
pondGroup.add(pondMesh);

// Stone revetment bank perimeter
const bankMesh = createBox(52, 0.25, 54, matPavement, "Pond_Bank");
bankMesh.position.set(12, 0.1, -22);
pondGroup.add(bankMesh);

// Surrounding trees
for (let a = 0; a < 8; a++) {
  const ang = (a / 8) * Math.PI * 2;
  const tx = 14 + Math.cos(ang) * 26;
  const tz = -22 + Math.sin(ang) * 26;
  pondGroup.add(createTree(tx, tz, 0.85 + (a % 3) * 0.15));
}

pondGroup.position.set(80, 0, 15);
scene.add(pondGroup);

// =========================================================================
// 8. PLAYGROUND & SPORTS FIELD (Southern / Lower Area)
// =========================================================================
const playGroup = new THREE.Group();
playGroup.name = "PLAYGROUND";
playGroup.userData = {
  buildingId: "PLAYGROUND",
  name: "VVIT Sports Arena & Track Ground",
  zone: "Southern Athletic Ground",
  capacity: "2,000 Spectators",
  description: "Full-scale 400m collegiate athletic running track, open football pitch, cricket ground, and adjacent basketball/volleyball courts.",
  events: "RC Car Championship Arena, Aeromodelling Drone Flights, Sports Meet"
};

// Outer red earth ground (85m x 65m)
const trackEarth = createBox(85, 0.12, 65, matEarth, "Track_Earth_Base");
trackEarth.position.set(0, 0.06, 0);
playGroup.add(trackEarth);

// Inner lush green football field
const innerField = createBox(65, 0.14, 45, matLawn, "Inner_Pitch");
innerField.position.set(0, 0.07, 0);
playGroup.add(innerField);

// 400m running track white lines
const trackOutline = createBox(74, 0.15, 54, matWhiteTrim, "Track_Lines");
trackOutline.position.set(0, 0.08, 0);
trackOutline.scale.set(1, 1, 1);
playGroup.add(trackOutline);

// Basketball / Volleyball hard court
const bbCourt = createBox(28, 0.16, 16, new THREE.MeshStandardMaterial({
  color: 0x1d4ed8,
  roughness: 0.5
}), "Basketball_Court");
bbCourt.position.set(-35, 0.08, 25);
playGroup.add(bbCourt);

playGroup.position.set(50, 0, 85);
scene.add(playGroup);

// =========================================================================
// 9. BUS PARKING LOT & COLLEGE BUS FLEET
// =========================================================================
const busGroup = new THREE.Group();
busGroup.name = "BUS_PARKING";
busGroup.userData = {
  buildingId: "BUS_PARKING",
  name: "Central Transit & Bus Terminal",
  zone: "Southwestern Transport Hub",
  capacity: "60+ College Buses",
  description: "Primary student transit terminal accommodating the regional VVIT bus fleet serving Guntur, Vijayawada, Tenali, and surrounding districts."
};

const busLot = createBox(65, 0.14, 40, matPavement, "Bus_Lot_Base");
busLot.position.set(0, 0.07, 0);
busGroup.add(busLot);

// 12 Yellow college buses parked in two clean parallel rows
for (let r = 0; r < 2; r++) {
  for (let c = 0; c < 6; c++) {
    const bx = (c - 2.5) * 8.5;
    const bz = (r - 0.5) * 16;
    busGroup.add(createBus(bx, bz, 0));
  }
}

busGroup.position.set(-45, 0, 95);
scene.add(busGroup);

// =========================================================================
// 10. CAMPUS TREES & PERIMETER VEGETATION
// =========================================================================
const vegetation = new THREE.Group();
vegetation.name = "CAMPUS_VEGETATION";

// Trees along main spine road
for (let z = -45; z <= 65; z += 16) {
  vegetation.add(createTree(-10, z, 1.1));
  vegetation.add(createTree(10, z, 1.1));
}

// Trees in the 4 quad courtyards
vegetation.add(createTree(-18, -18, 0.9));
vegetation.add(createTree(18, -18, 0.9));
vegetation.add(createTree(-18, 18, 0.9));
vegetation.add(createTree(18, 18, 0.9));

// Trees along West road buffer (between Central & Aruna)
for (let z = -40; z <= 50; z += 18) {
  vegetation.add(createTree(-58, z, 1.2));
}

// Trees along boundary
for (let x = -130; x <= 130; x += 22) {
  vegetation.add(createTree(x, -118, 1.3));
  vegetation.add(createTree(x, 118, 1.3));
}

scene.add(vegetation);

// =========================================================================
// 11. EXPORT TO BINARY GLB
// =========================================================================
const outputPath = path.resolve('public/models/vvit-campus.glb');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const exporter = new GLTFExporter();

console.log("Parsing scene geometry into binary GLB format...");
exporter.parse(
  scene,
  (glbBuffer) => {
    const buffer = Buffer.from(glbBuffer);
    fs.writeFileSync(outputPath, buffer);
    const sizeKb = Math.round(buffer.length / 1024);
    console.log(`Successfully generated VVIT Campus 3D Model: ${outputPath} (${sizeKb} KB)`);
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
