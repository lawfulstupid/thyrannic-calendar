import { AppComponent } from "src/app/app.component";
import { MathUtil } from "src/app/util/math-util";
import { OrbitalMechanics } from "src/app/util/orbital-mechanics";
import { Vector } from "src/app/util/vector";
import { CelestialBg } from "../celestial-bg.component";
import { EarthComponent } from "../earth/earth.component";
import { CelestialBody } from "./celestial-body";

export abstract class IntrasolarBody extends CelestialBody {

  // Visual options
  abstract color: string;
  abstract brightness: number;
  abstract zIndex: number;
  abstract occlude: boolean;

  path: { enabled: boolean, min?: Array<string>, max?: Array<string>, day?: Array<string> } = { enabled: false };

  // Occlusion variables
  equatorialIllumination: number = 1;
  illuminationDirection: number = 0;

  // ecliptic plane = plane in which Earth orbits sun
  // orbital plane = plane in which object (sun/moon) orbits Earth
  // longitude = sidereal angle
  // argument = relative angle
  // anomaly = angle from periapsis to object position
  abstract readonly inclination: number; // angle from ecliptic plane to orbital plane
  abstract readonly ascendingNodeLongitude: number; // longitude of intersection between ecliptic and orbital planes
  abstract readonly periapsisArgument: number; // angle from longitude of ascending node to periapsis
  abstract readonly eccentricity: number; // eccentricity (0=circle, 0-1=eclipse, 1=parabola)
  abstract readonly originAngle: number; // anomaly at epoch
  abstract readonly orbitalPeriod: number; // orbital period (fractional days)
  abstract readonly meanDistance: number; // centre-to-centre distance (km) along semi-major axis of ellipse
  abstract readonly radius: number; // radius of object (km)
  distance!: number;
  trueLongitude!: number;
  override rightAscension!: number;
  override declination!: number;

  public override update() {
    ({ distance: this.distance, trueLongitude: this.trueLongitude } = OrbitalMechanics.computeDistLong(this, AppComponent.instance.datetime));
    ({ rightAscension: this.rightAscension, declination: this.declination } = OrbitalMechanics.DistLong2RaDec(this));
    super.update();
    if (this.occlude) OrbitalMechanics.updateOcclusion(this);
    this.updatePath();
  }

  // how many degrees in the sky it takes up
  get angularDiameter(): number {
    return MathUtil.rad2deg(Math.acos(1 - 2 * (this.radius/this.distance) ** 2));
  }

  // mean anomaly (0 at periapsis; increases uniformly with time)
  meanAnomaly(d: number): number {
    return MathUtil.fixAngle(this.meanLongitude(d) - this.periapsisLongitude);
  }

  // longitude of periapsis
  get periapsisLongitude(): number {
    return MathUtil.fixAngle(this.ascendingNodeLongitude + this.periapsisArgument);
  }

  // epoch of periapsis (in fractional days)
  get periapsisEpoch(): number {
    return (this.periapsisArgument - this.originAngle) * (this.orbitalPeriod / 360);
  }

  // mean longitude
  meanLongitude(d: number): number {
    return MathUtil.fixAngle(this.originAngle + (360 / this.orbitalPeriod) * d);
  }

  // time of periapsis
  periapsisTime(d: number): number {
    return this.periapsisEpoch - (this.meanAnomaly(d) / 360) / this.orbitalPeriod;
  }

  // min and max declination
  declinationMinMax(): [number, number] {
    return [this.inclination - EarthComponent.TILT, this.inclination + EarthComponent.TILT];
  }

  public vectorFromEarth(): Vector {
    return Vector.fromRAD(this.rightAscension, this.declination, this.distance);
  }

  updatePath() {
    if (!this.path.enabled) return;
    const [decMin, decMax] = this.declinationMinMax();
    this.path = {
      enabled: true,
      max: OrbitalMechanics.skyPath(CelestialBg.sun.rightAscension, decMax),
      min: OrbitalMechanics.skyPath(CelestialBg.sun.rightAscension, decMin),
      day: OrbitalMechanics.skyPath(CelestialBg.sun.rightAscension, CelestialBg.sun.declination)
    }
  }

}