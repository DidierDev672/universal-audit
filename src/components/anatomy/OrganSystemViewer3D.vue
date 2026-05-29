<template>
  <div class="organ-system-root flex flex-col xl:flex-row gap-4 h-full min-h-[520px]">
    <aside
      class="w-full xl:w-64 shrink-0 flex flex-col rounded-2xl border border-black/[0.08] bg-white shadow-sm overflow-hidden order-2 xl:order-1"
    >
      <header class="px-4 py-3 border-b border-black/[0.06] bg-[#f0faf6]">
        <h3 class="text-[13px] font-semibold text-[#1d1d1f]">Sistema orgánico</h3>
        <p class="text-[11px] text-[#86868b] mt-0.5">
          Selecciona un sistema y una estructura
        </p>
      </header>

      <div class="p-2 border-b border-black/[0.06]">
        <label class="sr-only" for="organ-system-select">Sistema</label>
        <select
          id="organ-system-select"
          v-model="sistemaId"
          class="w-full rounded-xl border border-black/[0.1] bg-white px-3 py-2 text-[12px] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0d9e6e]/40"
        >
          <option
            v-for="sys in ORGAN_SYSTEM_DEFINITIONS"
            :key="sys.id"
            :value="sys.id"
          >
            {{ sys.name }}
          </option>
        </select>
        <p
          v-if="sistemaActual"
          class="text-[10px] text-[#86868b] mt-2 leading-relaxed px-1"
        >
          {{ sistemaActual.description }}
        </p>
      </div>

      <ul class="flex-1 overflow-y-auto p-2 space-y-0.5 max-h-[220px] xl:max-h-none">
        <li v-for="part in partesDelSistema" :key="part.id">
          <button
            type="button"
            class="w-full text-left px-3 py-2 rounded-xl text-[11px] transition-all"
            :class="
              parteSeleccionada === part.id
                ? 'bg-[#0d9e6e] text-white shadow-sm'
                : 'text-[#3a3a3c] hover:bg-slate-50'
            "
            @click="seleccionarParte(part.id)"
          >
            {{ part.name }}
          </button>
        </li>
      </ul>

      <div
        v-if="detalleParte"
        class="px-4 py-3 border-t border-black/[0.06] bg-slate-50"
      >
        <p class="text-[12px] font-semibold text-[#1d1d1f]">
          {{ detalleParte.name }}
        </p>
        <p class="text-[11px] text-[#52525b] mt-1 leading-relaxed">
          {{ detalleParte.description }}
        </p>
      </div>
    </aside>

    <div
      ref="canvasHost"
      class="relative flex-1 min-h-[420px] rounded-2xl border border-black/[0.08] bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden shadow-inner order-1 xl:order-2"
    >
      <div
        v-if="!webglDisponible"
        class="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-slate-300"
      >
        WebGL no está disponible en este navegador.
      </div>
      <div
        v-if="sistemaActual"
        class="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-xl bg-black/40 backdrop-blur-sm px-3 py-1.5 pointer-events-none"
      >
        <span
          class="w-2.5 h-2.5 rounded-full shrink-0"
          :style="{ backgroundColor: colorCss(sistemaActual.color) }"
        />
        <span class="text-[11px] font-medium text-white/95">
          {{ sistemaActual.name }}
        </span>
      </div>
      <p
        class="absolute bottom-3 left-3 z-10 text-[10px] text-slate-400/90 pointer-events-none"
      >
        Arrastra para rotar · Rueda para zoom · Clic en estructura
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  ORGAN_SYSTEM_DEFINITIONS,
  ORGAN_SYSTEM_BY_ID,
} from "./organSystemDefinitions";
import {
  SYSTEM_CAMERA,
  buildOrganSystem,
} from "./organSystemBuilders";
import { disposeObject } from "./organSystemThreeUtils";

const canvasHost = ref<HTMLElement | null>(null);
const webglDisponible = ref(true);
const sistemaId = ref(ORGAN_SYSTEM_DEFINITIONS[0]?.id ?? "ear");
const parteSeleccionada = ref<string | null>(null);

