export class MathUtil {

  private constructor() {}

  public static mod(a: number, b: number): number {
    let m = a % b;
    return m + (m < 0 ? b : 0);
  }

  public static divMod(a: number, b: number): [number, number] {
    return [Math.floor(a/b), MathUtil.mod(a, b)];
  }

  public static fixAngle(a: number): number {
    if (a < 0 || a >= 360) return this.fixAngle(a - 360 * Math.floor(a/360));
    return a;
  }

  public static fixAngle2(a: number): number {
    const fixed = MathUtil.fixAngle(a);
    return fixed > 180 ? fixed - 360 : fixed;
  }

  public static rad2deg(a: number): number {
    return a * 180 / Math.PI;
  }

  public static deg2rad(a: number): number {
    return a * Math.PI / 180;
  }

  public static sin(a: number): number {
    return Math.sin(this.deg2rad(a));
  }

  public static cos(a: number): number {
    return Math.cos(this.deg2rad(a));
  }

  public static tan(a: number): number {
    return Math.tan(this.deg2rad(a));
  }

  public static asin(x: number): number {
    return MathUtil.rad2deg(Math.asin(MathUtil.clamp(x)));
  }

  public static acos(x: number): number {
    return MathUtil.rad2deg(Math.acos(MathUtil.clamp(x)));
  }

  private static clamp(x: number): number {
    return Math.abs(x) > 1 ? Math.sign(x) : x;
  }

  public static ordinal(num: number): string {
    let n = num % 100;
    return num + (() => {
      if (n === 11 || n === 12 || n === 13) {
        return 'th';
      }

      n = n % 10;
      switch (n) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    })();
  }

  public static lpad(n: number, digits: number): string {
    return ('0'.repeat(digits) + n).substr(-digits);
  }

  public static tween(a: number, c: number, b: number): number {
    return (c - a) / (b - a);
  }

  public static random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

}