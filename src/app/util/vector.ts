import { MathUtil } from "./math-util";
import { angle, AzAlt, RaDec } from "./units";

export class Vector {

  constructor(
    readonly x: number, // axis of longitude
    readonly y: number, // vertical axis
    readonly z: number
  ) { }

  public static fromSpherical(azimuth: angle, altitude: angle, distance: number = 1): Vector {
    const hDist = distance * MathUtil.cos(altitude);
    return new Vector(
      hDist * MathUtil.cos(azimuth),
      distance * MathUtil.sin(altitude),
      hDist * MathUtil.sin(azimuth)
    )
  }

  public toSpherical(): AzAlt & RaDec & { distance: number } {
    const distance = this.norm();
    const altitude = MathUtil.asin(this.y / distance);
    const azimuth = MathUtil.atan2(this.z, this.x);
    return {
      azimuth,
      altitude,
      rightAscension: azimuth,
      declination: altitude,
      distance
    }
  }

  public norm(): number {
    return Math.sqrt(this.dot(this));
  }

  public normal(): Vector {
    return this.times(1 / this.norm());
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
    return this.x * that.x + this.y * that.y + this.z * that.z;
  }

  public cross(that: Vector): Vector {
    return new Vector(
      this.y * that.z - this.z * that.y,
      this.z * that.x - this.x * that.z,
      this.x * that.y - this.y * that.x
    );
  }

  public angleTo(that: Vector): number {
    const cos = this.dot(that) / (this.norm() * that.norm());
    return MathUtil.fixAngle(MathUtil.acos(cos));
  }

  public signedAngleTo(that: Vector, normal: Vector): number {
    const y = that.cross(this).dot(normal.normal());
    const x = this.dot(that);
    return MathUtil.atan2(y, x);
  }

  public rotate(yaw: angle, pitch: angle, roll: angle): Vector {
    const r11 = MathUtil.cos(yaw) * MathUtil.cos(pitch);
    const r12 = MathUtil.cos(yaw) * MathUtil.sin(pitch) * MathUtil.sin(roll) - MathUtil.sin(yaw) * MathUtil.cos(roll);
    const r13 = MathUtil.cos(yaw) * MathUtil.sin(pitch) * MathUtil.cos(roll) + MathUtil.sin(yaw) * MathUtil.sin(roll);
    const r21 = MathUtil.sin(yaw) * MathUtil.cos(pitch);
    const r22 = MathUtil.sin(yaw) * MathUtil.sin(pitch) * MathUtil.sin(roll) + MathUtil.cos(yaw) * MathUtil.cos(roll);
    const r23 = MathUtil.sin(yaw) * MathUtil.sin(pitch) * MathUtil.cos(roll) - MathUtil.cos(yaw) * MathUtil.sin(roll);
    const r31 = MathUtil.sin(pitch) * -1;
    const r32 = MathUtil.cos(pitch) * MathUtil.sin(roll);
    const r33 = MathUtil.cos(pitch) * MathUtil.cos(roll);

    return new Vector(
      r11 * this.x + r12 * this.y + r13 * this.z,
      r21 * this.x + r22 * this.y + r23 * this.z,
      r31 * this.x + r32 * this.y + r33 * this.z
    );
  }

  public toString(): string {
    return `[${this.x}, ${this.y}, ${this.z}]`;
  }

}