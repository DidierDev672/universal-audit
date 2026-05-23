<template>
  <div class="human-anatomy-root flex flex-col lg:flex-row gap-4 h-full min-h-[520px]">
    <div
      ref="canvasHost"
      class="relative flex-1 min-h-[420px] rounded-2xl border border-black/[0.08] bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden shadow-inner"
    >
      <div
        v-if="!webglDisponible"
        class="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-slate-300"
      >
        WebGL no está disponible en este navegador.
      </div>
      <p
        class="absolute bottom-3 left-3 z-10 text-[10px] text-slate-400/90 pointer-events-none"
      >
        Arrastra para rotar · Rueda para zoom · Clic en órgano
      </p>
    </div>

    <aside
      class="w-full lg:w-72 shrink-0 flex flex-col rounded-2xl border border-black/[0.08] bg-white shadow-sm overflow-hidden"
    >
      <header class="px-4 py-3 border-b border-black/[0.06] bg-[#f0faf6]">
        <h3 class="text-[13px] font-semibold text-[#1d1d1f]">Órganos</h3>
        <p class="text-[11px] text-[#86868b] mt-0.5">
          Modelo anatómico estilizado · Clic para resaltar
        </p>
      </header>

      <ul class="flex-1 overflow-y-auto p-2 space-y-1 max-h-[360px] lg:max-h-none">
        <li v-for="org in ORGAN_DEFINITIONS" :key="org.id">
          <button
            type="button"
            class="w-full text-left px-3 py-2.5 rounded-xl text-[12px] transition-all flex items-center gap-2.5"
            :class="
              organoSeleccionado === org.id
                ? 'bg-[#0d9e6e] text-white shadow-sm'
                : 'text-[#3a3a3c] hover:bg-slate-50'
            "
            @click="seleccionarOrgano(org.id)"
          >
            <span
              class="w-3 h-3 rounded-full shrink-0 border border-black/10"
              :style="{ backgroundColor: colorCss(org.color) }"
            />
            <span class="font-medium">{{ org.name }}</span>
          </button>
        </li>
      </ul>

      <div
        v-if="detalleOrgano"
        class="px-4 py-3 border-t border-black/[0.06] bg-slate-50"
      >
        <p class="text-[12px] font-semibold text-[#1d1d1f]">
          {{ detalleOrgano.name }}
        </p>
        <p class="text-[11px] text-[#52525b] mt-1 leading-relaxed">
          {{ detalleOrgano.description }}
        </p>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ORGAN_DEFINITIONS } from "./organDefinitions";
import {
  ORGAN_FOCUS,
  buildAllOrgans,
  buildHumanBody,
  collectPickables,
  forEachOrganMesh,
} from "./humanAnatomyBuilders";

const canvasHost = ref<HTMLElement | null>(null);
const webglDisponible = ref(true);
const organoSeleccionado = ref<string | null>(null);

const detalleOrgano = computed(() =>
  ORGAN_DEFINITIONS.find((o) => o.id === organoSeleccionado.value) ?? null,
);

const objetosPorOrgano = shallowRef<Map<string, THREE.Object3D[]>>(new Map());
const escalasBase = new Map<THREE.Mesh, THREE.Vector3>();
let pickables: THREE.Mesh[] = [];
let cuerpoGrupo: THREE.Group | null = null;

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let controls: OrbitControls | null = null;
let animationId = 0;
let raycaster: THREE.Raycaster | null = null;
const pointer = new THREE.Vector2();
let resizeObserver: ResizeObserver | null = null;

function colorCss(hex: number): string {
  return `#${hex.toString(16).padStart(6, "0")}`;
}

function registrarEscalas() {
  escalasBase.clear();
  objetosPorOrgano.value.forEach((objs) => {
    forEachOrganMesh(objs, (mesh) => {
      escalasBase.set(mesh, mesh.scale.clone());
    });
  });
}

function aplicarResaltado(id: string | null) {
  objetosPorOrgano.value.forEach((objs) => {
    forEachOrganMesh(objs, (mesh, organId) => {
      const activo = organId === id;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = activo ? 0.55 : 0.12;
      mat.opacity = activo ? 1 : 0.94;
      mat.transparent = true;
      const base = escalasBase.get(mesh);
      if (base) {
        mesh.scale.copy(base).multiplyScalar(activo ? 1.06 : 1);
      }
    });
  });

  if (cuerpoGrupo) {
    cuerpoGrupo.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mat = obj.material as THREE.MeshStandardMaterial;
        mat.opacity = id ? 0.18 : 0.32;
      }
    });
  }
}

