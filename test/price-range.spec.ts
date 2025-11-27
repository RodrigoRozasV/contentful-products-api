import { PriceRange } from '../src/utils/price-range';

describe('PriceRange', () => {
  describe('constructor', () => {
    it('should create PriceRange with both min and max', () => {
      const priceRange = new PriceRange(10, 100);

      expect(priceRange.min).toBe(10);
      expect(priceRange.max).toBe(100);
    });

    it('should create PriceRange with only min', () => {
      const priceRange = new PriceRange(10);

      expect(priceRange.min).toBe(10);
      expect(priceRange.max).toBeUndefined();
    });

    it('should create PriceRange with only max', () => {
      const priceRange = new PriceRange(undefined, 100);

      expect(priceRange.min).toBeUndefined();
      expect(priceRange.max).toBe(100);
    });

    it('should create PriceRange with no values', () => {
      const priceRange = new PriceRange();

      expect(priceRange.min).toBeUndefined();
      expect(priceRange.max).toBeUndefined();
    });

    it('should throw error if min is negative', () => {
      expect(() => new PriceRange(-10, 100)).toThrow('Minimum price cannot be negative');
    });

    it('should throw error if max is negative', () => {
      expect(() => new PriceRange(10, -100)).toThrow('Maximum price cannot be negative');
    });

    it('should throw error if min is greater than max', () => {
      expect(() => new PriceRange(100, 10)).toThrow(
        'Minimum price cannot be greater than maximum price',
      );
    });
  });

  describe('isInRange', () => {
    it('should return true if price is within range', () => {
      const priceRange = new PriceRange(10, 100);

      expect(priceRange.isInRange(50)).toBe(true);
    });

    it('should return false if price is below min', () => {
      const priceRange = new PriceRange(10, 100);

      expect(priceRange.isInRange(5)).toBe(false);
    });

    it('should return false if price is above max', () => {
      const priceRange = new PriceRange(10, 100);

      expect(priceRange.isInRange(150)).toBe(false);
    });

    it('should return true if price is null and no range specified', () => {
      const priceRange = new PriceRange();

      expect(priceRange.isInRange(null)).toBe(true);
    });

    it('should return false if price is null and range is specified', () => {
      const priceRange = new PriceRange(10, 100);

      expect(priceRange.isInRange(null)).toBe(false);
    });

    it('should handle edge case: price equals min', () => {
      const priceRange = new PriceRange(10, 100);

      expect(priceRange.isInRange(10)).toBe(true);
    });

    it('should handle edge case: price equals max', () => {
      const priceRange = new PriceRange(10, 100);

      expect(priceRange.isInRange(100)).toBe(true);
    });
  });
});
