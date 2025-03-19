import Rand from 'rand-seed';

export class Random {

  private readonly rng: Rand;

  constructor(seed: string) {
    this.rng = new Rand(seed);
  }

  public between(min: number, max: number): number {
    return this.rng.next() * (max - min) + min;
  }

}