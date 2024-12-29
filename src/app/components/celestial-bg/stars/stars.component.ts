import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TDateTime } from 'src/app/model/thyrannic-date-time';
import { MathUtil } from 'src/app/util/math-util';
import { CelestialBody } from '../celestial-body/celestial-body';

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

class Star {
  
  private readonly rightAscension: number = MathUtil.random(0, 360);
  private readonly declination: number = MathUtil.random(-90, 90);
  public readonly diameter: number = MathUtil.random(0.5, 2);
  public readonly brightnessMax: number = MathUtil.random(1, 80);
  public readonly brightnessMin: number = MathUtil.random(0, this.brightnessMax);
  public readonly animationDuration: number = MathUtil.random(2,6);
  public readonly animationDelay: number = MathUtil.random(0, 2);
  public readonly rotation: number = MathUtil.random(0, 360);
  
  top: string = '0';
  left: string = '0';
  
  public update(datetime: TDateTime) {
    const [azimuth, altitude] = CelestialBody.RaDec2AzAlt(datetime, this.rightAscension, this.declination);
    [this.top, this.left] = CelestialBody.onScreenPosition(azimuth, altitude);
  }

}
