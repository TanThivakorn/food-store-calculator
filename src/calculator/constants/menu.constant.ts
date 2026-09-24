export const MENU = {
  red: { price: 5_000, bundleEligible: false },
  green: { price: 4_000, bundleEligible: true },
  blue: { price: 3_000, bundleEligible: false },
  yellow: { price: 5_000, bundleEligible: false },
  pink: { price: 8_000, bundleEligible: true },
  purple: { price: 9_000, bundleEligible: false },
  orange: { price: 12_000, bundleEligible: true },
} as const satisfies Record<string, { price: number; bundleEligible: boolean }>;

export const MAX_QUANTITY = 1_000_000;
