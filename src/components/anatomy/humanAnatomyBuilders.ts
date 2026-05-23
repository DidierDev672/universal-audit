import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { H, LANDMARKS } from "./anatomyConstants";
import type { OrganDefinition } from "./organDefinitions";

export type Vector3Tuple = [number, number, number];

export const ORGAN_FOCUS: Record<string, Vector3Tuple> = {
  cerebro: [0, LANDMARKS.headCenter, 0.02],
  nasofaringe: [0, LANDMARKS.nose, 0.1],
  tiroides: [0, LANDMARKS.neckBase - 0.04, 0.12],
  timo: [0, LANDMARKS.sternum - 0.08, 0.1],
  pulmones: [0, LANDMARKS.sternum - 0.12, 0.06],
  corazon: [-0.05, LANDMARKS.sternum - 0.15, 0.14],
  higado: [0.16, LANDMARKS.navel + 0.08, 0.08],
  estomago: [-0.08, LANDMARKS.navel + 0.05, 0.12],
  pancreas: [0, LANDMARKS.navel, 0.04],
  rinones: [0, LANDMARKS.navel + 0.02, -0.06],
  intestino: [0, LANDMARKS.hip + 0.12, 0.08],
  vejiga: [0, LANDMARKS.hip + 0.06, 0.1],
  reproductor: [0, LANDMARKS.hip, 0.08],
};

function organMaterial(color: number, emissive: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity: 0.1,
    roughness: 0.85,
    metalness: 0.02,
    transparent: true,
    opacity: 0.94,
  });
}

function bodyMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0xd8b8a0,
    roughness: 0.9,
    metalness: 0,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

function latheY(profile: THREE.Vector2[], segments = 24): THREE.LatheGeometry {
  return new THREE.LatheGeometry(profile, segments);
}

function addMesh(
  parent: THREE.Object3D,
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  pos: Vector3Tuple,
  rot: Vector3Tuple = [0, 0, 0],
  scale: Vector3Tuple = [1, 1, 1],
): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.scale.set(...scale);
  m.castShadow = true;
  parent.add(m);
  return m;
}

function tagOrgan(root: THREE.Object3D, id: string): void {
  root.userData.organId = id;
  root.traverse((c) => {
    if (c instanceof THREE.Mesh) c.userData.organId = id;
  });
}

/** Silueta humana con proporciones 7½ cabezas */
export function buildHumanBody(): THREE.Group {
  const body = new THREE.Group();
  body.name = "HumanBody";
  const skin = bodyMaterial();

  const torsoProfile = [
    new THREE.Vector2(0.11, 0.42),
    new THREE.Vector2(0.13, 0.52),
    new THREE.Vector2(0.17, 0.72),
    new THREE.Vector2(0.22, 0.92),
    new THREE.Vector2(0.21, 1.02),
    new THREE.Vector2(0.17, 1.1),
    new THREE.Vector2(0.12, 1.16),
    new THREE.Vector2(0.09, 1.2),
  ];
  body.add(new THREE.Mesh(latheY(torsoProfile, 32), skin));

  const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), skin);
  pelvis.scale.set(1.15, 0.55, 0.85);
  pelvis.position.set(0, LANDMARKS.hip + 0.04, 0);
  body.add(pelvis);

  const head = new THREE.Mesh(
    new RoundedBoxGeometry(0.22, 0.26, 0.24, 6, 0.04),
    skin,
  );
  head.position.set(0, LANDMARKS.headCenter, 0.02);
  body.add(head);

  addMesh(body, new THREE.CapsuleGeometry(0.065, 0.14, 8, 14), skin, [
    0,
    LANDMARKS.neckBase - 0.04,
    0.02,
  ]);

  addMesh(body, new THREE.SphereGeometry(0.09, 16, 14), skin, [
    -0.28,
    LANDMARKS.shoulder - 0.04,
    0,
  ]);
  addMesh(body, new THREE.SphereGeometry(0.09, 16, 14), skin, [
    0.28,
    LANDMARKS.shoulder - 0.04,
    0,
  ]);

  const addLeg = (x: number) => {
    addMesh(
      body,
      new THREE.CapsuleGeometry(0.07, 0.38, 8, 14),
      skin,
      [x, LANDMARKS.knee + 0.2, 0.02],
      [0, 0, x > 0 ? -0.08 : 0.08],
    );
    addMesh(
      body,
      new THREE.CapsuleGeometry(0.055, 0.42, 8, 14),
      skin,
      [x + (x > 0 ? 0.03 : -0.03), LANDMARKS.knee - 0.15, 0.03],
      [0, 0, x > 0 ? -0.12 : 0.12],
    );
    addMesh(body, new THREE.BoxGeometry(0.1, 0.05, 0.22), skin, [
      x,
      LANDMARKS.foot + 0.02,
      0.05,
    ]);
  };
  addLeg(-0.1);
  addLeg(0.1);

  const addArm = (side: number) => {
    addMesh(
      body,
      new THREE.CapsuleGeometry(0.055, 0.32, 8, 14),
      skin,
      [side * 0.32, LANDMARKS.shoulder - 0.1, 0],
      [0, 0, side * 0.15],
    );
    addMesh(
      body,
      new THREE.CapsuleGeometry(0.045, 0.3, 8, 14),
      skin,
      [side * 0.38, LANDMARKS.midThigh, 0.02],
      [0, 0, side * 0.08],
    );
  };
  addArm(-1);
  addArm(1);

  return body;
}

