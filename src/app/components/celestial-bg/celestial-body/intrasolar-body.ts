import { AppComponent } from "src/app/app.component";
import { TDate } from "src/app/model/thyrannic-date";
import { MathUtil } from "src/app/util/math-util";
import { AzAlt, Orbital, OrbitalMechanics } from "src/app/util/orbital-mechanics";
import { Vector } from "src/app/util/vector";
import { angle, distance, time } from "../../../util/units";
import { CelestialBg } from "../celestial-bg.component";
import { Earth } from "../earth/earth";
import { CelestialBody } from "./celestial-body";

export abstract class IntrasolarBody extends CelestialBody {

  public static readonly templateUrl = '../celestial-body/intrasolar-body.html';
  public static readonly styleUrl = '../celestial-body/intrasolar-body.scss';

  get id(): string {
    return (<any>this.constructor).ID;
  }

  // Makes sun, moons, and planets bigger for visual clarity
  public static readonly EMBIGGENMENT_FACTOR = 3;

  // Visual options
  abstract color: string;
  abstract brightness: number;
  abstract occlude: boolean;

  skyPath: {
    enabled: boolean,
    min: Array<AzAlt>,
    max: Array<AzAlt>,
    day: Array<AzAlt>,
    date: TDate
  } | { enabled: null } = { enabled: null };

  // Occlusion variables
  equatorialIllumination: number = 1;
  illuminationDirection: angle = 0;
  get pointOpacity(): number {
    const starOpacity = MathUtil.clamp(0.5, CelestialBg.stars.opacity, 1) * 2;
    return MathUtil.clamp(0, this.equatorialIllumination * starOpacity, 1);
  }

  // ecliptic plane = plane in which Earth orbits sun
  // orbital plane = plane in which object (sun/moon) orbits Earth
  // longitude = sidereal angle
  // argument = relative angle
  // anomaly = angle from periapsis to object position
  abstract readonly heliocentric: boolean;
  abstract readonly inclination: angle; // angle from ecliptic plane to orbital plane
  abstract readonly ascendingNodeLongitude: angle; // longitude of intersection between ecliptic and orbital planes
  abstract readonly periapsisArgument: angle; // angle from longitude of ascending node to periapsis
  abstract readonly eccentricity: number; // eccentricity (0=circle, 0-1=eclipse, 1=parabola)
  abstract readonly originAngle: angle; // anomaly at epoch
  abstract readonly orbitalPeriod: time; // orbital period (sidereal; fractional days)
  abstract readonly meanDistance: distance; // centre-to-centre distance (km) along semi-major axis of ellipse
  abstract readonly radius: distance; // radius of object (km)
  distance!: distance;
  trueLongitude!: angle;
  override rightAscension!: angle;
  override declination!: angle;

  constructor() {
    super();
    CelestialBg.register(this);
  }

  public override updatePosition() {
    ({ distance: this.distance, trueLongitude: this.trueLongitude } = OrbitalMechanics.computeDistLong(this, AppComponent.instance.datetime));
    ({ distance: this.distance, rightAscension: this.rightAscension, declination: this.declination } = OrbitalMechanics.DistLong2RaDec(this));
    super.updatePosition();
    if (this.occlude) OrbitalMechanics.updateOcclusion(this);
  }

  public override updateScreenPosition() {
    super.updateScreenPosition();
    this.updatePath();
  }

  // how many degrees in the sky it takes up
  get angularDiameter(): angle {
    return MathUtil.acos(1 - 2 * (this.radius / this.distance) ** 2);
  }

  get embiggenmentFactor(): number {
    return IntrasolarBody.EMBIGGENMENT_FACTOR;
  }

  // mean anomaly (0 at periapsis; increases uniformly with time)
  // M = (originAngle - ascendingNodeLongitude - periapsisArgument) + (1/orbitalPeriod) * d
  meanAnomaly(d: time): angle {
    return MathUtil.fixAngle(this.meanLongitude(d) - this.periapsisLongitude);
  }

  // longitude of periapsis
  get periapsisLongitude(): angle {
    return MathUtil.fixAngle(this.ascendingNodeLongitude + this.periapsisArgument);
  }

  // epoch of periapsis (in fractional days)
  get periapsisEpoch(): time {
    return (this.periapsisArgument - this.originAngle) * (this.orbitalPeriod / 360);
  }

  // mean longitude
  meanLongitude(d: time): angle {
    return MathUtil.fixAngle(this.originAngle + (360 / this.orbitalPeriod) * d);
  }

  // time of periapsis
  periapsisTime(d: time): time {
    return this.periapsisEpoch - (this.meanAnomaly(d) / 360) / this.orbitalPeriod;
  }

  // min and max declination
  declinationMinMax(): [angle, angle] {
    return [this.inclination - Earth.TILT, this.inclination + Earth.TILT];
  }

  public vectorFromEarth(): Vector {
    return Vector.fromSpherical(this.rightAscension, this.declination, this.distance);
  }

  updatePath(state: boolean | null = this.skyPath.enabled) {
    if (!state) {
      if (this.skyPath.enabled) this.skyPath.enabled = false;
      return;
    }

    // Try to get current values to avoid recalculation
    let min, max, day: Array<AzAlt> | undefined = undefined;
    if (this.skyPath.enabled !== null) {
      min = this.skyPath.min;
      max = this.skyPath.max;
      if (AppComponent.instance.datetime.date.diff(this.skyPath.date) === 0) {
        day = this.skyPath.day;
      }
    }

    const [decMin, decMax] = this.declinationMinMax();
    this.skyPath = {
      enabled: true,
      min: min || OrbitalMechanics.skyPath(CelestialBg.sun.rightAscension, decMin),
      max: max || OrbitalMechanics.skyPath(CelestialBg.sun.rightAscension, decMax),
      day: day || OrbitalMechanics.skyPath(CelestialBg.sun.rightAscension, this.declination),
      date: AppComponent.instance.datetime.date
    }
  }
}

export abstract class GeocentricBody extends IntrasolarBody implements Orbital {
  override readonly heliocentric = false;
}

export abstract class HeliocentricBody extends IntrasolarBody implements Orbital {
  override readonly heliocentric = true;
  override readonly occlude = true;
}
