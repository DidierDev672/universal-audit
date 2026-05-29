import * as THREE from "three";
import type { OrganSystemDefinition } from "./organSystemDefinitions";
import {
  addPart,
  collectPartMeshes,
  latheY,
  partColor,
  partMaterial,
  type Vec3,
} from "./organSystemThreeUtils";

type PartBuilder = (
  g: THREE.Group,
  sys: OrganSystemDefinition,
  mat: (partId: string, index: number) => THREE.MeshStandardMaterial,
) => void;

const builders: Record<string, PartBuilder> = {
  ear(g, sys, matFn) {
    const m = (id: string, i: number) => matFn(id, i);
    addPart(g, "auricle", new THREE.TorusGeometry(0.22, 0.04, 12, 32, Math.PI * 1.35), m("auricle", 0), [0, 0.05, 0], [0, 0, 0.2]);
    addPart(g, "helix", new THREE.TorusGeometry(0.2, 0.025, 10, 28, Math.PI * 1.2), m("helix", 1), [0, 0.06, 0.01], [0, 0, 0.15]);
    addPart(g, "antihelix", new THREE.TorusGeometry(0.14, 0.018, 8, 20, Math.PI), m("antihelix", 2), [0.04, 0.02, 0.05], [0, 0.3, 0]);
    addPart(g, "concha", new THREE.SphereGeometry(0.1, 16, 12), m("concha", 3), [0, -0.02, 0.04], [0, 0, 0], [1, 1.1, 0.6]);
    addPart(g, "auditory_ring", new THREE.TorusGeometry(0.08, 0.012, 8, 24), m("auditory_ring", 4), [0, -0.08, 0.06]);
    addPart(g, "cartilage", new THREE.CylinderGeometry(0.09, 0.07, 0.04, 14), m("cartilage", 5), [0, -0.1, 0.05]);
    addPart(g, "auditory_canal", new THREE.CylinderGeometry(0.035, 0.05, 0.18, 12), m("auditory_canal", 6), [0, -0.02, 0.12], [1.45, 0, 0]);
    addPart(g, "tympanic_membrane", new THREE.CircleGeometry(0.04, 16), m("tympanic_membrane", 7), [0, 0, 0.2], [0, 0, 0]);
    addPart(g, "tympanic_cavity", new THREE.SphereGeometry(0.06, 14, 12), m("tympanic_cavity", 8), [0, 0, 0.22], [0, 0, 0], [1, 0.8, 0.7]);
    addPart(g, "malleus", new THREE.CapsuleGeometry(0.012, 0.05, 4, 8), m("malleus", 9), [0.02, 0.02, 0.24], [0.5, 0, 0.3]);
    addPart(g, "incus", new THREE.BoxGeometry(0.04, 0.02, 0.025), m("incus", 10), [0, 0.04, 0.25]);
    addPart(g, "stapes", new THREE.ConeGeometry(0.015, 0.04, 6), m("stapes", 11), [-0.02, 0.02, 0.26], [0.4, 0, 0]);
    addPart(g, "eustachian_tube", new THREE.CylinderGeometry(0.012, 0.012, 0.2, 8), m("eustachian_tube", 12), [0.06, -0.12, 0.1], [0.8, 0, -0.4]);
    addPart(g, "temporal_bone", new THREE.BoxGeometry(0.14, 0.2, 0.08), m("temporal_bone", 13), [-0.08, -0.05, -0.02], [0, 0, -0.2]);
    addPart(g, "muscle", new THREE.CapsuleGeometry(0.02, 0.12, 4, 8), m("muscle", 14), [-0.05, -0.15, 0], [0.3, 0, 0.5]);
    addPart(g, "semicircular_canals", new THREE.TorusGeometry(0.07, 0.01, 6, 16), m("semicircular_canals", 15), [-0.1, 0.08, -0.02], [0.6, 0, 0.8]);
    addPart(g, "cochlea", latheY([new THREE.Vector2(0.01, 0), new THREE.Vector2(0.045, 0.04), new THREE.Vector2(0.04, 0.1), new THREE.Vector2(0.02, 0.12)], 16), m("cochlea", 16), [-0.12, -0.02, -0.04], [0, 0, -1.2]);
    addPart(g, "vestibular_nerve", new THREE.CylinderGeometry(0.008, 0.008, 0.14, 6), m("vestibular_nerve", 17), [-0.14, 0.05, -0.06], [0.5, 0, 0.2]);
  },

  brain(g, _sys, matFn) {
    const shell = addPart(g, "frontal_cortex", new THREE.IcosahedronGeometry(0.42, 2), matFn("frontal_cortex", 0), [0, 0.08, 0]);
    const posAttr = shell.geometry.attributes.position;
    if (posAttr) {
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const z = posAttr.getZ(i);
        const w = 1 + Math.sin(x * 8) * 0.06 + Math.sin(y * 7) * 0.05;
        posAttr.setXYZ(i, x * w, y * w, z * w);
      }
      shell.geometry.computeVertexNormals();
    }
    addPart(g, "corpus_callosum", new THREE.CapsuleGeometry(0.04, 0.28, 6, 12), matFn("corpus_callosum", 1), [0, 0.12, 0], [0, 0, Math.PI / 2]);
    addPart(g, "thalamus", new THREE.SphereGeometry(0.08, 14, 12), matFn("thalamus", 2), [0, 0, 0.02], [0, 0, 0], [1.2, 0.9, 1]);
    addPart(g, "hippocampus", new THREE.CapsuleGeometry(0.03, 0.14, 6, 10), matFn("hippocampus", 3), [-0.12, -0.06, 0.04], [0, 0, 0.5]);
    addPart(g, "amygdala", new THREE.SphereGeometry(0.045, 12, 10), matFn("amygdala", 4), [-0.1, -0.1, 0.08]);
    addPart(g, "fornix", new THREE.TorusGeometry(0.06, 0.012, 8, 20, Math.PI), matFn("fornix", 5), [0, 0.05, -0.02], [0.8, 0, 0]);
    addPart(g, "cingulate_cortex", new THREE.TorusGeometry(0.35, 0.025, 12, 32), matFn("cingulate_cortex", 6), [0, 0.1, 0], [0.4, 0, 0]);
    addPart(g, "stria_terminalis", new THREE.CylinderGeometry(0.008, 0.008, 0.22, 6), matFn("stria_terminalis", 7), [0.14, 0, 0], [0, 0, -0.3]);
    addPart(g, "mammillary_bodies", new THREE.SphereGeometry(0.025, 10, 8), matFn("mammillary_bodies", 8), [0.04, -0.14, 0.1]);
    addPart(g, "olfactory_bulb", new THREE.SphereGeometry(0.06, 12, 10), matFn("olfactory_bulb", 9), [0, 0.2, 0.18], [0, 0, 0], [1.4, 1, 0.9]);
    addPart(g, "septum", new THREE.BoxGeometry(0.04, 0.12, 0.02), matFn("septum", 10), [0, 0, 0.12]);
  },

  eyes(g, sys, matFn) {
    addPart(g, "sclera", new THREE.SphereGeometry(0.2, 24, 20), matFn("sclera", 0), [0, 0, 0], [0, 0, 0], [1, 1, 0.85]);
    addPart(g, "choroid", new THREE.SphereGeometry(0.18, 20, 16), matFn("choroid", 1), [0, 0, 0.01], [0, 0, 0], [1, 1, 0.82]);
    addPart(g, "retina", new THREE.SphereGeometry(0.17, 18, 14), matFn("retina", 2), [0, 0, 0.02], [0, 0, 0], [1, 1, 0.75]);
    addPart(g, "cornea", new THREE.SphereGeometry(0.09, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2), matFn("cornea", 3), [0, 0, 0.14], [0, 0, 0], [1, 1, 0.5]);
    addPart(g, "iris", new THREE.TorusGeometry(0.055, 0.015, 12, 32), matFn("iris", 4), [0, 0, 0.17]);
    addPart(g, "pupil", new THREE.CircleGeometry(0.035, 16), matFn("pupil", 5), [0, 0, 0.175]);
    addPart(g, "aqueous_humor", new THREE.SphereGeometry(0.07, 14, 12), matFn("aqueous_humor", 6), [0, 0, 0.12], [0, 0, 0], [1, 1, 0.4]);
    addPart(g, "ciliary_body", new THREE.TorusGeometry(0.08, 0.012, 10, 24), matFn("ciliary_body", 7), [0, 0, 0.1]);
    addPart(g, "macula", new THREE.SphereGeometry(0.02, 10, 8), matFn("macula", 8), [0, -0.04, 0.14]);
    addPart(g, "blood_vessels", new THREE.TorusKnotGeometry(0.06, 0.006, 32, 6, 2, 3), matFn("blood_vessels", 9), [0, 0.02, 0.08]);
    addPart(g, "optic_nerve", new THREE.CylinderGeometry(0.025, 0.035, 0.22, 10), matFn("optic_nerve", 10), [0, 0, -0.18], [1.4, 0, 0]);
    addPart(g, "conjunctiva", new THREE.SphereGeometry(0.205, 16, 12, 0, Math.PI * 2, 0, Math.PI / 3), matFn("conjunctiva", 11), [0, -0.02, 0.05], [0.3, 0, 0]);
  },

  nose(g, sys, matFn) {
    addPart(g, "external_nose", latheY([new THREE.Vector2(0.02, 0), new THREE.Vector2(0.06, 0.08), new THREE.Vector2(0.05, 0.16), new THREE.Vector2(0.03, 0.2)], 14), matFn("external_nose", 0), [0, -0.05, 0.08], [1.5, 0, 0]);
    addPart(g, "nostrils", new THREE.TorusGeometry(0.035, 0.012, 8, 16), matFn("nostrils", 1), [-0.04, -0.12, 0.1], [1.4, 0, 0]);
    addPart(g, "septum", new THREE.BoxGeometry(0.02, 0.18, 0.08), matFn("septum", 2), [0, 0, 0.02]);
    addPart(g, "nasal_fossa", new THREE.BoxGeometry(0.14, 0.12, 0.1), matFn("nasal_fossa", 3), [0, 0.02, 0], [0, 0, 0], [1, 1, 0.6]);
    addPart(g, "frontal_sinus", new THREE.SphereGeometry(0.05, 12, 10), matFn("frontal_sinus", 4), [0, 0.14, -0.02], [0, 0, 0], [1.2, 0.7, 0.8]);
    addPart(g, "ethmoid_sinus", new THREE.BoxGeometry(0.06, 0.05, 0.08), matFn("ethmoid_sinus", 5), [0, 0.06, -0.04]);
    addPart(g, "maxillary_sinus", new THREE.SphereGeometry(0.06, 12, 10), matFn("maxillary_sinus", 6), [0.08, -0.06, 0], [0, 0, 0], [1, 0.9, 1.1]);
  },

  neck(g, sys, matFn) {
    addPart(g, "sternocleidomastoid", new THREE.CapsuleGeometry(0.04, 0.35, 6, 12), matFn("sternocleidomastoid", 0), [0.1, 0, 0.04], [0, 0, -0.25]);
    addPart(g, "trapezius", new THREE.BoxGeometry(0.35, 0.08, 0.06), matFn("trapezius", 1), [0, 0.18, -0.06], [0.2, 0, 0]);
    addPart(g, "scalenes", new THREE.CapsuleGeometry(0.025, 0.2, 4, 8), matFn("scalenes", 2), [-0.06, 0, 0.02], [0, 0, 0.15]);
    addPart(g, "levator_scapulae", new THREE.CapsuleGeometry(0.03, 0.18, 4, 8), matFn("levator_scapulae", 3), [-0.12, 0.05, -0.04], [0, 0, 0.35]);
    addPart(g, "splenius_capitis", new THREE.CapsuleGeometry(0.035, 0.22, 6, 10), matFn("splenius_capitis", 4), [0, 0.08, -0.1], [0.3, 0, 0]);
    addPart(g, "semispinalis_cervicis", new THREE.BoxGeometry(0.06, 0.28, 0.04), matFn("semispinalis_cervicis", 5), [0, 0, -0.08]);
    addPart(g, "sternohyoid", new THREE.CapsuleGeometry(0.02, 0.16, 4, 8), matFn("sternohyoid", 6), [0.04, -0.12, 0.06], [0.4, 0, 0]);
    addPart(g, "omohyoid", new THREE.TorusGeometry(0.08, 0.015, 8, 20, Math.PI * 0.7), matFn("omohyoid", 7), [-0.08, -0.05, 0.04], [0, 0.5, 0]);
  },

  lung(g, sys, matFn) {
    addPart(g, "trachea", new THREE.CylinderGeometry(0.05, 0.055, 0.35, 14), matFn("trachea", 0), [0, 0.28, 0]);
    addPart(g, "carina", new THREE.ConeGeometry(0.04, 0.06, 4), matFn("carina", 1), [0, 0.08, 0], [Math.PI, 0, 0]);
    const lobe = (id: string, i: number, x: number, y: number, s: Vec3) =>
      addPart(g, id, latheY([new THREE.Vector2(0.02, 0), new THREE.Vector2(0.1, 0.1), new THREE.Vector2(0.09, 0.22), new THREE.Vector2(0.04, 0.28)], 18), matFn(id, i), [x, y, 0.04], [0, 0, x > 0 ? -0.1 : 0.1], s);
    lobe("superior_lobe_right", 2, 0.2, 0.02, [1, 1, 1]);
    lobe("middle_lobe", 5, 0.22, -0.12, [0.85, 0.9, 1]);
    lobe("inferior_lobe", 4, 0.2, -0.28, [1, 1.1, 1]);
    lobe("superior_lobe_left", 7, -0.2, 0.02, [1, 1, 1]);
    addPart(g, "oblique_fissure", new THREE.PlaneGeometry(0.02, 0.35), matFn("oblique_fissure", 3), [0.12, -0.08, 0.06], [0, 0.4, 0]);
    addPart(g, "horizontal_fissure", new THREE.PlaneGeometry(0.18, 0.02), matFn("horizontal_fissure", 6), [0.18, -0.05, 0.06]);
  },

  digestive(g, sys, matFn) {
    addPart(g, "liver", latheY([new THREE.Vector2(0, 0), new THREE.Vector2(0.2, 0.08), new THREE.Vector2(0.28, 0.18), new THREE.Vector2(0.15, 0.28)], 20), matFn("liver", 0), [0.15, 0.12, 0], [0, 0, -0.3]);
    addPart(g, "esophagus", new THREE.CylinderGeometry(0.035, 0.04, 0.28, 10), matFn("esophagus", 1), [0, 0.35, 0.02]);
    addPart(g, "stomach", new THREE.SphereGeometry(0.14, 18, 14), matFn("stomach", 2), [-0.1, 0.05, 0.08], [0, 0, 0.4], [1.1, 1.2, 0.9]);
    addPart(g, "duodenum", new THREE.TorusGeometry(0.08, 0.025, 10, 24, Math.PI * 0.8), matFn("duodenum", 3), [0.05, -0.02, 0.05], [0.8, 0, 0]);
    addPart(g, "small_intestine", new THREE.TorusKnotGeometry(0.12, 0.028, 64, 10, 2, 5), matFn("small_intestine", 4), [0, -0.15, 0.06]);
    addPart(g, "cecum", new THREE.SphereGeometry(0.08, 14, 12), matFn("cecum", 5), [-0.12, -0.22, 0.04]);
    addPart(g, "appendix", new THREE.CylinderGeometry(0.012, 0.008, 0.12, 8), matFn("appendix", 6), [-0.18, -0.26, 0.02], [0, 0, 0.6]);
    addPart(g, "colon", new THREE.TorusGeometry(0.2, 0.04, 12, 32), matFn("colon", 7), [0, -0.18, 0.02]);
  },

  heart(g, sys, matFn) {
    addPart(g, "pericardium", new THREE.SphereGeometry(0.32, 20, 16), matFn("pericardium", 0), [0, 0, 0], [0, 0, 0], [1, 1.05, 0.9]);
    addPart(g, "right_atrium", new THREE.SphereGeometry(0.1, 16, 14), matFn("right_atrium", 1), [0.1, 0.1, 0]);
    addPart(g, "left_atrium", new THREE.SphereGeometry(0.1, 16, 14), matFn("left_atrium", 2), [-0.1, 0.1, 0]);
    addPart(g, "right_ventricle", new THREE.SphereGeometry(0.12, 16, 14), matFn("right_ventricle", 3), [0.08, -0.08, 0.02], [0, 0, 0], [1, 1.15, 0.95]);
    addPart(g, "left_ventricle", new THREE.SphereGeometry(0.13, 16, 14), matFn("left_ventricle", 4), [-0.1, -0.1, 0.02], [0, 0, 0], [1, 1.2, 1]);
    addPart(g, "mitral_valve", new THREE.TorusGeometry(0.05, 0.008, 8, 20), matFn("mitral_valve", 5), [-0.02, 0.02, 0.08]);
    addPart(g, "tricuspid_valve", new THREE.TorusGeometry(0.05, 0.008, 8, 20), matFn("tricuspid_valve", 6), [0.04, 0.02, 0.08]);
    addPart(g, "aortic_valve", new THREE.CylinderGeometry(0.03, 0.03, 0.02, 10), matFn("aortic_valve", 7), [-0.02, 0.14, 0.04]);
    addPart(g, "pulmonary_valve", new THREE.CylinderGeometry(0.028, 0.028, 0.02, 10), matFn("pulmonary_valve", 8), [0.06, 0.14, 0.02]);
    addPart(g, "aorta", new THREE.CylinderGeometry(0.04, 0.05, 0.22, 12), matFn("aorta", 9), [-0.02, 0.22, 0.02], [0.15, 0, 0]);
    addPart(g, "pulmonary_trunk", new THREE.CylinderGeometry(0.035, 0.04, 0.14, 10), matFn("pulmonary_trunk", 10), [0.08, 0.18, 0], [0.4, 0, 0]);
    addPart(g, "pulmonary_artery", new THREE.CylinderGeometry(0.025, 0.03, 0.12, 10), matFn("pulmonary_artery", 11), [0.12, 0.12, 0.04], [0.3, 0, 0.5]);
    addPart(g, "pulmonary_veins", new THREE.CylinderGeometry(0.02, 0.022, 0.1, 8), matFn("pulmonary_veins", 12), [-0.14, 0.08, -0.04], [0, 0, -0.4]);
    addPart(g, "superior_vena_cava", new THREE.CylinderGeometry(0.035, 0.038, 0.18, 10), matFn("superior_vena_cava", 13), [0.12, 0.2, -0.02]);
  },

  thyroid(g, sys, matFn) {
    addPart(g, "trachea", new THREE.CylinderGeometry(0.06, 0.065, 0.4, 14), matFn("trachea", 0), [0, -0.05, 0]);
    addPart(g, "larynx", new THREE.CylinderGeometry(0.07, 0.08, 0.12, 12), matFn("larynx", 1), [0, 0.22, 0]);
    addPart(g, "thyroid_gland", new THREE.SphereGeometry(0.07, 14, 12), matFn("thyroid_gland", 2), [-0.09, 0.08, 0.04]);
    addPart(g, "gland", new THREE.SphereGeometry(0.07, 14, 12), matFn("gland", 3), [0.09, 0.08, 0.04]);
  },

  stomach(g, sys, matFn) {
    const body = latheY([new THREE.Vector2(0.05, 0), new THREE.Vector2(0.14, 0.1), new THREE.Vector2(0.15, 0.22), new THREE.Vector2(0.1, 0.32), new THREE.Vector2(0.06, 0.36)], 22);
    addPart(g, "body", body, matFn("body", 0), [0, 0, 0]);
    addPart(g, "fundus", new THREE.SphereGeometry(0.12, 16, 14), matFn("fundus", 1), [0, 0.2, -0.02], [0, 0, 0], [1.1, 0.9, 1]);
    addPart(g, "cardia", new THREE.CylinderGeometry(0.05, 0.06, 0.08, 12), matFn("cardia", 2), [0, 0.28, 0.02], [0.3, 0, 0]);
    addPart(g, "antrum", new THREE.SphereGeometry(0.1, 14, 12), matFn("antrum", 3), [0, -0.18, 0.04], [0, 0, 0], [1, 0.85, 1]);
    addPart(g, "pyloric_canal", new THREE.CylinderGeometry(0.035, 0.03, 0.1, 10), matFn("pyloric_canal", 4), [0, -0.3, 0.06], [0.2, 0, 0]);
  },

  male_reproductive(g, sys, matFn) {
    addPart(g, "bladder", new THREE.SphereGeometry(0.12, 16, 14), matFn("bladder", 0), [0, 0.2, 0], [0, 0, 0], [1.1, 0.9, 1]);
    addPart(g, "prostate_gland", new THREE.SphereGeometry(0.06, 14, 12), matFn("prostate_gland", 1), [0, 0.02, 0.04]);
    addPart(g, "seminal_vesicle", new THREE.CapsuleGeometry(0.04, 0.1, 6, 10), matFn("seminal_vesicle", 2), [-0.1, 0.08, -0.02], [0, 0, 0.4]);
    addPart(g, "vas_deferens", new THREE.CylinderGeometry(0.015, 0.015, 0.28, 8), matFn("vas_deferens", 3), [0.08, 0.1, 0], [0.2, 0, -0.3]);
    addPart(g, "ejaculatory_duct", new THREE.CylinderGeometry(0.012, 0.012, 0.08, 8), matFn("ejaculatory_duct", 4), [0, -0.02, 0.06]);
    addPart(g, "urethra", new THREE.CylinderGeometry(0.012, 0.01, 0.22, 8), matFn("urethra", 5), [0, -0.12, 0.06]);
    addPart(g, "penis", new THREE.CapsuleGeometry(0.035, 0.14, 8, 14), matFn("penis", 6), [0, -0.28, 0.08], [0.3, 0, 0]);
    addPart(g, "testicle", new THREE.SphereGeometry(0.05, 14, 12), matFn("testicle", 7), [0.07, -0.32, 0.02]);
    addPart(g, "rectum", new THREE.CylinderGeometry(0.06, 0.055, 0.2, 12), matFn("rectum", 8), [-0.1, -0.05, -0.06]);
    addPart(g, "ureter", new THREE.CylinderGeometry(0.015, 0.015, 0.2, 8), matFn("ureter", 9), [-0.08, 0.18, -0.02], [0.2, 0, 0.3]);
  },

  female_reproductive(g, sys, matFn) {
    addPart(g, "uterus", latheY([new THREE.Vector2(0.04, 0), new THREE.Vector2(0.09, 0.12), new THREE.Vector2(0.08, 0.22), new THREE.Vector2(0.05, 0.28)], 18), matFn("uterus", 0), [0, 0.05, 0]);
    addPart(g, "myometrium", new THREE.SphereGeometry(0.11, 16, 14), matFn("myometrium", 1), [0, 0.08, 0], [0, 0, 0], [1.05, 1.1, 0.95]);
    addPart(g, "endometrium", new THREE.SphereGeometry(0.08, 14, 12), matFn("endometrium", 2), [0, 0.1, 0.02]);
    addPart(g, "cervix", new THREE.CylinderGeometry(0.045, 0.05, 0.08, 12), matFn("cervix", 3), [0, -0.12, 0.02]);
    addPart(g, "vagina", new THREE.CylinderGeometry(0.04, 0.045, 0.18, 12), matFn("vagina", 4), [0, -0.24, 0.04]);
    addPart(g, "ovary", new THREE.SphereGeometry(0.05, 14, 12), matFn("ovary", 5), [-0.14, 0.12, 0]);
    addPart(g, "fallopian_tube", new THREE.TorusGeometry(0.1, 0.015, 8, 24, Math.PI * 0.9), matFn("fallopian_tube", 6), [-0.1, 0.18, 0], [0, 0, 0.8]);
  },

  bladder(g, sys, matFn) {
    addPart(g, "muscular_layers", new THREE.SphereGeometry(0.18, 18, 14), matFn("muscular_layers", 0), [0, 0, 0], [0, 0, 0], [1, 0.85, 1]);
    addPart(g, "mucosa", new THREE.SphereGeometry(0.15, 16, 12), matFn("mucosa", 1), [0, 0.01, 0.01], [0, 0, 0], [1, 0.8, 0.95]);
    addPart(g, "trigone", new THREE.CircleGeometry(0.06, 12), matFn("trigone", 2), [0, -0.06, 0.14], [1.2, 0, 0]);
    addPart(g, "neck", new THREE.CylinderGeometry(0.05, 0.06, 0.08, 12), matFn("neck", 3), [0, -0.14, 0.06]);
    addPart(g, "urethra", new THREE.CylinderGeometry(0.02, 0.018, 0.14, 10), matFn("urethra", 4), [0, -0.22, 0.08]);
    addPart(g, "ureter", new THREE.CylinderGeometry(0.015, 0.015, 0.2, 8), matFn("ureter", 5), [-0.1, 0.1, -0.02], [0.3, 0, 0.4]);
    addPart(g, "urethral_openings", new THREE.SphereGeometry(0.02, 10, 8), matFn("urethral_openings", 6), [0, -0.2, 0.1]);
    addPart(g, "fat_layer", new THREE.SphereGeometry(0.22, 16, 12), matFn("fat_layer", 7), [0, 0, -0.02], [0, 0, 0], [1, 0.75, 1]);
  },

  pancreas(g, sys, matFn) {
    addPart(g, "head", new THREE.SphereGeometry(0.08, 14, 12), matFn("head", 0), [0.14, 0, 0]);
    addPart(g, "body", new THREE.CapsuleGeometry(0.05, 0.2, 6, 12), matFn("body", 1), [0, 0, 0], [0, 0, Math.PI / 2]);
    addPart(g, "tail", new THREE.CapsuleGeometry(0.035, 0.14, 6, 10), matFn("tail", 2), [-0.2, 0.02, 0], [0, 0, Math.PI / 2]);
    addPart(g, "pancreatic_duct", new THREE.CylinderGeometry(0.01, 0.01, 0.32, 8), matFn("pancreatic_duct", 3), [0, -0.02, 0.04]);
    addPart(g, "common_bile_duct", new THREE.CylinderGeometry(0.012, 0.012, 0.18, 8), matFn("common_bile_duct", 4), [0.1, -0.06, 0.06], [0.4, 0, 0]);
    addPart(g, "duodenum", new THREE.TorusGeometry(0.09, 0.025, 10, 24, Math.PI * 0.7), matFn("duodenum", 5), [0.12, -0.08, 0.04], [0.9, 0, 0]);
    addPart(g, "small_intestine", new THREE.TorusKnotGeometry(0.08, 0.02, 48, 8, 2, 3), matFn("small_intestine", 6), [-0.05, -0.14, 0.06]);
  },

  kidneys(g, sys, matFn) {
    const kidneyGeo = latheY(
      [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.08, 0.03),
        new THREE.Vector2(0.11, 0.1),
        new THREE.Vector2(0.1, 0.18),
        new THREE.Vector2(0.05, 0.2),
        new THREE.Vector2(0.03, 0.12),
      ],
      18,
    );
    addPart(g, "unfiltered_blood", kidneyGeo, matFn("unfiltered_blood", 0), [-0.12, 0.04, 0], [0, 0, 0.25]);
    addPart(g, "filtered_blood", kidneyGeo, matFn("filtered_blood", 1), [0.12, 0.04, 0], [0, 0, -0.25]);
    addPart(g, "unfiltered_blood", new THREE.CylinderGeometry(0.02, 0.025, 0.2, 8), matFn("unfiltered_blood", 0), [-0.2, 0.14, 0.02], [0, 0, 0.5]);
    addPart(g, "filtered_blood", new THREE.CylinderGeometry(0.02, 0.022, 0.18, 8), matFn("filtered_blood", 1), [0.2, 0.1, 0.04], [0, 0, -0.35]);
    addPart(g, "ureter", new THREE.CylinderGeometry(0.018, 0.018, 0.28, 8), matFn("ureter", 2), [0, -0.2, 0.04]);
    addPart(g, "urine_to_bladder", new THREE.CylinderGeometry(0.015, 0.012, 0.22, 8), matFn("urine_to_bladder", 3), [0.05, -0.34, 0.06], [0.15, 0, 0]);
  },

  liver(g, sys, matFn) {
    addPart(g, "right_lobe", latheY([new THREE.Vector2(0, 0), new THREE.Vector2(0.22, 0.1), new THREE.Vector2(0.28, 0.2), new THREE.Vector2(0.18, 0.32)], 22), matFn("right_lobe", 0), [0.12, 0, 0], [0, 0, -0.15]);
    addPart(g, "left_lobe", latheY([new THREE.Vector2(0, 0), new THREE.Vector2(0.12, 0.08), new THREE.Vector2(0.14, 0.16)], 18), matFn("left_lobe", 1), [-0.14, 0.06, 0], [0, 0, 0.2]);
    addPart(g, "gallbladder", new THREE.SphereGeometry(0.05, 12, 10), matFn("gallbladder", 2), [0.05, -0.08, 0.1]);
    addPart(g, "common_hepatic_duct", new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8), matFn("common_hepatic_duct", 3), [0.02, -0.1, 0.08], [0.3, 0, 0]);
    addPart(g, "stomach", new THREE.SphereGeometry(0.09, 14, 12), matFn("stomach", 4), [-0.18, 0.02, 0.06], [0, 0, 0.3]);
    addPart(g, "pancreas", new THREE.CapsuleGeometry(0.03, 0.14, 6, 10), matFn("pancreas", 5), [-0.05, -0.06, 0.04], [0, 0, Math.PI / 2]);
    addPart(g, "duodenum", new THREE.TorusGeometry(0.07, 0.02, 8, 20, Math.PI * 0.6), matFn("duodenum", 6), [0, -0.12, 0.06]);
    addPart(g, "esophagus", new THREE.CylinderGeometry(0.025, 0.03, 0.16, 10), matFn("esophagus", 7), [-0.05, 0.2, 0.02]);
  },
};

