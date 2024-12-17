export class TemporalUnit {

  public static readonly HOUR: TemporalUnit = new TemporalUnit('Hour');
  public static readonly DAY: TemporalUnit = new TemporalUnit('Day', [24, this.HOUR]);
  public static readonly WEEK: TemporalUnit = new TemporalUnit('Week', [6, this.DAY]);
  public static readonly QUARTER: TemporalUnit = new TemporalUnit('Quarter', [14, this.WEEK]);
  public static readonly SHORT_YEAR: TemporalUnit = new TemporalUnit('Short Year', [4, this.QUARTER]);
  public static readonly LONG_YEAR: TemporalUnit = new TemporalUnit('Long Year', [5, this.QUARTER]);
  public static readonly STD_PERIOD: TemporalUnit = new TemporalUnit('Period', [19, this.SHORT_YEAR], [1, this.LONG_YEAR]);
  public static readonly EPOCH: TemporalUnit = new TemporalUnit('Epoch', [10, this.STD_PERIOD], [-1, this.WEEK]);

  private readonly parts: Array<{
    baseUnit: TemporalUnit,
    length: number
  }>;

  private constructor(
    private name: string,
    ...baseUnits: Array<[number, TemporalUnit]>
  ) {
    this.parts = baseUnits.map(([n,u]) => ({
      baseUnit: u,
      length: n
    }));
  }

  public as(unit: TemporalUnit): number {
    if (this === unit) return 1;
    if (!this.parts || !this.parts.length) {
      return 1.0 / unit.as(this);
    }
    return this.parts.map(part => part.baseUnit.as(unit) * part.length).reduce((a,b) => a+b, 0.0);
  }

}

