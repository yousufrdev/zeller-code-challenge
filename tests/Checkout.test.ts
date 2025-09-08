import { Checkout } from '../src/Checkout';
import { AppleTvDeal } from '../src/pricingRules/AppleTvDeal';
import { IpadBulkDiscount } from '../src/pricingRules/IpadBulkDiscount';

describe('Checkout System - Full Test Suite', () => {
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

  test('Empty cart should total 0', () => {
    expect(co.total()).toBe(0);
  });

  test('Single Apple TV without deal', () => {
    co.scan('atv');
    expect(co.total()).toBe(109.5);
  });

  test('Multiple different products', () => {
    co.scan('atv');
    co.scan('ipd');
    co.scan('mbp');
    co.scan('vga');
    expect(co.total()).toBeCloseTo(109.5 + 549.99 + 1399.99 + 30);
  });

  test('Apple TV deal applies correctly for 6 units', () => {
    for (let i = 0; i < 6; i++) co.scan('atv'); // 2 free
    expect(co.total()).toBeCloseTo(4 * 109.5);
  });

  test('iPad bulk discount does not apply below threshold', () => {
    for (let i = 0; i < 4; i++) co.scan('ipd'); // threshold is 5
    expect(co.total()).toBeCloseTo(4 * 549.99);
  });

  test('Negative pricing should not occur', () => {
    expect(co.total()).toBeGreaterThanOrEqual(0);
  });

  test('checkout throws error if a pricing rule is invalid', () => {
    const faultyRule: any = { apply: null };
    const coError = new Checkout([faultyRule]);
    coError.scan('atv');
    expect(() => coError.total()).toThrow();
  });
});
