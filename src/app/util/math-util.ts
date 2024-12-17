export class MathUtil {

  private constructor() {}

  public static mod(a: number, b: number): number {
    let m = a % b;
    return m + (m < 0 ? b : 0);
  }

  public static divMod(a: number, b: number): [number, number] {
    return [Math.floor(a/b), MathUtil.mod(a, b)];
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

}