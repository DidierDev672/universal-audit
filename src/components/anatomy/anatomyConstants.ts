/** Unidad cefálica: altura total ≈ 7.2H, pies en Y=0 */
export const H = 0.3;

export const LANDMARKS = {
  floor: 0,
  foot: 0.05,
  knee: 1.45 * H,
  midThigh: 2.8 * H,
  hip: 3 * H,
  navel: 3.6 * H,
  lowerRib: 4.2 * H,
  sternum: 4.8 * H,
  shoulder: 5.5 * H,
  neckBase: 6 * H,
  chin: 6.35 * H,
  nose: 6.55 * H,
  eye: 6.7 * H,
  headTop: 7.2 * H,
  headCenter: 6.45 * H,
} as const;

export const TOTAL_HEIGHT = LANDMARKS.headTop;
