export class ProductFiltersDto {
  constructor(
    public readonly name?: string,
    public readonly category?: string,
    public readonly minPrice?: number,
    public readonly maxPrice?: number,
  ) {}
}
