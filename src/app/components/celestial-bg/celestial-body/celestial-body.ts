import { AppComponent } from "src/app/app.component";
import { TDateTime } from "src/app/model/thyrannic-date-time";
import { MathUtil } from "src/app/util/math-util";
import { OrbitalMechanics } from "src/app/util/orbital-mechanics";
import { Vector } from "src/app/util/vector";
import { EarthComponent } from "../earth/earth.component";
import { StarsComponent } from "../stars/stars.component";
import { ArukmaComponent } from "./arukma.component";
import { LositComponent } from "./losit.component";
import { SunComponent } from "./sun.component";

export abstract class CelestialBody {

  readonly celestialBodies = CelestialBody;

  public static sun: SunComponent;
  public static arukma: ArukmaComponent;
  public static losit: LositComponent;
  public static earth: EarthComponent;
  public static stars: StarsComponent;

  public static update(datetime: TDateTime = AppComponent.instance.datetime) {
    this.sun.update(datetime);
    this.arukma.update(datetime);
    this.losit.update(datetime);
    this.earth.update(datetime);
    this.stars.update(datetime);
  }

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

  public update(datetime: TDateTime) {
    ({ azimuth: this.azimuth, altitude: this.altitude } = OrbitalMechanics.RaDec2AzAlt(this, datetime));
    ({ top: this.top, left: this.left } = OrbitalMechanics.AzAlt2ScreenPos(this));
  }

}

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

  public override update(datetime: TDateTime) {
    ({ distance: this.distance, trueLongitude: this.trueLongitude } = OrbitalMechanics.computeDistLong(this, datetime));
    ({ rightAscension: this.rightAscension, declination: this.declination } = OrbitalMechanics.DistLong2RaDec(this));
    super.update(datetime);
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
    return [this.inclination - CelestialBody.earth.tilt, this.inclination + CelestialBody.earth.tilt];
  }

  public vectorFromEarth(): Vector {
    return Vector.fromRAD(this.rightAscension, this.declination, this.distance);
  }

  updatePath() {
    if (!this.path.enabled) return;
    const [decMin, decMax] = this.declinationMinMax();
    this.path = {
      enabled: true,
      max: OrbitalMechanics.skyPath(CelestialBody.sun.rightAscension, decMax),
      min: OrbitalMechanics.skyPath(CelestialBody.sun.rightAscension, decMin),
      day: OrbitalMechanics.skyPath(CelestialBody.sun.rightAscension, CelestialBody.sun.declination)
    }
  }

}
