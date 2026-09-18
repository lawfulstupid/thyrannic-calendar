export class City {

  public static values: City[] = [];

  public readonly id: number;

  private constructor(
    readonly name: string,
    readonly latitude: number,
    readonly longitude: number = 0
  ) {
    City.values.push(this);
    City.values = City.values.sort((a, b) => b.latitude - a.latitude); // sort by highest latitude first
    this.id = City.values.length;
  }

  public static readonly THYRANNOS = new City('Śyrannos', 25.29, 83.565);
  public static readonly MORA = new City('Mora', 35.19, 83.07);
  public static readonly CERIN = new City('Cerin', 40.365, 93.465);
  public static readonly DASENEM = new City('Daśenem', 41.445, 97.515);
  public static readonly EXULOR = new City('Exulor', 40.545, 104.175);
  public static readonly FADIRA = new City('Fadira', 30.555, 87.705);
  public static readonly THYRIS = new City('Śyris', 17.145, 88.695);
  public static readonly ELDUMAN = new City('Eldu', 32.175, 74.475);
  public static readonly TAZENDOR = new City('Taźendor', 48.465, 67.05);
  public static readonly MAZOKHODRAK = new City('Mazokhodrak', 57.195, 129.15);
  public static readonly DEDKA = new City('Dedka', 48.60, 91.80);
  public static readonly RANIL = new City('Ranil', 26.56, 69.48);

  public static selected: City = this.ELDUMAN;

  public static fromId(id: number): City | undefined {
    return this.values.find(city => city.id === id);
  }

}