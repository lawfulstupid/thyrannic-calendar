export class TYear {
    
  constructor(
    readonly epoch: number,
    readonly year: number
  ) {
      if (epoch < 1) throw new Error('epoch less than 1');
      if (year < 1) throw new Error('year less than 1');
      if (year > 200) throw new Error('ear greater than 200');
  }
  
  static fromValue(seq: number): TYear {
    const epoch = (seq - 1) / 200 + 1;
    const year = (seq - 1) % 200 + 1;
    return new TYear(epoch, year);
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
    return "" + this.epoch + "," + this.year;
  }
    
}