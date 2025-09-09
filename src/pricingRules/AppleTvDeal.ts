import { PricingRule } from './PricingRule';
import { Product } from '../models/Product';

/**
 * Apple TV 3-for-2 deal.
 * Example: Buy 3 Apple TVs, pay for 2 only.
 */
export class AppleTvDeal implements PricingRule {
  private sku: string;
  private buy: number;
  private pay: number;

  constructor(sku: string, buy: number, pay: number) {
    if (!sku || typeof sku !== 'string') {
      throw new Error('Invalid SKU for AppleTvDeal');
    }
    if (!Number.isInteger(buy) || buy <= 0) {
      throw new Error('Invalid "buy" quantity for AppleTvDeal');
    }
    if (!Number.isInteger(pay) || pay <= 0 || pay > buy) {
      throw new Error('"pay" must be a positive integer and less than or equal to "buy"');
    }

    this.sku = sku;
    this.buy = buy;
    this.pay = pay;
  }

  /**
   * Calculate the discount amount for this deal.
   * Uses try/catch to prevent breaking the checkout flow.
   * @param items Array of scanned products
   * @returns Discount amount in dollars
   */
  apply(items: Product[]): number {
    try {
      if (!Array.isArray(items)) {
        throw new Error('Items must be an array of Products');
      }

      const matching = items.filter((p) => p && p.sku === this.sku);

      if (matching.length === 0) {
        return 0; // no eligible items, no discount
      }

      if (typeof matching[0].price !== 'number' || matching[0].price < 0) {
        throw new Error(`Invalid price for product with SKU ${this.sku}`);
      }

      const freeUnits = Math.floor(matching.length / this.buy) * (this.buy - this.pay);
      return freeUnits * matching[0].price;
    } catch (err) {
      console.error(`Error applying AppleTvDeal: ${(err as Error).message}`);
      return 0; // no discount applied if error occurs
    }
  }
}
