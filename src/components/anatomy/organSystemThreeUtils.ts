import * as THREE from "three";
import type { OrganSystemDefinition } from "./organSystemDefinitions";

export type Vec3 = [number, number, number];

export function partMaterial(
  color: number,
  emissive: number,
  opacity = 0.92,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity: 0.14,
    roughness: 0.82,
    metalness: 0.03,
    transparent: true,
    opacity,
  });
}

export function tagPart(root: THREE.Object3D, partId: string): void {
  root.userData.partId = partId;
  root.traverse((c) => {
    if (c instanceof THREE.Mesh) c.userData.partId = partId;
  });
}

export function addPart(
  parent: THREE.Object3D,
  partId: string,
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  pos: Vec3 = [0, 0, 0],
  rot: Vec3 = [0, 0, 0],
  scale: Vec3 = [1, 1, 1],
): THREE.Mesh {
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...pos);
  mesh.rotation.set(...rot);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  tagPart(mesh, partId);
  parent.add(mesh);
  return mesh;
}

export function latheY(
  profile: THREE.Vector2[],
  segments = 20,
): THREE.LatheGeometry {
  return new THREE.LatheGeometry(profile, segments);
}

export function collectPartMeshes(root: THREE.Object3D): THREE.Mesh[] {
  const list: THREE.Mesh[] = [];
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.userData.partId) list.push(obj);
  });
  return list;
}

export function disposeObject(root: THREE.Object3D): void {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      const m = obj.material;
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else m.dispose();
    }
  });
}

/** Slight hue shift per part index for visual separation */
export function partColor(
  system: OrganSystemDefinition,
  index: number,
  total: number,
): number {
  const base = new THREE.Color(system.color);
  const hsl = { h: 0, s: 0, l: 0 };
  base.getHSL(hsl);
  hsl.h = (hsl.h + (index / Math.max(total, 1)) * 0.08 - 0.04 + 1) % 1;
  hsl.l = Math.min(0.72, hsl.l + (index % 2 === 0 ? 0.04 : -0.02));
  return new THREE.Color().setHSL(hsl.h, hsl.s, hsl.l).getHex();
}
