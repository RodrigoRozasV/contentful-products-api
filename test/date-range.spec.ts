import { DateRange } from '../src/utils/date-range';

describe('DateRange', () => {
  describe('constructor', () => {
    it('should create DateRange with both dates', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');
      const dateRange = new DateRange(start, end);

      expect(dateRange.startDate).toEqual(start);
      expect(dateRange.endDate).toEqual(end);
    });

    it('should create DateRange with only start date', () => {
      const start = new Date('2024-01-01');
      const dateRange = new DateRange(start);

      expect(dateRange.startDate).toEqual(start);
      expect(dateRange.endDate).toBeUndefined();
    });

    it('should create DateRange with only end date', () => {
      const end = new Date('2024-12-31');
      const dateRange = new DateRange(undefined, end);

      expect(dateRange.startDate).toBeUndefined();
      expect(dateRange.endDate).toEqual(end);
    });

    it('should create DateRange with no dates', () => {
      const dateRange = new DateRange();

      expect(dateRange.startDate).toBeUndefined();
      expect(dateRange.endDate).toBeUndefined();
    });

    it('should throw error if start date is after end date', () => {
      const start = new Date('2024-12-31');
      const end = new Date('2024-01-01');

      expect(() => new DateRange(start, end)).toThrow('Start date cannot be after end date');
    });
  });

  describe('isInRange', () => {
    it('should return true if date is within range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');
      const dateRange = new DateRange(start, end);
      const testDate = new Date('2024-06-15');

      expect(dateRange.isInRange(testDate)).toBe(true);
    });

    it('should return false if date is before start', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');
      const dateRange = new DateRange(start, end);
      const testDate = new Date('2023-12-31');

      expect(dateRange.isInRange(testDate)).toBe(false);
    });

    it('should return false if date is after end', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');
      const dateRange = new DateRange(start, end);
      const testDate = new Date('2025-01-01');

      expect(dateRange.isInRange(testDate)).toBe(false);
    });

    it('should return true if no range specified', () => {
      const dateRange = new DateRange();
      const testDate = new Date();

      expect(dateRange.isInRange(testDate)).toBe(true);
    });
  });
});
