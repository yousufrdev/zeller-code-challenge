import { PricingRule } from './PricingRule';
import { Product } from '../models/Product';

/**
 * Bulk discount for Super iPad.
 * Example: Buy more than 4, price drops to 499.99 each.
 */
export class IpadBulkDiscount implements PricingRule {
  private sku: string;
  private minQty: number;
  private discountPrice: number;

  /**
   * @param sku Product SKU this deal applies to (e.g., "ipd")
   * @param minQty Minimum quantity to qualify for discount
   * @param discountPrice New discounted price per unit
   */
  constructor(sku: string, minQty: number, discountPrice: number) {
    if (!sku || typeof sku !== 'string') {
      throw new Error('Invalid SKU for IpadBulkDiscount');
    }
    if (!Number.isInteger(minQty) || minQty <= 0) {
      throw new Error('Invalid "minQty" for IpadBulkDiscount');
    }
    if (typeof discountPrice !== 'number' || discountPrice <= 0) {
      throw new Error('Invalid "discountPrice" for IpadBulkDiscount');
    }

    this.sku = sku;
    this.minQty = minQty;
    this.discountPrice = discountPrice;
  }

  /**
   * Calculate the discount amount for this bulk discount
   * Uses try/catch to prevent breaking the checkout flow.
   * @param items Array of scanned products
   * @returns Discount amount in dollars
   */
  apply(items: Product[]): number {
    try {
      if (!Array.isArray(items)) {
        throw new Error('Items must be an array of Products');
      }

      const ipads = items.filter((p) => p && p.sku === this.sku);

      if (ipads.length < this.minQty) {
        return 0; // not enough items for discount
      }

      if (typeof ipads[0].price !== 'number' || ipads[0].price <= 0) {
        throw new Error(`Invalid price for product with SKU ${this.sku}`);
      }

      const discountPerUnit = ipads[0].price - this.discountPrice;
      return discountPerUnit * ipads.length;
    } catch (err) {
      console.error(`Error applying IpadBulkDiscount: ${(err as Error).message}`);
      return 0; // no discount applied if error occurs
    }
  }
}
