import { Component } from '@angular/core';
import { MathUtil } from 'src/app/util/math-util';
import { Random } from 'src/app/util/random';
import { angle, deg } from '../../../util/units';
import { CelestialBg } from '../celestial-bg.component';
import { CelestialBody } from '../celestial-body/celestial-body';
import { Earth } from '../earth/earth';

@Component({
  selector: Stars.ID,
  templateUrl: './stars.html',
  styleUrl: './stars.scss'
})
export class Stars {

  public static readonly ID = 'stars';
  private static readonly SEED = 'make me some pretty stars';
  private static readonly MAX_STARS: number = 1000;

  protected stars: Array<Star> = [];

  public get opacity() {
    return MathUtil.tween(Earth.SUNRISE_SUNSET_START, CelestialBg.sun.altitude, Earth.SUNRISE_SUNSET);
  }

  constructor() {
    CelestialBg.register(this);
    const rng = new Random(Stars.SEED);
    for (let i = 0; i < Stars.MAX_STARS; i++) {
      this.stars.push(new Star(rng));
    }
  }

  public update() {
    this.stars.forEach(star => {
      star.update();
    });
  }

}

class Star extends CelestialBody {

  constructor(private readonly rng: Random) {
    super();
  }

  public override readonly rightAscension: angle = this.rng.between(0 * deg, 360 * deg);
  public override readonly declination: angle = MathUtil.asin(this.rng.between(-1, 1)) * deg;
  public readonly diameter: number = this.rng.between(0.5, 2);
  public readonly brightnessMax: number = this.rng.between(1, 80);
  public readonly brightnessMin: number = this.rng.between(0, this.brightnessMax);
  public readonly animationDuration: number = this.rng.between(2, 6);
  public readonly animationDelay: number = this.rng.between(0, 2);
  public readonly rotation: number = this.rng.between(0 * deg, 360 * deg);

}
