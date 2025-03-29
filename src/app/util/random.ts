import Rand from 'rand-seed';

export class Random {

  private readonly rng: Rand;

  constructor(seed: string) {
    this.rng = new Rand(seed);
  }

  public between(min: number, max: number): number {
    return this.rng.next() * (max - min) + min;
  }

  // Box-Muller transform
  public normal1(): number {
    const theta = 2 * Math.PI * this.rng.next();
    const r = Math.sqrt(-2 * Math.log(this.rng.next()));
    return r * Math.cos(theta);
  }

}