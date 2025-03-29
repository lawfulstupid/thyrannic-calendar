import { Component } from '@angular/core';
import { MathUtil } from 'src/app/util/math-util';
import { Random } from 'src/app/util/random';
import { angle, deg } from '../../../util/units';
import { CelestialBg } from '../celestial-bg.component';
import { CelestialBody } from '../celestial-body/celestial-body';
import { EarthComponent } from '../earth/earth.component';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrl: './stars.component.scss'
})
export class StarsComponent {

  private static readonly SEED = 'make me some pretty stars';
  private static readonly MAX_STARS: number = 1000;

  protected stars: Array<Star> = [];

  protected get opacity() {
    return MathUtil.tween(EarthComponent.SUNRISE_SUNSET_START, CelestialBg.sun.altitude, EarthComponent.SUNRISE_SUNSET);
  }

  constructor() {
    CelestialBg.stars = this;
    const rng = new Random(StarsComponent.SEED);
    for (let i = 0; i < StarsComponent.MAX_STARS; i++) {
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
