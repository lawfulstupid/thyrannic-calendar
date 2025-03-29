import { AppComponent } from "src/app/app.component";
import { OrbitalMechanics } from "src/app/util/orbital-mechanics";
import { CelestialBg } from "../celestial-bg.component";

export abstract class CelestialBody {

  protected readonly celestialBodies = CelestialBg;

  // Variables based on time
  abstract rightAscension: number;
  abstract declination: number;
  azimuth: number = 0;
  altitude: number = 0;
  get zenithAngle(): number { return 90 - this.altitude; }
  get maxAltitude(): number { return 90 - AppComponent.instance.city.latitude + this.declination; }

  // On-screen position variables
  top: string = '0';
  left: string = '0';

  public update() {
    ({ azimuth: this.azimuth, altitude: this.altitude } = OrbitalMechanics.RaDec2AzAlt(this, AppComponent.instance.datetime));
    ({ top: this.top, left: this.left } = OrbitalMechanics.AzAlt2ScreenPos(this));
  }

}
