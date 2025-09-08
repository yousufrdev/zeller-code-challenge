import { Checkout } from '../src/Checkout';
import { AppleTvDeal } from '../src/pricingRules/AppleTvDeal';
import { IpadBulkDiscount } from '../src/pricingRules/IpadBulkDiscount';

describe('Checkout System', () => {
  let co: Checkout;

  beforeEach(() => {
    co = new Checkout([new AppleTvDeal('atv', 3, 2), new IpadBulkDiscount('ipd', 5, 499.99)]);
  });

  test('3-for-2 Apple TVs', () => {
    co.scan('atv');
    co.scan('atv');
    co.scan('atv');
    co.scan('vga');
    expect(co.total()).toBe(249.0);
  });

  test('Bulk discount on iPads', () => {
    co.scan('atv');
    co.scan('ipd');
    co.scan('ipd');
    co.scan('atv');
    co.scan('ipd');
    co.scan('ipd');
    co.scan('ipd');
    expect(co.total()).toBe(2718.95);
  });
});
