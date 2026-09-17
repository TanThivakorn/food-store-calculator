import { MENU } from '../constants/menu.constant';

export type MenuItem = keyof typeof MENU;
export type OrderItems = Partial<Record<MenuItem, number>>;

export type CalculationResult = {
  subtotal: number;
  bundleDiscount: number;
  memberDiscount: number;
  total: number;
};
