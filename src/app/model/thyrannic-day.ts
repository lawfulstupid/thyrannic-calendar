export class TDay {

  private constructor(
    readonly id: number,
    readonly name: string
  ) {}

  public static DOLGOS: TDay = new TDay(0, 'Dolgos');
  public static NAUGOS: TDay = new TDay(1, 'Naugos');
  public static BROGOS: TDay = new TDay(2, 'Brogos');
  public static THYRGOS: TDay = new TDay(3, 'Śyrgos');
  public static DRAXIGOS: TDay = new TDay(4, 'Draxigos');
  public static TELUGOS: TDay = new TDay(5, 'Telugos');

  public static values: TDay[] = [this.DOLGOS, this.NAUGOS, this.BROGOS, this.THYRGOS, this.DRAXIGOS, this.TELUGOS];

  public valueOf(): number {
    return this.id;
  }

  public static fromValue(id: number) {
    return TDay.values.filter(day => day.id === id)[0];
  }

}