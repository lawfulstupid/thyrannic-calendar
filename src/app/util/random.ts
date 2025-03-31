import Rand from 'rand-seed';
import { MathUtil } from './math-util';

export class Random {

  private readonly rng: Rand;

  constructor(seed: string) {
    this.rng = new Rand(seed);
  }

  public between(min: number, max: number): number {
    return this.rng.next() * (max - min) + min;
  }

  // Box-Muller transform
  public normal(): number {
    const theta = this.between(0, 360);
    const r = Math.sqrt(-2 * Math.log(this.rng.next()));
    return r * MathUtil.cos(theta);
  }

}