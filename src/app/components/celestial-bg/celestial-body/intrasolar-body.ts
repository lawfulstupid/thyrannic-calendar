import { AppComponent } from "src/app/app.component";
import { MathUtil } from "src/app/util/math-util";
import { Orbital, OrbitalMechanics } from "src/app/util/orbital-mechanics";
import { Vector } from "src/app/util/vector";
import { angle, distance, time } from "../../../util/units";
import { CelestialBg } from "../celestial-bg.component";
import { Earth } from "../earth/earth";
import { CelestialBody } from "./celestial-body";

export abstract class IntrasolarBody extends CelestialBody {

  public static readonly templateUrl = '../celestial-body/intrasolar-body.html';
  public static readonly styleUrl = '../celestial-body/intrasolar-body.scss';

  // Visual options
  abstract color: string;
  abstract brightness: number;
  abstract occlude: boolean;

  path: { enabled: boolean, min?: Array<string>, max?: Array<string>, day?: Array<string> } = { enabled: false };

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
  abstract readonly radius: distance; // radius of object (km)
  abstract readonly density: number; // mean density (g/cm3)

  distance!: distance;
  trueLongitude!: angle;
  override rightAscension!: angle;
  override declination!: angle;

  constructor() {
    super();
    CelestialBg.register(this);
  }

  public override update() {
    ({ distance: this.distance, trueLongitude: this.trueLongitude } = OrbitalMechanics.computeDistLong(this, AppComponent.instance.datetime));
    ({ distance: this.distance, rightAscension: this.rightAscension, declination: this.declination } = OrbitalMechanics.DistLong2RaDec(this));
    super.update();
    if (this.occlude) OrbitalMechanics.updateOcclusion(this);
    this.updatePath();
  }

  // centre-to-centre distance (km) along semi-major axis of ellipse
  get meanDistance(): distance {
    const GM = OrbitalMechanics.G * (this.mass + (this.heliocentric ? CelestialBg.sun.mass : Earth.MASS));
    return ((GM * (this.orbitalPeriod * 60 * 60 * 24 / (2 * Math.PI)) ** 2) ** (1/3)) / 1000;
  }

  // kilograms
  get mass(): number {
    return (4 * Math.PI / 3) * (this.radius ** 3) * this.density * 10E12;
  }

  // how many degrees in the sky it takes up
  get angularDiameter(): angle {
    return MathUtil.acos(1 - 2 * (this.radius/this.distance) ** 2);
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

export abstract class GeocentricBody extends IntrasolarBody implements Orbital {
  override readonly heliocentric = false;
}

export abstract class HeliocentricBody extends IntrasolarBody implements Orbital {
  override readonly heliocentric = true;
  override readonly occlude = true;
}
