import fs from 'fs';
import path from 'path';
import { Checkout } from './Checkout';
import { RuleFactory } from './pricingRules/RuleFactory';
import { RuleConfig } from './pricingRules/PricingRule';

// Load config
const configPath = path.join(__dirname, 'config', 'rules.json');
const ruleConfigs: RuleConfig[] = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const pricingRules = ruleConfigs.map(RuleFactory.create);

// Use checkout
const co = new Checkout(pricingRules);

co.scan('atv');
co.scan('atv');
co.scan('atv');
co.scan('vga');

console.log('Total: $' + co.total()); // Expected: $249.00
