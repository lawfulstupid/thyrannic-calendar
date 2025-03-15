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

  skyColor: string = EarthComponent.SKY_COLORS.DAYLIGHT;
  groundColor: string = 'green';
  groundBrightness: number = 1;

  private static get DAYLIGHT() { return 5 * CelestialBody.sun.angularDiameter; }
  private static readonly DAWN_DUSK = 0;
  private static get TWILIGHT() { return -5 * CelestialBody.sun.angularDiameter / 2; }
  private static readonly NIGHT = -18;

  private static SKY_COLORS = {
    DAYLIGHT: 'skyblue',
    DAWN_DUSK: 'orangered',
    TWILIGHT: 'midnightblue',
    NIGHT: '#1f252d'
  }

  public update(datetime: TDateTime) {
    this.updateSky();
    this.updateGround(datetime);
  }

  private updateSky() {
    const altitude = CelestialBody.sun.altitude;
    if (altitude > EarthComponent.DAWN_DUSK) {
      const progress = MathUtil.tween(EarthComponent.DAYLIGHT, altitude, EarthComponent.DAWN_DUSK);
      this.skyColor = `color-mix(in xyz, ${100 * (1-progress)}% ${EarthComponent.SKY_COLORS.DAYLIGHT}, ${100 * progress}% ${EarthComponent.SKY_COLORS.DAWN_DUSK})`;
    } else if (altitude > EarthComponent.TWILIGHT) {
      const progress = MathUtil.tween(EarthComponent.DAWN_DUSK, altitude, EarthComponent.TWILIGHT);
      this.skyColor = `color-mix(in xyz, ${100 * (1-progress)}% ${EarthComponent.SKY_COLORS.DAWN_DUSK}, ${100 * progress}% ${EarthComponent.SKY_COLORS.TWILIGHT})`;
    } else {
      const progress = MathUtil.tween(EarthComponent.TWILIGHT, altitude, EarthComponent.NIGHT);
      this.skyColor = `color-mix(in xyz, ${100 * (1-progress)}% ${EarthComponent.SKY_COLORS.TWILIGHT}, ${100 * progress}% ${EarthComponent.SKY_COLORS.NIGHT})`;
    }
  }

  private updateGround(datetime: TDateTime) {
    // Update brightness
    const altitude = CelestialBody.sun.altitude;
    if (altitude > EarthComponent.TWILIGHT) {
      this.groundBrightness = 1 - MathUtil.clamp(0, MathUtil.tween(EarthComponent.DAYLIGHT, altitude, EarthComponent.TWILIGHT), 0.80);
    } else {
      this.groundBrightness = 1 - MathUtil.clamp(0.80, MathUtil.tween(EarthComponent.TWILIGHT, altitude, EarthComponent.NIGHT), 0.90);
    }

    // Update color
    // It takes time for change in daylight hours to affect temperature
    const { declination } = CelestialMechanics.computeRADD(CelestialBody.sun, datetime.add(-6, TemporalUnit.WEEK));
    const dayLength = CelestialMechanics.getDayLength(declination);
    const progress = MathUtil.tween(10, dayLength, 8);
    this.groundColor = `color-mix(in xyz, ${100 * (1-progress)}% green, ${100 * progress}% snow)`
  }

}
