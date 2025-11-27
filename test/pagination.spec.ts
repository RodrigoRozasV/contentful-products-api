import { Pagination } from '../src/utils/pagination';

describe('Pagination Value Object', () => {
  describe('constructor', () => {
    it('should create valid pagination', () => {
      const pagination = new Pagination(1, 5);
      expect(pagination.page).toBe(1);
      expect(pagination.limit).toBe(5);
    });

    it('should throw error when page is less than 1', () => {
      expect(() => new Pagination(0, 5)).toThrow('Page must be greater than 0');
    });

    it('should throw error when limit is less than 1', () => {
      expect(() => new Pagination(1, 0)).toThrow('Limit must be between 1 and 5');
    });

    it('should throw error when limit is greater than 5', () => {
      expect(() => new Pagination(1, 6)).toThrow('Limit must be between 1 and 5');
    });
  });

  describe('skip', () => {
    it('should calculate correct skip value', () => {
      expect(new Pagination(1, 5).skip).toBe(0);
      expect(new Pagination(2, 5).skip).toBe(5);
      expect(new Pagination(3, 5).skip).toBe(10);
    });
  });

  describe('calculateTotalPages', () => {
    it('should calculate correct total pages', () => {
      const pagination = new Pagination(1, 5);
      expect(pagination.calculateTotalPages(10)).toBe(2);
      expect(pagination.calculateTotalPages(13)).toBe(3);
      expect(pagination.calculateTotalPages(5)).toBe(1);
    });
  });
});