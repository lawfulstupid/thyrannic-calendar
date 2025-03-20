import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { TemporalUnit } from 'src/app/model/temporal-unit';
import { TDateTime } from 'src/app/model/thyrannic-date-time';
import { MathUtil } from 'src/app/util/math-util';
import { OrbitalMechanics } from 'src/app/util/orbital-mechanics';
import { Random } from 'src/app/util/random';
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
    this.updateTerrain();
  }

  readonly tilt: number = 24.12;

  skyColor: string = 'skyblue';
  groundColor: string = 'green';
  groundBrightness: number = 1;

  terrainMap!: Array<[number, number]>;
  protected get terrainPath(): string {
    return this.terrainMap
      .concat([[180, 1], [-179, 1]])            // close the loop without intersection
      .map(([x, y]) => `${x},${y}`).join(' ');  // join into path string
  }

  public static get SUNRISE_SUNSET_START(): number {
    return EarthComponent.HORIZON + 5 * CelestialBody.sun.angularDiameter;
  }
  public static get HORIZON(): number {
    const a = Math.floor(CelestialBody.sun.azimuth);
    const terrainLevel = CelestialBody.earth.terrainMap.find(([x, _]) => x === a)![1];
    return terrainLevel * -10; // to account for SVG stretching
  }
  public static get SUNRISE_SUNSET(): number {
    return EarthComponent.HORIZON - 5 * CelestialBody.sun.angularDiameter / 2;
  }
  public static get ASTRONOMICAL_DAWN_DUSK(): number {
    return EarthComponent.HORIZON - 18;
  }

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
    const { declination } = OrbitalMechanics.computeRaDec(CelestialBody.sun, datetime.add(-6, TemporalUnit.WEEK));
    const dayLength = OrbitalMechanics.getDayLength(declination);
    const progress = MathUtil.tween(10, dayLength, 8);
    this.groundColor = `color-mix(in xyz, ${100 * (1-progress)}% green, ${100 * progress}% snow)`;
  }

  public updateTerrain() {
    const rng = new Random(AppComponent.instance.city.name);
    const bearing: number = AppComponent.instance.bearing.angle;

    function displaceMidpoint(arr: Array<number>, idx1: number, idx2: number, roughness: number) {
      if (Math.abs(idx1 - idx2) <= 1) return;
      const m = Math.floor((idx1 + idx2) / 2);
      if (arr[m] !== undefined) return;
      const midValue = (arr[idx1] + arr[idx2]) / 2;
      arr[m] = rng.between(Math.max(midValue - roughness, 0), Math.min(midValue + roughness, 1));
      displaceMidpoint(arr, idx1, m, roughness / 2);
      displaceMidpoint(arr, m, idx2, roughness / 2);
    }

    // Generate terrain
    const hills: Array<number> = new Array(360).fill(undefined);
    hills[0] = rng.between(0, 0.5);
    hills[hills.length - 1] = hills[0];
    displaceMidpoint(hills, 0, hills.length - 1, 1);

    // adjust for bearing
    this.terrainMap = hills.map((y, x) => [MathUtil.fixAngle2(x + bearing), -y]);
    this.terrainMap.sort((a, b) => a[0] - b[0]);
  }

}
