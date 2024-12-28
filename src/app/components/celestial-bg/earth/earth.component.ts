import { Component } from '@angular/core';
import { TDateTime } from 'src/app/model/thyrannic-date-time';
import { MathUtil } from 'src/app/util/math-util';
import { CelestialBody } from '../celestial-body/celestial-body';

@Component({
  selector: 'app-earth',
  standalone: true,
  imports: [],
  templateUrl: './earth.component.html',
  styleUrl: './earth.component.scss'
})
export class EarthComponent {
  
  constructor() {
    CelestialBody.earth = this;
  }
  
  readonly tilt: number = 24.12;
  readonly latitude: number = 35.19;
  
  skyColor: string = 'skyblue';

  public update(datetime: TDateTime) {
    const daylight = 5 * CelestialBody.sun.angularDiameter;
    const dawnDusk = 0;
    const twilight = -5 * CelestialBody.sun.angularDiameter / 2;
    const night = -18;
    
    const altitude = CelestialBody.sun.altitude;
    if (altitude > daylight) {
      this.skyColor = 'skyblue';
    } else if (altitude > dawnDusk) {
      const progress = MathUtil.tween(daylight, altitude, dawnDusk);
      this.skyColor = `color-mix(in xyz, ${100 * (1-progress)}% skyblue, ${100 * progress}% orangered)`;
    } else if (altitude > twilight) {
      const progress = MathUtil.tween(dawnDusk, altitude, twilight);
      this.skyColor = `color-mix(in xyz, ${100 * (1-progress)}% orangered, ${100 * progress}% midnightblue)`;
    } else if (altitude > night) {
      const progress = MathUtil.tween(twilight, altitude, night);
      this.skyColor = `color-mix(in xyz, ${100 * (1-progress)}% midnightblue, ${100 * progress}% #1f252d)`;
    } else {
      this.skyColor = '#1f252d';
    }
  }

}
