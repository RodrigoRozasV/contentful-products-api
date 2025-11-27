export class PriceRange {
  constructor(
    public readonly min?: number,
    public readonly max?: number,
  ) {
    if (min !== undefined && min < 0) {
      throw new Error('Minimum price cannot be negative');
    }
    if (max !== undefined && max < 0) {
      throw new Error('Maximum price cannot be negative');
    }
    if (min !== undefined && max !== undefined && min > max) {
      throw new Error('Minimum price cannot be greater than maximum price');
    }
  }

  isInRange(price: number | null): boolean {
    if (price === null) return false;
    
    if (this.min !== undefined && price < this.min) return false;
    if (this.max !== undefined && price > this.max) return false;
    
    return true;
  }
}