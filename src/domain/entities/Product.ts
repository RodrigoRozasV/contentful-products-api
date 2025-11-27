export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly category: string | null,
    public readonly price: number | null,
    public readonly description: string | null,
    public readonly metadata: Record<string, any> | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly contentfulCreatedAt: Date | null,
    public readonly contentfulUpdatedAt: Date | null,
  ) {}

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  hasPrice(): boolean {
    return this.price !== null && this.price > 0;
  }

  hasCategory(): boolean {
    return this.category !== null && this.category.trim().length > 0;
  }

  isInPriceRange(minPrice?: number, maxPrice?: number): boolean {
    if (!this.hasPrice()) return false;

    if (minPrice !== undefined && this.price! < minPrice) return false;
    if (maxPrice !== undefined && this.price! > maxPrice) return false;

    return true;
  }

  matchesName(searchTerm: string): boolean {
    if (!searchTerm) return true;
    return this.name.toLowerCase().includes(searchTerm.toLowerCase());
  }

  matchesCategory(category: string): boolean {
    if (!category) return true;
    if (!this.category) return false;
    return this.category.toLowerCase().includes(category.toLowerCase());
  }
}
