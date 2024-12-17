import { MathUtil } from "../util/math-util";
import { TemporalUnit } from "./temporal-unit";
import { TDate } from "./thyrannic-date";
import { TDateTime } from "./thyrannic-date-time";

export class TYear {

  constructor(
    readonly epoch: number,
    readonly year: number
  ) {
      if (epoch < 1) throw new Error('epoch less than 1');
      if (year < 1) throw new Error('year less than 1');
      if (year > 200) throw new Error('year greater than 200');
  }

  public static fromValue(seq: number): TYear {
    seq = Math.floor(seq);
    const [epoch, year] = MathUtil.divMod(seq - 1, 200);
    return new TYear(epoch + 1, year + 1);
  }

  public static fromDate(date: Date = new Date()): TYear {
    return TDate.fromDate(date).year;
  }

  public valueOf(): number {
      return 200 * (this.epoch - 1) + this.year;
  }

  public getWeeks(): number {
    if (this.year === 200) {
      return 69;
    } else if (this.year % 20 === 0) {
      return 70;
    } else {
      return 56;
    }
  }

  public toString(): string {
    return '' + this.epoch + ',' + this.year;
  }

  public add(quantity: number, unit: TemporalUnit = TemporalUnit.YEAR): TYear | TDate | TDateTime {
    if (TemporalUnit.YEAR.defines(unit)) {
      return TYear.fromValue(this.valueOf() + quantity * unit.as(TemporalUnit.YEAR));
    } else {
      return new TDate(this).add(quantity, unit);
    }
  }

}