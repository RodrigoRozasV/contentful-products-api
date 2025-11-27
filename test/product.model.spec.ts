import { Product } from '@/domain/entities/Product';

describe('Product Domain Model', () => {
  let product: Product;

  beforeEach(() => {
    product = new Product(
      '1',
      'Test Product',
      'Electronics',
      99.99,
      'A test product',
      { key: 'value' },
      new Date(),
      new Date(),
      null,
      new Date(),
      new Date(),
    );
  });

  describe('isDeleted', () => {
    it('should return false when deletedAt is null', () => {
      expect(product.isDeleted()).toBe(false);
    });

    it('should return true when deletedAt is set', () => {
      const deletedProduct = new Product(
        '1',
        'Test Product',
        'Electronics',
        99.99,
        'A test product',
        {},
        new Date(),
        new Date(),
        new Date(), // deletedAt set
        new Date(),
        new Date(),
      );
      expect(deletedProduct.isDeleted()).toBe(true);
    });
  });

  describe('hasPrice', () => {
    it('should return true when price is set and greater than 0', () => {
      expect(product.hasPrice()).toBe(true);
    });

    it('should return false when price is null', () => {
      const noPrice = new Product(
        '1',
        'Test',
        'Cat',
        null,
        'desc',
        {},
        new Date(),
        new Date(),
        null,
        new Date(),
        new Date(),
      );
      expect(noPrice.hasPrice()).toBe(false);
    });
  });

  describe('isInPriceRange', () => {
    it('should return true when price is in range', () => {
      expect(product.isInPriceRange(50, 150)).toBe(true);
    });

    it('should return false when price is below minimum', () => {
      expect(product.isInPriceRange(100, 200)).toBe(false);
    });

    it('should return false when price is above maximum', () => {
      expect(product.isInPriceRange(10, 50)).toBe(false);
    });
  });

  describe('matchesName', () => {
    it('should return true when name contains search term', () => {
      expect(product.matchesName('Test')).toBe(true);
      expect(product.matchesName('test')).toBe(true);
      expect(product.matchesName('Product')).toBe(true);
    });

    it('should return false when name does not contain search term', () => {
      expect(product.matchesName('NotFound')).toBe(false);
    });
  });
});