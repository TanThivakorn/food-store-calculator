import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsObject, ValidateBy } from 'class-validator';
import { MAX_QUANTITY, MENU } from '../constants/menu.constant';
import { OrderItems } from '../types/menu.type';

export class CalculateOrderDto {
  // Preserve dictionary keys so class-transformer cannot silently omit unknown names.
  @Transform(
    ({ obj }: { obj: Record<string, unknown> }): unknown => obj.items,
    {
      toClassOnly: true,
    },
  )
  @IsDefined()
  @IsObject()
  @ValidateBy({
    name: 'validMenuQuantities',
    validator: {
      validate: (value: unknown): boolean =>
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.entries(value).every(
          ([name, quantity]: [string, unknown]) =>
            Object.hasOwn(MENU, name) &&
            typeof quantity === 'number' &&
            Number.isInteger(quantity) &&
            quantity >= 0 &&
            quantity <= MAX_QUANTITY,
        ),
      defaultMessage: () =>
        `items must contain only known menu names with integer quantities from 0 to ${MAX_QUANTITY}`,
    },
  })
  items!: OrderItems;

  @IsBoolean()
  isMember!: boolean;
}
