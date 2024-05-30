import { ThyrannicDay } from "./thyrannic-day";
import { ThyrannicYear } from "./thyrannic-year";

export class ThyrannicDate {
  
  constructor(
    readonly year: ThyrannicYear,
    readonly week: number,
    readonly day: ThyrannicDay
  ) {
    if (week < 1) throw new Error('week less than 1');
    if (week > year.getWeeks()) throw new Error('week greater than maximum');
  }
  
  public static make(epoch: number, year: number, week: number, day: ThyrannicDay) {
    return new ThyrannicDate(new ThyrannicYear(epoch, year), week, day);
  }
  
  public toString(): string {
    return "" + this.week + this.suffix + " " + this.day.name + " of " + this.year.toString();
  }
  
  private get suffix(): string {
    let n = this.week % 100;
    if (n === 11 || n === 12 || n === 13) {
      return "th";
    }
    
    n = n % 10;
    switch (n) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }
  
}