import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { TemporalUnit } from 'src/app/model/temporal-unit';
import { MathUtil } from 'src/app/util/math-util';
import { OrbitalMechanics } from 'src/app/util/orbital-mechanics';
import { Random } from 'src/app/util/random';
import { angle, deg } from '../../../util/units';
import { CelestialBg } from '../celestial-bg.component';

@Component({
  selector: EarthComponent.ID,
  templateUrl: './earth.component.html',
  styleUrl: './earth.component.scss'
})
export class EarthComponent {

  public static readonly ID = 'earth';

  constructor() {
    CelestialBg.register(this);
    this.updateTerrain();
  }

  static readonly TILT: angle = 24.12 * deg;

  skyColor: string = 'skyblue';
  groundBrightness: number = 1;
  snowCoverage: number = 0;

  terrainMap!: Array<[number, number]>;
  protected get terrainPath(): string {
    return this.terrainMap
      .concat([[180, -1], [-179, -1]])            // close the loop without intersection
      .map(([x, y]) => `${x},${-y}`).join(' ');  // join into path string
  }

  public static get SUNRISE_SUNSET_START(): angle {
    return EarthComponent.HORIZON + 5 * CelestialBg.sun.angularDiameter;
  }

  public static get HORIZON(): angle {
    const a = MathUtil.fixAngle2(Math.round(CelestialBg.sun.azimuth));
    const terrainLevel = CelestialBg.earth.terrainMap.find(([x, _]) => x === a)![1];
    return terrainLevel * 10; // to account for SVG stretching
  }

  public static get SUNRISE_SUNSET(): angle {
    return EarthComponent.HORIZON - 5 * CelestialBg.sun.angularDiameter / 2;
  }

  public static get ASTRONOMICAL_DAWN_DUSK(): angle {
    return EarthComponent.HORIZON - 18;
  }

  public update() {
    this.updateSky();
    this.updateGround();
  }

  private updateSky() {
    const solarAltitude = CelestialBg.sun.altitude;

    // Compute Rayleigh scattering
    const p = 60/8000; // ratio between atmosphere thickness and planet radius
    const sin = MathUtil.sin(solarAltitude);
    const scattering = - sin + Math.sqrt(sin ** 2 + p * 2 + p ** 2);
    const red = MathUtil.tween(p, scattering, Math.sqrt(p * 2 + p ** 2));
    const baseColor = `color-mix(in xyz, skyblue, ${100 * red}% orangered)`;

    if (solarAltitude > EarthComponent.SUNRISE_SUNSET) {
      const darkness = MathUtil.tween(EarthComponent.HORIZON, solarAltitude, EarthComponent.SUNRISE_SUNSET);
      this.skyColor = `color-mix(in xyz, ${baseColor}, ${100 * darkness}% midnightblue)`;
    } else {
      const darkness = MathUtil.tween(EarthComponent.SUNRISE_SUNSET, solarAltitude, EarthComponent.ASTRONOMICAL_DAWN_DUSK);
      this.skyColor = `color-mix(in xyz, midnightblue, ${100 * darkness}% #1f252d)`;
    }
  }

  private updateGround() {
    // Update brightness
    const altitude = CelestialBg.sun.altitude;
    if (altitude > EarthComponent.SUNRISE_SUNSET) {
      this.groundBrightness = 1 - MathUtil.clamp(0, MathUtil.tween(EarthComponent.HORIZON, altitude, EarthComponent.SUNRISE_SUNSET), 0.80);
    } else {
      this.groundBrightness = 1 - MathUtil.clamp(0.80, MathUtil.tween(EarthComponent.SUNRISE_SUNSET, altitude, EarthComponent.ASTRONOMICAL_DAWN_DUSK), 0.90);
    }

    // Update color
    // It takes time for change in daylight hours to affect temperature
    const { declination } = OrbitalMechanics.computeRaDec(CelestialBg.sun, AppComponent.instance.datetime.add(-4, TemporalUnit.WEEK));
    const dayLength = OrbitalMechanics.getDayLength(declination);
    this.snowCoverage = MathUtil.tween(10, dayLength, 0) * 500;
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
    this.terrainMap = hills.map((y, x) => [MathUtil.fixAngle2(x + bearing), y]);
    this.terrainMap.sort((a, b) => a[0] - b[0]);
  }

}
