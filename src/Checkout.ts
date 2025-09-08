import { Product } from './models/Product';
import { catalogue } from './models/Catalogue';
import { PricingRule } from './pricingRules/PricingRule';

/**
 * Checkout system class
 * - Scans items
 * - Applies pricing rules
 * - Calculates total price
 */
export class Checkout {
  private items: Product[] = [];

  constructor(private pricingRules: PricingRule[]) {}

  /**
   * Scan a product by SKU
   * @param sku Product SKU
   */
  scan(sku: string): void {
    const product = catalogue[sku];
    if (!product) throw new Error(`Product with SKU ${sku} not found`);
    this.items.push(product);
  }

  /**
   * Calculate total price after applying all pricing rules
   * @returns Total price as number
   */
  total(): number {
    const baseTotal = this.items.reduce((sum, item) => sum + item.price, 0);

    // Sum of all discounts
    const discount = this.pricingRules.reduce((sum, rule) => sum + rule.apply(this.items), 0);

    return parseFloat((baseTotal - discount).toFixed(2));
  }

  /**
   * Clear scanned items
   */
  clear(): void {
    this.items = [];
  }
}
