import { PricingRule } from './PricingRule';
import { Product } from '../models/Product';

/**
 * Bulk discount for Super iPad.
 * Example: Buy more than 4, price drops to 499.99 each.
 */
export class IpadBulkDiscount implements PricingRule {
  /**
   * @param sku Product SKU this deal applies to (e.g., "ipd")
   * @param minQty Minimum quantity to qualify for discount
   * @param discountPrice New discounted price per unit
   */
  constructor(private sku: string, private minQty: number, private discountPrice: number) {}

  /**
   * Calculate the discount amount for this bulk discount
   * @param items Array of scanned products
   * @returns Discount amount in dollars
   */
  apply(items: Product[]): number {
    const ipads = items.filter((p) => p.sku === this.sku);
    if (ipads.length < this.minQty) return 0;

    const discountPerUnit = ipads[0].price - this.discountPrice;
    return discountPerUnit * ipads.length;
  }
}
