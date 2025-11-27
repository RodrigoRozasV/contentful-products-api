export class DateRange {
  constructor(
    public readonly startDate?: Date,
    public readonly endDate?: Date,
  ) {
    if (startDate && endDate && startDate > endDate) {
      throw new Error('Start date cannot be after end date');
    }
  }

  isInRange(date: Date): boolean {
    if (this.startDate && date < this.startDate) return false;
    if (this.endDate && date > this.endDate) return false;
    return true;
  }
}