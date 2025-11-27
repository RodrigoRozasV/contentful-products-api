import { Injectable } from '@nestjs/common';
@Injectable()
export class ProductStatisticsService {
  calculatePercentage(part: number, total: number): number {
    if (total === 0) return 0;
    return parseFloat(((part / total) * 100).toFixed(2));
  }

  calculateDeletionRate(deleted: number, total: number): number {
    return this.calculatePercentage(deleted, total);
  }

  calculatePricePresenceRate(withPrice: number, total: number): number {
    return this.calculatePercentage(withPrice, total);
  }

  roundPrice(price: number): number {
    return parseFloat(price.toFixed(2));
  }
}