function buildBrain(mat: THREE.MeshStandardMaterial): THREE.Group {
  const g = new THREE.Group();
  g.position.set(0, LANDMARKS.headCenter + 0.02, 0.01);
  tagOrgan(g, "cerebro");
  const geo = new THREE.IcosahedronGeometry(0.13, 3);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const w = 1 + Math.sin(x * 12) * 0.05 + Math.sin(y * 10) * 0.05;
    pos.setXYZ(i, x * w, y * w, z * w);
  }
  geo.computeVertexNormals();
  addMesh(g, geo, mat, [0, 0, 0]);
  return g;
}

function buildLung(side: 1 | -1, mat: THREE.MeshStandardMaterial): THREE.Group {
  const g = new THREE.Group();
  tagOrgan(g, "pulmones");
  const profile = [
    new THREE.Vector2(0.02, 0),
    new THREE.Vector2(0.09, 0.08),
    new THREE.Vector2(0.1, 0.2),
    new THREE.Vector2(0.07, 0.34),
    new THREE.Vector2(0.03, 0.38),
  ];
  const body = new THREE.Mesh(latheY(profile, 20), mat);
  body.position.set(side * 0.11, LANDMARKS.sternum - 0.18, 0.04);
  body.rotation.z = side * -0.1;
  g.add(body);
  return g;
}

function buildHeart(mat: THREE.MeshStandardMaterial): THREE.Group {
  const g = new THREE.Group();
  g.position.set(-0.05, LANDMARKS.sternum - 0.14, 0.12);
  tagOrgan(g, "corazon");
  addMesh(g, new THREE.SphereGeometry(0.055, 16, 14), mat, [-0.04, 0.05, 0]);
  addMesh(g, new THREE.SphereGeometry(0.055, 16, 14), mat, [0.04, 0.05, 0]);
  addMesh(g, new THREE.SphereGeometry(0.075, 18, 16), mat, [0, -0.02, 0], [0, 0, 0], [
    1, 1.1, 0.9,
  ]);
  addMesh(g, new THREE.CylinderGeometry(0.018, 0.022, 0.12, 10), mat, [0, 0.1, 0.02], [
    0.15, 0, 0,
  ]);
  return g;
}

function buildKidney(side: 1 | -1, mat: THREE.MeshStandardMaterial): THREE.Mesh {
  const profile = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.045, 0.02),
    new THREE.Vector2(0.065, 0.07),
    new THREE.Vector2(0.06, 0.12),
    new THREE.Vector2(0.03, 0.14),
    new THREE.Vector2(0.02, 0.08),
  ];
  const m = new THREE.Mesh(latheY(profile, 16), mat);
  m.position.set(side * 0.09, LANDMARKS.navel + 0.02, -0.07);
  m.rotation.y = side * 0.4;
  m.userData.organId = "rinones";
  return m;
}

