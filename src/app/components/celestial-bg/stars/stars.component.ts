import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TDateTime } from 'src/app/model/thyrannic-date-time';
import { MathUtil } from 'src/app/util/math-util';
import { CelestialBody } from '../celestial-body/celestial-body';
import { EarthComponent } from '../earth/earth.component';

@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [NgFor],
  templateUrl: './stars.component.html',
  styleUrl: './stars.component.scss'
})
export class StarsComponent {

  private static readonly MAX_STARS: number = 1000;

  protected stars: Array<Star> = [];

  protected get opacity() {
    return MathUtil.tween(EarthComponent.SUNRISE_SUNSET_START, CelestialBody.sun.altitude, EarthComponent.SUNRISE_SUNSET);
  }

  constructor() {
    CelestialBody.stars = this;
    for (let i = 0; i < StarsComponent.MAX_STARS; i++) {
      this.stars.push(new Star());
    }
  }

  public update(datetime: TDateTime) {
    this.stars.forEach(star => {
      star.update(datetime);
    });
  }

}

class Star extends CelestialBody {

  public override readonly rightAscension: number = MathUtil.random(0, 360);
  public override readonly declination: number = MathUtil.random(-90, 90);
  public readonly diameter: number = MathUtil.random(0.5, 2);
  public readonly brightnessMax: number = MathUtil.random(1, 80);
  public readonly brightnessMin: number = MathUtil.random(0, this.brightnessMax);
  public readonly animationDuration: number = MathUtil.random(2,6);
  public readonly animationDelay: number = MathUtil.random(0, 2);
  public readonly rotation: number = MathUtil.random(0, 360);

}
