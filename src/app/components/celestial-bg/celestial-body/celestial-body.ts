import { AppComponent } from "src/app/app.component";
import { TemporalUnit } from "src/app/model/temporal-unit";
import { TDateTime } from "src/app/model/thyrannic-date-time";
import { MathUtil } from "src/app/util/math-util";
import { Vector } from "src/app/util/vector";
import { EarthComponent } from "../earth/earth.component";
import { ArukmaComponent } from "./arukma.component";
import { LositComponent } from "./losit.component";
import { SunComponent } from "./sun.component";

export abstract class CelestialBody {
  
  readonly celestialBodies = CelestialBody;
  
  public static sun: SunComponent;
  public static arukma: ArukmaComponent;
  public static losit: LositComponent;
  public static earth: EarthComponent;
  
  public static update(datetime: TDateTime = AppComponent.instance.datetime) {
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
  abstract occlude: boolean;

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
    this.computeRAD(datetime);
    this.computeApparentPosition(datetime);
    if (this.occlude) this.computeOcclusion(datetime);
  }

  private computeRAD(datetime: TDateTime) {
    const d = datetime.valueOf() * TemporalUnit.MINUTE.as(TemporalUnit.DAY);
    const E = MathUtil.fixAngle(this.meanAnomaly(d) + MathUtil.rad2deg(
      this.eccentricity * MathUtil.sin(this.meanAnomaly(d)) * (
        1 + this.eccentricity * MathUtil.cos(this.meanAnomaly(d))
      )
    ));

    const xv = MathUtil.cos(E) - this.eccentricity;
    const yv = Math.sqrt(1.0 - this.eccentricity**2) * MathUtil.sin(E);
    const v = MathUtil.fixAngle(MathUtil.rad2deg(Math.atan2(yv, xv)));
    this.distance = Math.sqrt(xv**2 + yv**2) * this.meanDistance;

    const true_long = v + this.periapsisArgument;
    const xs = this.distance * MathUtil.cos(true_long);
    const ys = this.distance * MathUtil.sin(true_long);

    const xe = xs;
    const ye = ys * MathUtil.cos(CelestialBody.earth.tilt);
    const ze = ys * MathUtil.sin(CelestialBody.earth.tilt);

    this.rightAscension = MathUtil.fixAngle(MathUtil.rad2deg(Math.atan2(ye, xe)));
    this.declination = MathUtil.fixAngle(MathUtil.rad2deg(Math.atan2(ze, Math.sqrt(xe**2 + ye**2))));
  }
  

  // Variables based on time
  rightAscension: number = 0;
  declination: number = 0;
  distance: number = 0;
  zenithAngle: number = 0;
  get altitude(): number { return 90 - this.zenithAngle; }
  localHourAngle: number = 0;
  
  public vectorFromEarth(): Vector {
    return Vector.fromRAD(this.rightAscension, this.declination, this.distance);
  }
  
  public static RAD2LHAZA(datetime: TDateTime, rightAscension: number, declination: number): [number, number] {
    const fractionalDay = (12 + datetime.hour + datetime.minute / 60) / 24;
    // 12PM -> solar right ascension
    // 06PM -> SRA + 90
    // 12AM -> SRA + 180
    const lmst = MathUtil.fixAngle2(fractionalDay * 360 + CelestialBody.sun.rightAscension);
    const localHourAngle = MathUtil.fixAngle2(lmst - rightAscension);
    const zenithAngle = MathUtil.rad2deg(Math.acos(
      MathUtil.sin(AppComponent.instance.city.latitude) * MathUtil.sin(declination) +
      MathUtil.cos(AppComponent.instance.city.latitude) * MathUtil.cos(declination) * MathUtil.cos(localHourAngle)
    ));
    return [localHourAngle, zenithAngle];
  }

  private computeApparentPosition(datetime: TDateTime) {
    [this.localHourAngle, this.zenithAngle] = CelestialBody.RAD2LHAZA(datetime, this.rightAscension, this.declination);

    // degFromTop = 0 => top = 90vmin above horizon
    // degFromTop = 90 => top = 0 above horizon
    // horizon = 90vh
    this.top = `calc(90vh + ${this.zenithAngle - 90}vmin)`;
    // lha = 0 => left = 50vw
    // lha = 20 => left = 50vw + 20vmin
    this.left = `calc(50vw + ${this.localHourAngle}vmin)`;
  }

  top: string = '0';
  left: string = '0';
  
  
  private computeOcclusion(datetime: TDateTime) {
    const earthToMoon = this.vectorFromEarth();
    const earthToSun = CelestialBody.sun.vectorFromEarth();
    const moonToSun = earthToSun.minus(earthToMoon);
    const moonToEarth = earthToMoon.times(-1);
    
    
    // 0.0 = new moon
    // 0.5 = half moon
    // 1.0 = full moon
    // Precisely: proportion of equatorial diameter that is visible from earth
    this.equatorialIllumination = 0.5 + 0.5 * MathUtil.cos(moonToEarth.angleTo(moonToSun));
    
    // Direction of illumination
    // 0 = illuminated from the right
    // 90 = illuminated from below
    // 180 = illuminated from the left
    const moonToSunFlat = moonToSun.cross(earthToMoon).cross(earthToMoon);
    const northFlat = new Vector(0,1,0).cross(earthToMoon).cross(earthToMoon);
    const sunDirection = northFlat.signedAngleTo(moonToSunFlat, earthToMoon) - 90;
    const latitudeAngle = 90 - AppComponent.instance.city.latitude;
    this.illuminationDirection = MathUtil.fixAngle(sunDirection + latitudeAngle);
  }
  
  equatorialIllumination: number = 1;
  illuminationDirection: number = 0;

}
