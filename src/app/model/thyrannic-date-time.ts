import { MathUtil } from '../util/math-util';
import { TemporalUnit } from './temporal-unit';
import { TDate } from './thyrannic-date';

export class TDateTime {

  constructor (
    readonly date: TDate,
    readonly hour: number = 0,
    readonly minute: number = 0
  ) {}

  public static fromValue(seq: number): TDateTime {
    seq = Math.floor(seq);
    const [daySeq, r] = MathUtil.divMod(seq, TemporalUnit.DAY.as(TemporalUnit.MINUTE));
    const [hour, minute] = MathUtil.divMod(r, TemporalUnit.HOUR.as(TemporalUnit.MINUTE));
    return new TDateTime(TDate.fromValue(daySeq), hour, minute);
  }

  public static fromDate(date: Date = new Date()): TDateTime {
    return new TDateTime(TDate.fromDate(date), date.getUTCHours(), date.getUTCMinutes());
  }

  public valueOf(): number {
    return this.date.valueOf() * TemporalUnit.DAY.as(TemporalUnit.MINUTE)
      + this.hour * TemporalUnit.HOUR.as(TemporalUnit.MINUTE)
      + this.minute;
  }

  public getDisplayHour(): string {
    return MathUtil.lpad(MathUtil.mod(this.hour - 1, 12) + 1, 2);
  }

  public getDisplayMinute(): string {
    return MathUtil.lpad(this.minute, 2);
  }

  public isAfternoon(): boolean {
    return this.hour >= 12;
  }

  public getAmPm(): string {
    return this.isAfternoon() ? 'PM' : 'AM';
  }

  public toString(): string {
    return this.getDisplayHour() + ':' + this.getDisplayMinute() + ' ' + this.getAmPm() + ', ' + this.date.toString();
  }

  public add(quantity: number, unit: TemporalUnit = TemporalUnit.HOUR): TDateTime {
    if (TemporalUnit.MINUTE.defines(unit)) {
      return TDateTime.fromValue(this.valueOf() + quantity * unit.as(TemporalUnit.MINUTE));
    } else {
      return new TDateTime(<TDate>this.date.add(quantity, unit), this.hour);
    }
  }

}