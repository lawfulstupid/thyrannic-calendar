import { MathUtil } from "./math-util";

export class Vector {
  
  constructor(
    readonly x: number, // axis of longitude
    readonly y: number, // vertical axis
    readonly z: number
  ) {}
  
  public static fromRAD(rightAscension: number, declination: number, distance: number = 1): Vector {
    const hDist = distance * MathUtil.cos(declination);
    return new Vector(
      hDist * MathUtil.cos(rightAscension),
      distance * MathUtil.sin(declination),
      hDist * MathUtil.sin(rightAscension)
    );
  }
  
  public toRAD(): [number, number] {
    const dist = this.norm();
    const declination = MathUtil.rad2deg(Math.asin(this.y / dist));
    const hDist = dist * MathUtil.cos(declination);
    const rightAscension = MathUtil.rad2deg(Math.acos(this.x / hDist));
    return [rightAscension, declination];
  }
  
  public norm(): number {
    return Math.sqrt(this.dot(this));
  }
  
  public normal(): Vector {
    return this.times(1/this.norm());
  }
  
  public plus(that: Vector): Vector {
    return new Vector(
      this.x + that.x,
      this.y + that.y,
      this.z + that.z
    );
  }
  
  public minus(that: Vector): Vector {
    return this.plus(that.times(-1));
  }
  
  public times(s: number) {
    return new Vector(
      s * this.x,
      s * this.y,
      s * this.z
    );
  }
  
  public dot(that: Vector): number {
    return this.x*that.x + this.y*that.y + this.z*that.z;
  }
  
  public cross(that: Vector): Vector {
    return new Vector(
      this.y*that.z - this.z*that.y,
      this.z*that.x - this.x*that.z,
      this.x*that.y - this.y*that.x
    );
  }
  
  public angleTo(that: Vector): number {
    const cos = this.dot(that) / (this.norm() * that.norm());
    return MathUtil.fixAngle(MathUtil.rad2deg(Math.acos(cos)));
  }
  
  public toString(): string {
    return `[${this.x}, ${this.y}, ${this.z}]`;
  }
  
}