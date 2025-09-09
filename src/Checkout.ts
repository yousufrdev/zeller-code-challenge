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

  constructor(private pricingRules: PricingRule[]) {
    if (!Array.isArray(pricingRules)) {
      throw new Error('Pricing rules must be an array');
    }
  }

  /**
   * Scan a product by SKU
   * @param sku Product SKU
   */
  scan(sku: string): void {
    try {
      if (!sku || typeof sku !== 'string') {
        throw new Error('Invalid SKU: must be a non-empty string');
      }

      const product = catalogue[sku];
      if (!product) {
        throw new Error(`Product with SKU ${sku} not found`);
      }

      this.items.push(product);
    } catch (err) {
      console.error(`Error scanning product: ${(err as Error).message}`);
      // Fail-safe: do not add product if invalid
    }
  }

  /**
   * Calculate total price after applying all pricing rules
   * @returns Total price as number
   */
  total(): number {
    try {
      const baseTotal = this.items.reduce((sum, item) => {
        if (!item || typeof item.price !== 'number' || item.price < 0) {
          throw new Error(`Invalid product in checkout: ${JSON.stringify(item)}`);
        }
        return sum + item.price;
      }, 0);

      const discount = this.pricingRules.reduce((sum, rule) => {
        if (!rule || typeof rule.apply !== 'function') {
          throw new Error('Invalid pricing rule: missing apply method');
        }
        return sum + rule.apply(this.items);
      }, 0);

      return parseFloat((baseTotal - discount).toFixed(2));
    } catch (err) {
      console.error(`Error calculating total: ${(err as Error).message}`);
      throw err; // re-throw so tests & callers can detect errors
    }
  }

  /**
   * Clear scanned items
   */
  clear(): void {
    this.items = [];
  }
}
