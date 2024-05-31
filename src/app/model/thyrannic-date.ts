import { MathUtil } from "../util/math-util";
import { TemporalUnit } from "./temporal-unit";
import { TDay } from "./thyrannic-day";
import { TYear } from "./thyrannic-year";

export class TDate {
  
  constructor(
    readonly year: TYear,
    readonly week: number,
    readonly day: TDay
  ) {
    if (week < 1) throw new Error('week less than 1');
    if (week > year.getWeeks()) throw new Error('week greater than maximum');
  }
  
  public static make(epoch: number, year: number, week: number, day: TDay) {
    return new TDate(new TYear(epoch, year), week, day);
  }
  
  static fromValue(seq: number): TDate {
    let e,p,y,w,d,r;
    [e,r] = MathUtil.divMod(seq, TemporalUnit.EPOCH.as(TemporalUnit.DAY));
    [p,r] = MathUtil.divMod(r, TemporalUnit.STD_PERIOD.as(TemporalUnit.DAY));
    [y,r] = MathUtil.divMod(r, TemporalUnit.SHORT_YEAR.as(TemporalUnit.DAY));
    [w,r] = MathUtil.divMod(r, TemporalUnit.WEEK.as(TemporalUnit.DAY));
    d = TDay.fromValue(r);
    return TDate.make(e+1, 20*p+y+1, w+1, d);
  }
  
  public valueOf(): number {
    const elapsedEpochs = this.year.epoch - 1;
    const elapsedYearsSinceEpochStart = this.year.year - 1;
    const elapsedPeriodsSinceEpochStart = Math.floor((elapsedYearsSinceEpochStart - 1) / 20);
    const elapsedYearsSincePeriodStart = elapsedYearsSinceEpochStart % 20;
    const elapsedWeeksSinceYearStart = this.week - 1;
    const elapsedDaysSinceWeekStart = this.day.valueOf();
    return elapsedDaysSinceWeekStart
      + elapsedWeeksSinceYearStart * TemporalUnit.WEEK.as(TemporalUnit.DAY)
      + elapsedYearsSincePeriodStart * TemporalUnit.SHORT_YEAR.as(TemporalUnit.DAY)
      + elapsedPeriodsSinceEpochStart * TemporalUnit.STD_PERIOD.as(TemporalUnit.DAY)
      + elapsedEpochs * TemporalUnit.EPOCH.as(TemporalUnit.DAY);
  }
  
  public toString(): string {
    return MathUtil.ordinal(this.week) + " " + this.day.name + " of " + this.year.toString();
  }
  
}