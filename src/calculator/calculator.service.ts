import { Injectable } from '@nestjs/common';
import { MENU } from './constants/menu.constant';
import { CalculateOrderDto } from './dto/calculate-order.dto';
import { CalculationResult, OrderItems } from './types/menu.type';

const SATANG_PER_BAHT = 100;
const BUNDLE_DISCOUNT_PERCENT = 5;
const MEMBER_DISCOUNT_PERCENT = 10;

@Injectable()
export class CalculatorService {
  calculate({ items, isMember }: CalculateOrderDto): CalculationResult {
    const subtotal = this.calculateSubtotal(items);
    const bundleDiscount = this.calculateBundleDiscount(items);
    const afterBundleDiscount = subtotal - bundleDiscount;
    const memberDiscount = this.calculateMemberDiscount(
      afterBundleDiscount,
      isMember,
    );

    return {
      subtotal: subtotal / SATANG_PER_BAHT,
      bundleDiscount: bundleDiscount / SATANG_PER_BAHT,
      memberDiscount: memberDiscount / SATANG_PER_BAHT,
      total: (afterBundleDiscount - memberDiscount) / SATANG_PER_BAHT,
    };
  }

  private calculateSubtotal(items: OrderItems): number {
    return Object.entries(MENU).reduce(
      (subtotal, [name, item]) =>
        subtotal + (items[name as keyof typeof MENU] ?? 0) * item.price,
      0,
    );
  }

  private calculateBundleDiscount(items: OrderItems): number {
    const eligibleAmount = Object.entries(MENU).reduce(
      (amount, [name, item]) => {
        if (!item.bundleEligible) return amount;

        const quantity = items[name as keyof typeof MENU] ?? 0;
        const discountedQuantity = Math.floor(quantity / 2) * 2;
        return amount + discountedQuantity * item.price;
      },
      0,
    );

    return this.calculatePercentage(eligibleAmount, BUNDLE_DISCOUNT_PERCENT);
  }

  private calculateMemberDiscount(amount: number, isMember: boolean): number {
    return isMember
      ? this.calculatePercentage(amount, MEMBER_DISCOUNT_PERCENT)
      : 0;
  }

  private calculatePercentage(amount: number, percent: number): number {
    // Round half up to the nearest satang using integer arithmetic.
    return Math.floor((amount * percent + 50) / 100);
  }
}
