export class ThyrannicDay {
  
  private constructor(
    readonly id: number,
    readonly name: string
  ) {}
  
  public static DOLGOS: ThyrannicDay = new ThyrannicDay(1, 'Dolgos');
  public static NAUGOS: ThyrannicDay = new ThyrannicDay(2, 'Naugos');
  public static BROGOS: ThyrannicDay = new ThyrannicDay(3, 'Brogos');
  public static THYRGOS: ThyrannicDay = new ThyrannicDay(4, 'Śyrgos');
  public static DRAXIGOS: ThyrannicDay = new ThyrannicDay(5, 'Draxigos');
  public static TELUGOS: ThyrannicDay = new ThyrannicDay(6, 'Telugos');
  
}