import { AppComponent } from "src/app/app.component";
import { OrbitalMechanics } from "src/app/util/orbital-mechanics";
import { Viewport } from "src/app/util/viewport";
import { angle, AzAlt, RaDec } from "../../../util/units";
import { CelestialBg } from "../celestial-bg.component";

export abstract class CelestialBody implements RaDec, AzAlt {

  protected readonly celestialBodies = CelestialBg;

  // Variables based on time
  abstract rightAscension: angle;
  abstract declination: angle;
  azimuth: angle = 0;
  altitude: angle = 0;
  get zenithAngle(): angle { return 90 - this.altitude; }
  get maxAltitude(): angle { return 90 - AppComponent.instance.city.latitude + this.declination; }

  // On-screen position variables
  display: boolean = false;
  screenX: number = 0;
  screenY: number = 0;
  screenSf: number = 1; // scale factor from gnomonic projection

  // Called when time or location changes
  public updatePosition() {
    ({ azimuth: this.azimuth, altitude: this.altitude } = OrbitalMechanics.RaDec2AzAlt(this, AppComponent.instance.datetime));
  }

  // Called when time, location, or bearing changes
  public updateScreenPosition() {
    const pos = Viewport.AzAlt2ScreenPos(this);
    if (this.display = pos.display) {
      ({ screenX: this.screenX, screenY: this.screenY, screenSf: this.screenSf } = pos);
    }
  }

}