export interface BuiltOrganSystem {
  group: THREE.Group;
  pickables: THREE.Mesh[];
}

export function buildOrganSystem(sys: OrganSystemDefinition): BuiltOrganSystem {
  const group = new THREE.Group();
  group.name = `OrganSystem:${sys.id}`;

  const matFn = (partId: string, index: number) =>
    partMaterial(partColor(sys, index, sys.parts.length), sys.emissive);

  const builder = builders[sys.id];
  if (builder) {
    builder(group, sys, matFn);
  } else {
    sys.parts.forEach((p, i) => {
      addPart(
        group,
        p.id,
        new THREE.BoxGeometry(0.08, 0.08, 0.08),
        matFn(p.id, i),
        [(i % 4) * 0.12 - 0.18, Math.floor(i / 4) * 0.12 - 0.1, 0],
      );
    });
  }

  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  group.position.sub(center);

  return { group, pickables: collectPartMeshes(group) };
}

export const SYSTEM_CAMERA: Record<string, { pos: Vec3; target: Vec3 }> = {
  ear: { pos: [0.5, 0.15, 0.85], target: [0, 0, 0] },
  brain: { pos: [0.2, 0.35, 1.1], target: [0, 0.05, 0] },
  eyes: { pos: [0.15, 0.1, 0.75], target: [0, 0, 0] },
  nose: { pos: [0.2, 0.05, 0.8], target: [0, 0, 0] },
  neck: { pos: [0.3, 0.05, 0.9], target: [0, 0, 0] },
  lung: { pos: [0.35, 0.1, 1.0], target: [0, 0, 0] },
  digestive: { pos: [0.45, 0.15, 1.05], target: [0, 0, 0] },
  heart: { pos: [0.35, 0.15, 0.95], target: [0, 0, 0] },
  thyroid: { pos: [0.25, 0.1, 0.85], target: [0, 0.05, 0] },
  stomach: { pos: [0.3, 0.1, 0.9], target: [0, 0, 0] },
  male_reproductive: { pos: [0.35, 0, 1.0], target: [0, 0, 0] },
  female_reproductive: { pos: [0.3, 0.05, 0.95], target: [0, 0, 0] },
  bladder: { pos: [0.3, 0.05, 0.9], target: [0, 0, 0] },
  pancreas: { pos: [0.4, 0.1, 0.95], target: [0, 0, 0] },
  kidneys: { pos: [0.35, 0.05, 1.0], target: [0, 0, 0] },
  liver: { pos: [0.45, 0.12, 1.05], target: [0, 0, 0] },
};
