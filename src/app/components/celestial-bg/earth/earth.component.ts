import { Component } from '@angular/core';
import { TemporalUnit } from 'src/app/model/temporal-unit';
import { TDateTime } from 'src/app/model/thyrannic-date-time';
import { CelestialMechanics } from 'src/app/util/celestial-mechanics';
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

  skyColor: string = 'skyblue';
  groundColor: string = 'green';
  groundBrightness: number = 1;

  public static get SUNRISE_SUNSET_START() { return 5 * CelestialBody.sun.angularDiameter; }
  public static get HORIZON() { return 0; }
  public static get SUNRISE_SUNSET() { return -5 * CelestialBody.sun.angularDiameter / 2; }
  public static get ASTRONOMICAL_DAWN_DUSK() { return -18; }

  public update(datetime: TDateTime) {
    this.updateSky();
    this.updateGround(datetime);
  }

  private updateSky() {
    const solarAltitude = CelestialBody.sun.altitude;
    if (solarAltitude > EarthComponent.HORIZON) {
      const progress = MathUtil.tween(EarthComponent.SUNRISE_SUNSET_START, solarAltitude, EarthComponent.HORIZON);
      this.skyColor = `color-mix(in xyz, ${100 * (1-progress)}% skyblue, ${100 * progress}% orangered)`;
    } else if (solarAltitude > EarthComponent.SUNRISE_SUNSET) {
      const progress = MathUtil.tween(EarthComponent.HORIZON, solarAltitude, EarthComponent.SUNRISE_SUNSET);
      this.skyColor = `color-mix(in xyz, ${100 * (1-progress)}% orangered, ${100 * progress}% midnightblue)`;
    } else {
      const progress = MathUtil.tween(EarthComponent.SUNRISE_SUNSET, solarAltitude, EarthComponent.ASTRONOMICAL_DAWN_DUSK);
      this.skyColor = `color-mix(in xyz, ${100 * (1-progress)}% midnightblue, ${100 * progress}% #1f252d)`;
    }
  }

  private updateGround(datetime: TDateTime) {
    // Update brightness
    const altitude = CelestialBody.sun.altitude;
    if (altitude > EarthComponent.SUNRISE_SUNSET) {
      this.groundBrightness = 1 - MathUtil.clamp(0, MathUtil.tween(EarthComponent.SUNRISE_SUNSET_START, altitude, EarthComponent.SUNRISE_SUNSET), 0.80);
    } else {
      this.groundBrightness = 1 - MathUtil.clamp(0.80, MathUtil.tween(EarthComponent.SUNRISE_SUNSET, altitude, EarthComponent.ASTRONOMICAL_DAWN_DUSK), 0.90);
    }

    // Update color
    // It takes time for change in daylight hours to affect temperature
    const { declination } = CelestialMechanics.computeRADD(CelestialBody.sun, datetime.add(-6, TemporalUnit.WEEK));
    const dayLength = CelestialMechanics.getDayLength(declination);
    const progress = MathUtil.tween(10, dayLength, 8);
    this.groundColor = `color-mix(in xyz, ${100 * (1-progress)}% green, ${100 * progress}% snow)`
  }

}
