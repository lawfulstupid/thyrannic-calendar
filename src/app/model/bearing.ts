import { MathUtil } from "../util/math-util";
import { angle } from "../util/units";

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

  public static custom(bearing: angle): Bearing {
    // Developed with South as the 000 bearing, East as 090
    // Yes it's completely backwards but easier to just change the display here that try to fix the core
    const display = MathUtil.fixAngle(180 - bearing).toFixed(0).padStart(3, '0');
    return new Bearing(`${display}°`, bearing);
  }

}