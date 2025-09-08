import { PricingRule } from './PricingRule';
import { Product } from '../models/Product';

/**
 * Apple TV 3-for-2 deal.
 * Example: Buy 3 Apple TVs, pay for 2 only.
 */
export class AppleTvDeal implements PricingRule {
  /**
   * @param sku Product SKU this deal applies to (e.g: "atv")
   * @param buy Number of items needed to qualify for deal
   * @param pay Number of items to actually pay for
   */
  constructor(private sku: string, private buy: number, private pay: number) {}

  /**
   * Calculate the discount amount for this deal.
   * @param items Array of scanned products
   * @returns Discount amount in dollars
   */
  apply(items: Product[]): number {
    const matching = items.filter((p) => p.sku === this.sku);
    if (matching.length === 0) return 0;

    const freeUnits = Math.floor(matching.length / this.buy) * (this.buy - this.pay);
    return freeUnits * matching[0].price;
  }
}