function seleccionarOrgano(id: string) {
  organoSeleccionado.value =
    organoSeleccionado.value === id ? null : id;
  aplicarResaltado(organoSeleccionado.value);

  if (organoSeleccionado.value && camera && controls) {
    const focus = ORGAN_FOCUS[id];
    if (focus) {
      controls.target.set(focus[0], focus[1], focus[2]);
    }
  }
}

function onPointerDown(event: PointerEvent) {
  if (!canvasHost.value || !camera || !raycaster) return;
  const rect = canvasHost.value.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickables, false);
  if (hits.length > 0) {
    const id = hits[0].object.userData.organId as string;
    if (id) seleccionarOrgano(id);
  }
}

function animar() {
  animationId = requestAnimationFrame(animar);
  controls?.update();
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function onResize() {
  if (!canvasHost.value || !camera || !renderer) return;
  const w = canvasHost.value.clientWidth;
  const h = canvasHost.value.clientHeight;
  if (w === 0 || h === 0) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      const m = obj.material;
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else m.dispose();
    }
  });
}

function initThree() {
  const host = canvasHost.value;
  if (!host) return;

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    webglDisponible.value = false;
    return;
  }

  const w = host.clientWidth || 640;
  const h = host.clientHeight || 480;
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  host.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a2332);
  scene.fog = new THREE.Fog(0x1a2332, 5, 14);

  camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 50);
  camera.position.set(0.15, 0.92, 2.65);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.target.set(0, 0.88, 0);
  controls.minDistance = 1.4;
  controls.maxDistance = 5;
  controls.maxPolarAngle = Math.PI * 0.92;

  scene.add(new THREE.AmbientLight(0xfff5eb, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 0.95);
  key.position.set(2.5, 4, 3);
  key.castShadow = true;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xb8d4ff, 0.4);
  fill.position.set(-2.5, 2, -2);
  scene.add(fill);
  const back = new THREE.DirectionalLight(0xffd6b0, 0.2);
  back.position.set(0, 1.5, -3);
  scene.add(back);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(1.8, 48),
    new THREE.MeshStandardMaterial({
      color: 0x243044,
      roughness: 0.9,
      metalness: 0.05,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.02;
  floor.receiveShadow = true;
  scene.add(floor);

  cuerpoGrupo = buildHumanBody();
  scene.add(cuerpoGrupo);

  const mapa = buildAllOrgans(ORGAN_DEFINITIONS);
  const grupoOrganos = new THREE.Group();
  mapa.forEach((objs) => {
    objs.forEach((o) => {
      o.traverse((child) => {
        if (child instanceof THREE.Mesh) child.castShadow = true;
      });
      grupoOrganos.add(o);
    });
  });
  scene.add(grupoOrganos);
  objetosPorOrgano.value = mapa;

  const allObjs: THREE.Object3D[] = [];
  mapa.forEach((list) => allObjs.push(...list));
  pickables = collectPickables(allObjs);
  registrarEscalas();

  raycaster = new THREE.Raycaster();
  renderer.domElement.addEventListener("pointerdown", onPointerDown);

  resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(host);
  onResize();
  animar();
}

function disposeThree() {
  cancelAnimationFrame(animationId);
  resizeObserver?.disconnect();
  if (renderer?.domElement) {
    renderer.domElement.removeEventListener("pointerdown", onPointerDown);
  }

  objetosPorOrgano.value.forEach((objs) => {
    objs.forEach((o) => disposeObject(o));
  });
  objetosPorOrgano.value.clear();
  if (cuerpoGrupo) {
    disposeObject(cuerpoGrupo);
    cuerpoGrupo = null;
  }
  escalasBase.clear();
  pickables = [];

  controls?.dispose();
  renderer?.dispose();
  if (renderer?.domElement.parentElement) {
    renderer.domElement.parentElement.removeChild(renderer.domElement);
  }
  renderer = null;
  scene = null;
  camera = null;
  controls = null;
  raycaster = null;
}

onMounted(() => initThree());
onUnmounted(() => disposeThree());

defineExpose({ seleccionarOrgano });
</script>

<style scoped>
.human-anatomy-root :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
  cursor: grab;
}
.human-anatomy-root :deep(canvas:active) {
  cursor: grabbing;
}
</style>
