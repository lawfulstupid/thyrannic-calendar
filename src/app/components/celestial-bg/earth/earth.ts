import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { TemporalUnit } from 'src/app/model/temporal-unit';
import { MathUtil } from 'src/app/util/math-util';
import { AzAlt, OrbitalMechanics } from 'src/app/util/orbital-mechanics';
import { Random } from 'src/app/util/random';
import { angle, deg } from '../../../util/units';
import { CelestialBg } from '../celestial-bg.component';

@Component({
  selector: Earth.ID,
  templateUrl: './earth.html',
  styleUrl: './earth.scss'
})
export class Earth {

  public static readonly ID = 'earth';

  constructor() {
    CelestialBg.register(this);
    this.generateTerrainMap();
  }

  static readonly TILT: angle = 24.12 * deg;

  skyColor: string = 'skyblue';
  groundBrightness: number = 1;
  snowCoverage: number = 0;

  terrainMap!: Array<AzAlt>;
  terrainPath: string = '';

  public static get SUNRISE_SUNSET_START(): angle {
    return Earth.HORIZON + CelestialBg.sun.angularDiameter * CelestialBg.sun.embiggenmentFactor;
  }

  public static get HORIZON(): angle {
    const a = MathUtil.fixAngle(Math.round(CelestialBg.sun.azimuth));
    return CelestialBg.earth.terrainMap.find(({ azimuth }) => azimuth === a)!.altitude;
  }

  public static get SUNRISE_SUNSET(): angle {
    return Earth.HORIZON - CelestialBg.sun.angularDiameter * CelestialBg.sun.embiggenmentFactor / 2;
  }

  public static get ASTRONOMICAL_DAWN_DUSK(): angle {
    return Earth.HORIZON - 18;
  }

  // Should be called in response to positions of celestial bodies changing
  public onUpdateSunPosition() {
    this.updateSky();
    this.updateGround();
  }

  // Should be called when selected city changes
  public updateLocation() {
    this.generateTerrainMap();
  }

  // Should be called when bearing changes
  public updateBearing() {
    this.updateTerrainPath();
  }

  private updateSky() {
    const solarAltitude = CelestialBg.sun.altitude;

    // Compute Rayleigh scattering
    const p = 60/8000; // ratio between atmosphere thickness and planet radius
    const sin = MathUtil.sin(solarAltitude);
    const scattering = - sin + Math.sqrt(sin ** 2 + p * 2 + p ** 2);
    const red = MathUtil.tween(p, scattering, Math.sqrt(p * 2 + p ** 2));
    const baseColor = `color-mix(in xyz, skyblue, ${100 * red}% orangered)`;

    if (solarAltitude > Earth.SUNRISE_SUNSET) {
      const darkness = MathUtil.tween(Earth.HORIZON, solarAltitude, Earth.SUNRISE_SUNSET);
      this.skyColor = `color-mix(in xyz, ${baseColor}, ${100 * darkness}% midnightblue)`;
    } else {
      const darkness = MathUtil.tween(Earth.SUNRISE_SUNSET, solarAltitude, Earth.ASTRONOMICAL_DAWN_DUSK);
      this.skyColor = `color-mix(in xyz, midnightblue, ${100 * darkness}% #1f252d)`;
    }
  }

  private updateGround() {
    // Update brightness
    const altitude = CelestialBg.sun.altitude;
    if (altitude > Earth.SUNRISE_SUNSET) {
      this.groundBrightness = 1 - MathUtil.clamp(0, MathUtil.tween(Earth.HORIZON, altitude, Earth.SUNRISE_SUNSET), 0.80);
    } else {
      this.groundBrightness = 1 - MathUtil.clamp(0.80, MathUtil.tween(Earth.SUNRISE_SUNSET, altitude, Earth.ASTRONOMICAL_DAWN_DUSK), 0.90);
    }

    // Update color
    // It takes time for change in daylight hours to affect temperature
    const { declination } = OrbitalMechanics.computeRaDec(CelestialBg.sun, AppComponent.instance.datetime.add(-4, TemporalUnit.WEEK));
    const dayLength = OrbitalMechanics.getDayLength(declination);
    this.snowCoverage = MathUtil.tween(10, dayLength, 0) * 500;
  }

  private generateTerrainMap() {
    const rng = new Random(AppComponent.instance.city.name);

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
    hills[0] = rng.between(0, 1);
    hills[hills.length - 1] = hills[0];
    displaceMidpoint(hills, 0, hills.length - 1, 1);

    this.terrainMap = hills.map((y, x) => ({ azimuth: x, altitude: y * 10 - 5 }));
    this.updateTerrainPath();
  }

  private updateTerrainPath() {
    this.terrainPath = this.terrainMap
      // Map onto viewport
      .map(point => OrbitalMechanics.AzAlt2ScreenPos(point))
      // Remove culled points
      .filter(pos => pos.display)
      // Sort left to right
      .sort((a, b) => a.screenX - b.screenX)
      // close the loop without intersection
      .concat([{ display: true, screenX: 1000, screenY: -100, scale: 1 }, { display: true, screenX: -1000, screenY: -100, scale: 1 }])
      // join into path string
      .map(({ screenX, screenY }) => `${screenX},${(90 - screenY)}`).join(' ');
  }

}
