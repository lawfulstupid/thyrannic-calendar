import { MathUtil } from '../util/math-util';
import { TemporalUnit } from './temporal-unit';
import { TDateTime } from './thyrannic-date-time';
import { TDay } from './thyrannic-day';
import { TYear } from './thyrannic-year';

export class TDate {

  constructor(
    readonly year: TYear,
    readonly week: number = 1,
    readonly day: TDay = TDay.DOLGOS
  ) {
    if (week < 1) throw new Error('week less than 1');
    if (week > year.getWeeks()) throw new Error('week greater than maximum');
  }

  public static fromValue(seq: number): TDate {
    seq = Math.floor(seq);
    let e,p,y,w,d,r;
    [e,r] = MathUtil.divMod(seq, TemporalUnit.STD_EPOCH.as(TemporalUnit.DAY));
    [p,r] = MathUtil.divMod(r, TemporalUnit.STD_PERIOD.as(TemporalUnit.DAY));
    [y,r] = MathUtil.divMod(r, TemporalUnit.SHORT_YEAR.as(TemporalUnit.DAY));
    [w,r] = MathUtil.divMod(r, TemporalUnit.WEEK.as(TemporalUnit.DAY));
    d = TDay.fromValue(r);
    return new TDate(new TYear(e+1, 20*p+y+1), w+1, d);
  }

  public static fromDate(date: Date = new Date()): TDate {
    // 16th Brogos 20,22 === 10th August 2022
    return this.fromValue(Math.floor(date.valueOf() / 86400000) + 1280664);
  }

  public valueOf(): number {
    const elapsedEpochs = this.year.epoch - 1;
    const elapsedYearsSinceEpochStart = this.year.year - 1;
    const [elapsedPeriodsSinceEpochStart, elapsedYearsSincePeriodStart] = MathUtil.divMod(elapsedYearsSinceEpochStart, 20);
    const elapsedWeeksSinceYearStart = this.week - 1;
    const elapsedDaysSinceWeekStart = this.day.valueOf();
    return elapsedDaysSinceWeekStart
      + elapsedWeeksSinceYearStart * TemporalUnit.WEEK.as(TemporalUnit.DAY)
      + elapsedYearsSincePeriodStart * TemporalUnit.SHORT_YEAR.as(TemporalUnit.DAY)
      + elapsedPeriodsSinceEpochStart * TemporalUnit.STD_PERIOD.as(TemporalUnit.DAY)
      + elapsedEpochs * TemporalUnit.STD_EPOCH.as(TemporalUnit.DAY);
  }

  public toString(): string {
    return MathUtil.ordinal(this.week) + ' ' + this.day.name + ' of ' + this.year.toString();
  }

  public add(quantity: number, unit: TemporalUnit = TemporalUnit.DAY): TDate | TDateTime {
    if (TemporalUnit.DAY.defines(unit)) {
      return TDate.fromValue(this.valueOf() + quantity * unit.as(TemporalUnit.DAY));
    } else if (TemporalUnit.YEAR.defines(unit)) {
      return new TDate(<TYear>this.year.add(quantity, unit), this.week, this.day);
    } else {
      return new TDateTime(this).add(quantity, unit);
    }
  }

}