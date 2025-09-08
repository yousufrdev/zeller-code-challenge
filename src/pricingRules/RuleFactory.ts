import { PricingRule, RuleConfig } from './PricingRule';
import { AppleTvDeal } from './AppleTvDeal';
import { IpadBulkDiscount } from './IpadBulkDiscount';
import { RuleTypes } from '../enum/RuleTypes';

/**
 * Factory class to create PricingRule instances dynamically
 * based on configuration objects.
 */
export class RuleFactory {
  /**
   * Creates a new PricingRule instance based on the provided configuration.
   *
   * @param config Configuration object describing the rule type and parameters
   * @returns An instance of a PricingRule
   * @throws Error if the rule type is unknown
   */
  static create(config: RuleConfig): PricingRule {
    // Determine which rule class to instantiate based on config.type
    switch (config.type) {
      case RuleTypes.AppleTvDeal:
        return new AppleTvDeal(config.params.sku, config.params.buy, config.params.pay);
      case RuleTypes.IpadBulkDiscount:
        return new IpadBulkDiscount(
          config.params.sku,
          config.params.minQty,
          config.params.discountPrice,
        );
      default:
        throw new Error(`Unknown rule type: ${config.type}`);
    }
  }
}
