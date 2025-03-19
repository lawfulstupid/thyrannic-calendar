export class Bearing {

  public static readonly NORTH = new Bearing('North', 180);
  public static readonly NORTHEAST = new Bearing('Northeast', 135);
  public static readonly EAST= new Bearing('East', 90);
  public static readonly SOUTHEAST = new Bearing('Southeast', 45);
  public static readonly SOUTH = new Bearing('South', 0);
  public static readonly SOUTHWEST = new Bearing('Southwest', 315);
  public static readonly WEST = new Bearing('West', 270);
  public static readonly NORTHWEST = new Bearing('Northwest', 225);

  private constructor(
    readonly name: string,
    readonly angle: number
  ) {}

  public static values: Bearing[] = [
    this.NORTH,
    this.NORTHEAST,
    this.EAST,
    this.SOUTHEAST,
    this.SOUTH,
    this.SOUTHWEST,
    this.WEST,
    this.NORTHWEST
  ]

}