import { TemporalUnit } from "src/app/model/temporal-unit";
import { TDateTime } from "src/app/model/thyrannic-date-time";
import { MathUtil } from "src/app/util/math-util";
import { EarthComponent } from "../earth/earth.component";
import { ArukmaComponent } from "./arukma.component";
import { LositComponent } from "./losit.component";
import { SunComponent } from "./sun.component";

export abstract class CelestialBody {
  
  public static sun: SunComponent;
  public static arukma: ArukmaComponent;
  public static losit: LositComponent;
  public static earth: EarthComponent;
  
  public static update(datetime: TDateTime) {
    this.sun.update(datetime);
    this.arukma.update(datetime);
    this.losit.update(datetime);
    this.earth.update(datetime);
  }

  static synodicToSiderealPeriod(p: number): number {
    return 1 / (1/p + 1/CelestialBody.sun.orbitalPeriod);
  }

  // Visual options
  abstract color: string;
  abstract brightness: number;
  abstract zIndex: number;

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

  private update(datetime: TDateTime) {
    this.computeDaRA(datetime);
    this.computeApparentPosition(datetime);
  }

  private computeDaRA(datetime: TDateTime) {
    const d = datetime.valueOf() * TemporalUnit.MINUTE.as(TemporalUnit.DAY);
    const E = MathUtil.fixAngle(this.meanAnomaly(d) + MathUtil.rad2deg(
      this.eccentricity * Math.sin(MathUtil.deg2rad(this.meanAnomaly(d))) * (
        1 + this.eccentricity * Math.cos(MathUtil.deg2rad(this.meanAnomaly(d)))
      )
    ));

    const xv = Math.cos(MathUtil.deg2rad(E)) - this.eccentricity;
    const yv = Math.sqrt(1.0 - this.eccentricity**2) * Math.sin(MathUtil.deg2rad(E));
    const v = MathUtil.fixAngle(MathUtil.rad2deg(Math.atan2(yv, xv)));
    this.distance = Math.sqrt(xv**2 + yv**2) * this.meanDistance;

    const true_long = v + this.periapsisArgument;
    const xs = this.distance * Math.cos(MathUtil.deg2rad(true_long));
    const ys = this.distance * Math.sin(MathUtil.deg2rad(true_long));

    const xe = xs;
    const ye = ys * Math.cos(MathUtil.deg2rad(CelestialBody.earth.tilt));
    const ze = ys * Math.sin(MathUtil.deg2rad(CelestialBody.earth.tilt));

    this.rightAscension = MathUtil.fixAngle(MathUtil.rad2deg(Math.atan2(ye, xe)));
    this.declination = MathUtil.fixAngle(MathUtil.rad2deg(Math.atan2(ze, Math.sqrt(xe**2 + ye**2))));
  }

  // Variables based on time
  rightAscension: number = 0;
  declination: number = 0;
  distance: number = 0;

  private computeApparentPosition(datetime: TDateTime) {
    const fractionalDay = (12 + datetime.hour + datetime.minute / 60) / 24;

    // 12PM -> solar right ascension
    // 06PM -> SRA + 90
    // 12AM -> SRA + 180
    const lmst = MathUtil.fixAngle2(fractionalDay * 360 + CelestialBody.sun.rightAscension);
    const lha = MathUtil.fixAngle2(lmst - this.rightAscension);

    const degFromTop = MathUtil.rad2deg(Math.acos(
      Math.sin(MathUtil.deg2rad(CelestialBody.earth.latitude)) * Math.sin(MathUtil.deg2rad(this.declination)) +
      Math.cos(MathUtil.deg2rad(CelestialBody.earth.latitude)) * Math.cos(MathUtil.deg2rad(this.declination)) * Math.cos(MathUtil.deg2rad(lha))
    ));

    // 0 degFromTop = top: 0vh
    // 90 degFromTop = top: 80vh
    this.top = (degFromTop * 8/9) + 'vh';
    this.left = `calc(50vw + ${lha * 8/9}vh)`;
  }

  top: string = '0';
  left: string = '0';

}
