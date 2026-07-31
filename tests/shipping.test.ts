import { describe, expect, it } from 'vitest';

import {
  hasIndividualVariantShipping,
  parseShippingPrices,
  resolveVariantShippingPrice,
  serializeShippingPrices,
} from '@/lib/shipping';

describe('shipping helpers', () => {
  it('parses shipping prices from json', () => {
    expect(parseShippingPrices({ 'class-1': 12.5, 'class-2': '8' })).toEqual({
      'class-1': 12.5,
      'class-2': 8,
    });
  });

  it('serializes form shipping prices', () => {
    expect(
      serializeShippingPrices({
        'class-1': '15',
        'class-2': '',
      }),
    ).toEqual({
      'class-1': 15,
    });
  });

  it('serializes numeric shipping prices', () => {
    expect(
      serializeShippingPrices({
        'class-1': 20,
      }),
    ).toEqual({
      'class-1': 20,
    });
  });

  it('resolves variant shipping override before product price', () => {
    expect(
      resolveVariantShippingPrice({ 'class-1': 20 }, 'class-1', 10),
    ).toBe(20);
    expect(resolveVariantShippingPrice({}, 'class-1', 10)).toBe(10);
  });

  it('detects individual variant shipping mode', () => {
    expect(
      hasIndividualVariantShipping([
        { shipping_prices: {} },
        { shipping_prices: { 'class-1': '12' } },
      ]),
    ).toBe(true);
    expect(hasIndividualVariantShipping([{ shipping_prices: {} }])).toBe(false);
  });
});
