export class TDay {

  private constructor(
    readonly id: number,
    readonly name: string
  ) {}

  public static DOLGOS: TDay = new TDay(1, 'Dolgos');
  public static NAUGOS: TDay = new TDay(2, 'Naugos');
  public static BROGOS: TDay = new TDay(3, 'Brogos');
  public static THYRGOS: TDay = new TDay(4, 'Śyrgos');
  public static DRAXIGOS: TDay = new TDay(5, 'Draxigos');
  public static TELUGOS: TDay = new TDay(6, 'Telugos');

  public static values: TDay[] = [this.DOLGOS, this.NAUGOS, this.BROGOS, this.THYRGOS, this.DRAXIGOS, this.TELUGOS];

  public valueOf(): number {
    return this.id - 1;
  }

  public static fromValue(value: number) {
    return TDay.values.find(day => day.valueOf() === value);
  }

}