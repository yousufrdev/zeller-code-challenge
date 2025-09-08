import { Product } from '../models/Product';

/** Represents a pricing rule (e.g., bulk discount, buy X get Y free) */
export interface PricingRule {
  apply(items: Product[]): number;
}

/** Config object to create pricing rules dynamically from JSON */
export interface RuleConfig {
  type: string;
  params: Record<string, any>;
}
