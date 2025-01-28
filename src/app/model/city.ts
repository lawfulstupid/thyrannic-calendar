export class City {
  
  private static entries: number = 0;
  public readonly id: number = ++City.entries;
  
  private constructor(
    readonly name: string,
    readonly latitude: number,
    readonly longitude: number = 0
  ) {}
  
  public static readonly THYRANNOS = new City('Śyrannos', 25.29);
  public static readonly MORA = new City('Mora', 35.19);
  public static readonly CERIN = new City('Cerin', 40.365);
  public static readonly DASENEM = new City('Daśenem', 41.445);
  public static readonly EXULOR = new City('Exulor', 40.545);
  public static readonly FADIRA = new City('Fadira', 30.555);
  public static readonly THYRIS = new City('Śyris', 17.145);
  public static readonly ELDUMAN = new City('Elduman Capital Cities', 32.175);
  public static readonly TAZENDOR = new City('Taźendor', 48.465);
  public static readonly MAZOKHODRAK = new City('Mazokhodrak', 57.195);
  public static readonly DEDKA = new City('Dedka', 48.60);
  
  public static selected: City = this.THYRANNOS;
  public static values: City[] = [
    this.THYRANNOS,
    this.MORA,
    this.CERIN,
    this.DASENEM,
    this.EXULOR,
    this.FADIRA,
    this.THYRIS,
    this.ELDUMAN,
    this.TAZENDOR,
    this.MAZOKHODRAK,
    this.DEDKA
  ].sort((a,b) => a.name.localeCompare(b.name));
  
  public static fromId(id: number): City | undefined {
    return this.values.find(city => city.id === id);
  }
  
}