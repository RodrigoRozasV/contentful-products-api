export class ReportFiltersHttpDto {
  constructor(
    public readonly startDate?: string,
    public readonly endDate?: string,
    public readonly hasPrice?: boolean,
  ) {}
}