const sistemaActual = computed(
  () => ORGAN_SYSTEM_BY_ID[sistemaId.value] ?? null,
);
const partesDelSistema = computed(() => sistemaActual.value?.parts ?? []);
const detalleParte = computed(
  () =>
    partesDelSistema.value.find((p) => p.id === parteSeleccionada.value) ??
    null,
);

const escalasBase = new Map<THREE.Mesh, THREE.Vector3>();
let pickables: THREE.Mesh[] = [];
let modeloGrupo: THREE.Group | null = null;

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
  pickables.forEach((mesh) => {
    escalasBase.set(mesh, mesh.scale.clone());
  });
}

function aplicarResaltado(partId: string | null) {
  pickables.forEach((mesh) => {
    const activo = mesh.userData.partId === partId;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = activo ? 0.65 : 0.14;
    mat.opacity = activo ? 1 : partId ? 0.55 : 0.92;
    const base = escalasBase.get(mesh);
    if (base) {
      mesh.scale.copy(base).multiplyScalar(activo ? 1.08 : 1);
    }
  });
}

function seleccionarParte(id: string) {
  parteSeleccionada.value =
    parteSeleccionada.value === id ? null : id;
  aplicarResaltado(parteSeleccionada.value);
}

function onPointerDown(event: PointerEvent) {
  if (!canvasHost.value || !camera || !raycaster) return;
  const rect = canvasHost.value.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickables, false);
  const hit = hits[0];
  if (hit) {
    const id = hit.object.userData.partId as string;
    if (id) seleccionarParte(id);
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

function aplicarCamaraSistema(id: string) {
  if (!camera || !controls) return;
  const cfg = SYSTEM_CAMERA[id] ?? SYSTEM_CAMERA.ear ?? { pos: [0.5, 0.15, 0.85] as const, target: [0, 0, 0] as const };
  camera.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
  controls.target.set(cfg.target[0], cfg.target[1], cfg.target[2]);
  controls.update();
}

function cargarSistema(id: string) {
  if (!scene) return;

  if (modeloGrupo) {
    scene.remove(modeloGrupo);
    disposeObject(modeloGrupo);
    modeloGrupo = null;
  }
  pickables = [];
  escalasBase.clear();
  parteSeleccionada.value = null;

  const sys = ORGAN_SYSTEM_BY_ID[id];
  if (!sys) return;

  const built = buildOrganSystem(sys);
  modeloGrupo = built.group;
  pickables = built.pickables;
  scene.add(modeloGrupo);
  registrarEscalas();
  aplicarCamaraSistema(id);
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
  scene.fog = new THREE.Fog(0x1a2332, 4, 12);

  camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 50);
  camera.position.set(0.5, 0.15, 0.85);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 0.35;
  controls.maxDistance = 4;

  scene.add(new THREE.AmbientLight(0xfff5eb, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1);
  key.position.set(2, 3, 2.5);
  key.castShadow = true;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xb8d4ff, 0.45);
  fill.position.set(-2, 1.5, -1.5);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffd6b0, 0.25);
  rim.position.set(0, 0.5, -2.5);
  scene.add(rim);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(1.2, 48),
    new THREE.MeshStandardMaterial({
      color: 0x243044,
      roughness: 0.92,
      metalness: 0.04,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.35;
  floor.receiveShadow = true;
  scene.add(floor);

  raycaster = new THREE.Raycaster();
  renderer.domElement.addEventListener("pointerdown", onPointerDown);

  resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(host);
  onResize();
  cargarSistema(sistemaId.value);
  animar();
}

function disposeThree() {
  cancelAnimationFrame(animationId);
  resizeObserver?.disconnect();
  if (renderer?.domElement) {
    renderer.domElement.removeEventListener("pointerdown", onPointerDown);
  }
  if (modeloGrupo) {
    disposeObject(modeloGrupo);
    modeloGrupo = null;
  }
  pickables = [];
  escalasBase.clear();
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

watch(sistemaId, (id) => {
  cargarSistema(id);
});

onMounted(() => initThree());
onUnmounted(() => disposeThree());

defineExpose({ seleccionarParte, sistemaId });
</script>

<style scoped>
.organ-system-root :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
  cursor: grab;
}
.organ-system-root :deep(canvas:active) {
  cursor: grabbing;
}
</style>
