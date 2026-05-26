import { Component } from '@angular/core';
import { MathUtil } from 'src/app/util/math-util';
import { Random } from 'src/app/util/random';
import { angle, deg } from '../../../util/units';
import { CelestialBg } from '../celestial-bg.component';
import { CelestialBody } from '../celestial-body/celestial-body';
import { Earth } from '../earth/earth';
import { Vector } from 'src/app/util/vector';

@Component({
  selector: Stars.ID,
  templateUrl: './stars.html',
  styleUrl: './stars.scss'
})
export class Stars {

  public static readonly ID = 'stars';

  // Generation parameters
  private static readonly SEED = 'dull';
  private static readonly MAX_STARS: number = 3000;
  public static readonly SPREAD: number = 0.32; // how tightly packed stars are on galactic place
  public static readonly INCLINATION: angle = 77; // inclination between galactic and equatorial planes
  public static readonly ZERO_LONG: angle = 97; // longitude of intersection between galactic and equatorial planes

  protected stars: Array<Star> = [];

  public get opacity() {
    return MathUtil.tween(Earth.SUNRISE_SUNSET_START, CelestialBg.sun.altitude, Earth.SUNRISE_SUNSET);
  }

  constructor() {
    CelestialBg.register(this);
    const rng = new Random(Stars.SEED);
    for (let i = 0; i < Stars.MAX_STARS; i++) {
      this.stars.push(new Star(i, rng));
    }
  }

  public update() {
    this.stars.forEach(star => {
      star.update();
    });
  }

}

class Star extends CelestialBody {

  constructor(public readonly id: number, private readonly rng: Random) {
    super();

    // Generate position on galactic plane
    const galacticRA = this.rng.between(0 * deg, 360 * deg);
    let r = 2;
    while (r < -1 || r > 1) r = this.rng.normal(0, Stars.SPREAD);
    const galacticDec = MathUtil.asin(r) * deg;

    // Change basis to celestial equator via 3d vector
    const galacticPos = Vector.fromSpherical(galacticRA, galacticDec);
    const geocentricPos = galacticPos.rotate(Stars.INCLINATION, Stars.ZERO_LONG, 0);
    ({ rightAscension: this.rightAscension, declination: this.declination } = geocentricPos.toSpherical());
  }

  public override readonly rightAscension: angle;
  public override readonly declination: angle;
  public readonly diameter: number = this.rng.lognormal(1, 0.25);
  public readonly brightnessMax: number = this.rng.lognormal(50, 50);
  public readonly brightnessMin: number = this.rng.between(0.1, 0.9) * this.brightnessMax;
  public readonly animationDuration: number = this.rng.lognormal(5, 2);
  public readonly animationDelay: number = this.rng.lognormal(1, 1);
  public readonly rotation: number = this.rng.between(0 * deg, 360 * deg);

}
