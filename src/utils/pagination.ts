export class Pagination {
  private readonly _page: number;
  private readonly _limit: number;

  constructor(page: number = 1, limit: number = 5) {
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }
    if (limit < 1 || limit > 5) {
      throw new Error('Limit must be between 1 and 5');
    }
    
    this._page = page;
    this._limit = limit;
  }

  get page(): number {
    return this._page;
  }

  get limit(): number {
    return this._limit;
  }

  get skip(): number {
    return (this._page - 1) * this._limit;
  }

  calculateTotalPages(totalItems: number): number {
    return Math.ceil(totalItems / this._limit);
  }
}