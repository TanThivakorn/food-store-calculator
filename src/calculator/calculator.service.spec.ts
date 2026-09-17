import { CalculatorService } from './calculator.service';
import { MAX_QUANTITY } from './constants/menu.constant';
import { CalculationResult, OrderItems } from './types/menu.type';

describe('CalculatorService', () => {
  const service = new CalculatorService();
  const cases: Array<{
    name: string;
    items: OrderItems;
    isMember: boolean;
    expected: CalculationResult;
  }> = [
    {
      name: 'Red and Green',
      items: { red: 1, green: 1 },
      isMember: false,
      expected: {
        subtotal: 90,
        bundleDiscount: 0, 
        memberDiscount: 0,
        total: 90,
      },
    },
    {
      name: 'Red and Green with membership',
      items: { red: 1, green: 1 },
      isMember: true,
      expected: {
        subtotal: 90,
        bundleDiscount: 0,
        memberDiscount: 9,
        total: 81,
      },
    },
    {
      name: 'one Orange',
      items: { orange: 1 },
      isMember: false,
      expected: {
        subtotal: 120,
        bundleDiscount: 0,
        memberDiscount: 0,
        total: 120,
      },
    },
    {
      name: 'two Oranges',
      items: { orange: 2 },
      isMember: false,
      expected: {
        subtotal: 240,
        bundleDiscount: 12,
        memberDiscount: 0,
        total: 228,
      },
    },
    {
      name: 'three Oranges',
      items: { orange: 3 },
      isMember: false,
      expected: {
        subtotal: 360,
        bundleDiscount: 12,
        memberDiscount: 0,
        total: 348,
      },
    },
    {
      name: 'five Oranges',
      items: { orange: 5 },
      isMember: false,
      expected: {
        subtotal: 600,
        bundleDiscount: 24,
        memberDiscount: 0,
        total: 576,
      },
    },
    {
      name: 'independent Pink and Green pairs',
      items: { pink: 2, green: 2 },
      isMember: false,
      expected: {
        subtotal: 240,
        bundleDiscount: 12,
        memberDiscount: 0,
        total: 228,
      },
    },
    {
      name: 'bundle before membership',
      items: { orange: 2 },
      isMember: true,
      expected: {
        subtotal: 240,
        bundleDiscount: 12,
        memberDiscount: 22.8,
        total: 205.2,
      },
    },
    {
      name: 'all menu items',
      items: {
        red: 1,
        green: 2,
        blue: 3,
        yellow: 1,
        pink: 3,
        purple: 2,
        orange: 5,
      },
      isMember: true,
      expected: {
        subtotal: 1290,
        bundleDiscount: 36,
        memberDiscount: 125.4,
        total: 1128.6,
      },
    },
    {
      name: 'zero quantities',
      items: { red: 0, green: 0, orange: 0 },
      isMember: true,
      expected: { subtotal: 0, bundleDiscount: 0, memberDiscount: 0, total: 0 },
    },
    {
      name: 'empty order',
      items: {},
      isMember: false,
      expected: { subtotal: 0, bundleDiscount: 0, memberDiscount: 0, total: 0 },
    },
    {
      name: 'no pairing across menu types',
      items: { orange: 1, pink: 1, green: 1 },
      isMember: false,
      expected: {
        subtotal: 240,
        bundleDiscount: 0,
        memberDiscount: 0,
        total: 240,
      },
    },
    {
      name: 'ineligible pairs',
      items: { red: 2, blue: 2, yellow: 2, purple: 2 },
      isMember: false,
      expected: {
        subtotal: 440,
        bundleDiscount: 0,
        memberDiscount: 0,
        total: 440,
      },
    },
    {
      name: 'maximum supported quantities',
      items: {
        red: MAX_QUANTITY,
        green: MAX_QUANTITY,
        blue: MAX_QUANTITY,
        yellow: MAX_QUANTITY,
        pink: MAX_QUANTITY,
        purple: MAX_QUANTITY,
        orange: MAX_QUANTITY,
      },
      isMember: true,
      expected: {
        subtotal: 460_000_000,
        bundleDiscount: 12_000_000,
        memberDiscount: 44_800_000,
        total: 403_200_000,
      },
    },
  ];

  it.each(cases)('$name', ({ items, isMember, expected }) => {
    expect(service.calculate({ items, isMember })).toEqual(expected);
  });
});
