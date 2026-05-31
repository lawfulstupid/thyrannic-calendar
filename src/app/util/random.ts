import Rand from 'rand-seed';
import { MathUtil } from './math-util';

export class Random {

  private readonly rng: Rand;

  constructor(seed: string) {
    this.rng = new Rand(seed);
  }

  public between(min: number, max: number): number {
    return MathUtil.untween(min, this.rng.next(), max);
  }

  // Box-Muller transform
  public normal(mean = 0, sd = 1): number {
    const theta = this.between(0, 360);
    const r = Math.sqrt(-2 * Math.log(this.rng.next()));
    return mean + sd * r * MathUtil.cos(theta);
  }

  public lognormal(mean: number, sd: number): number {
    const m = Math.log(mean ** 2 / Math.sqrt(mean ** 2 + sd ** 2));
    const s = Math.sqrt(Math.log(1 + (sd ** 2 / mean ** 2)))
    return Math.exp(m + s * this.normal());
  }

}