export function buildAllOrgans(
  defs: OrganDefinition[],
): Map<string, THREE.Object3D[]> {
  const map = new Map<string, THREE.Object3D[]>();
  const byId = Object.fromEntries(defs.map((d) => [d.id, d])) as Record<
    string,
    OrganDefinition
  >;

  const m = (id: string) =>
    organMaterial(byId[id].color, byId[id].emissive);

  const add = (id: string, objs: THREE.Object3D[]) => {
    objs.forEach((o) => tagOrgan(o, id));
    map.set(id, objs);
  };

  add("cerebro", [buildBrain(m("cerebro"))]);
  add("corazon", [buildHeart(m("corazon"))]);
  add("pulmones", [buildLung(-1, m("pulmones")), buildLung(1, m("pulmones"))]);
  add("rinones", [buildKidney(-1, m("rinones")), buildKidney(1, m("rinones"))]);

  const liver = new THREE.Mesh(
    latheY(
      [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.12, 0.05),
        new THREE.Vector2(0.16, 0.12),
        new THREE.Vector2(0.1, 0.18),
      ],
      18,
    ),
    m("higado"),
  );
  liver.position.set(0.14, LANDMARKS.navel + 0.1, 0.06);
  liver.rotation.z = -0.25;
  add("higado", [liver]);

  const stomach = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 16), m("estomago"));
  stomach.position.set(-0.07, LANDMARKS.navel + 0.06, 0.1);
  stomach.scale.set(1.1, 1.2, 0.95);
  stomach.rotation.z = 0.4;
  add("estomago", [stomach]);

  const pancreas = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.035, 0.18, 6, 12),
    m("pancreas"),
  );
  pancreas.rotation.z = Math.PI / 2;
  pancreas.position.set(0, LANDMARKS.navel, 0.02);
  add("pancreas", [pancreas]);

  const intestines = new THREE.Group();
  const intestineMesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.09, 0.025, 48, 10, 2, 4),
    m("intestino"),
  );
  intestineMesh.position.set(0, LANDMARKS.hip + 0.14, 0.08);
  intestines.add(intestineMesh);
  add("intestino", [intestines]);

  const bladder = new THREE.Group();
  bladder.position.set(0, LANDMARKS.hip + 0.05, 0.09);
  addMesh(bladder, new THREE.SphereGeometry(0.07, 16, 12), m("vejiga"), [0, 0, 0]);
  add("vejiga", [bladder]);

  const repro = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), m("reproductor"));
  repro.position.set(0, LANDMARKS.hip - 0.02, 0.08);
  repro.scale.set(1.1, 0.85, 0.9);
  add("reproductor", [repro]);

  const naso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.03, 0.1, 10),
    m("nasofaringe"),
  );
  naso.position.set(0, LANDMARKS.nose - 0.02, 0.12);
  naso.rotation.x = 0.4;
  add("nasofaringe", [naso]);

  const thyroid = new THREE.Group();
  thyroid.position.set(0, LANDMARKS.neckBase - 0.05, 0.11);
  addMesh(thyroid, new THREE.BoxGeometry(0.05, 0.025, 0.03), m("tiroides"), [0, 0, 0]);
  addMesh(thyroid, new THREE.SphereGeometry(0.04, 12, 10), m("tiroides"), [-0.055, 0, 0]);
  addMesh(thyroid, new THREE.SphereGeometry(0.04, 12, 10), m("tiroides"), [0.055, 0, 0]);
  add("tiroides", [thyroid]);

  const thymus = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.1, 4), m("timo"));
  thymus.rotation.z = Math.PI;
  thymus.position.set(0, LANDMARKS.sternum - 0.06, 0.09);
  add("timo", [thymus]);

  return map;
}

export function collectPickables(objects: THREE.Object3D[]): THREE.Mesh[] {
  const list: THREE.Mesh[] = [];
  for (const root of objects) {
    root.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.userData.organId) {
        list.push(obj);
      }
    });
  }
  return list;
}

export function forEachOrganMesh(
  objects: THREE.Object3D[],
  fn: (mesh: THREE.Mesh, organId: string) => void,
): void {
  for (const root of objects) {
    root.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.userData.organId) {
        fn(obj, obj.userData.organId as string);
      }
    });
  }
}
