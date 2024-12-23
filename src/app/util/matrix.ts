import { MathUtil } from "./math-util";
import { Vector } from "./vector";

export class Matrix {
  
  constructor(
    readonly c1: Vector,
    readonly c2: Vector,
    readonly c3: Vector
  ) {}
  
  public static rotateX(a: number): Matrix {
    return new Matrix(
      new Vector(1, 0, 0),
      new Vector(0, MathUtil.cos(a), MathUtil.sin(a)),
      new Vector(0, -MathUtil.sin(a), MathUtil.cos(a))
    );
  }
  
  public transform(vec: Vector): Vector {
    return new Vector(
      this.c1.x * vec.x + this.c2.x * vec.y + this.c3.x * vec.z,
      this.c1.y * vec.x + this.c2.y * vec.y + this.c3.y * vec.z,
      this.c1.z * vec.x + this.c2.z * vec.y + this.c3.z * vec.z
    );
  }
  
}