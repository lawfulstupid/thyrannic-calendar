import { AppComponent } from "../app.component";
import { CelestialBody, VisibleCelestialBody } from "../components/celestial-bg/celestial-body/celestial-body";
import { TemporalUnit } from "../model/temporal-unit";
import { TDateTime } from "../model/thyrannic-date-time";
import { MathUtil } from "./math-util";
import { Vector } from "./vector";

export class CelestialMechanics {

  private constructor() {}

  public static synodicToSiderealPeriod(p: number): number {
    return 1 / (1/p + 1/CelestialBody.sun.orbitalPeriod);
  }

  public static computeRADD(body: VisibleCelestialBody, datetime: TDateTime): { rightAscension: number, declination: number, distance: number } {
    const d = datetime.valueOf() * TemporalUnit.MINUTE.as(TemporalUnit.DAY);
    const meanAnomaly = body.meanAnomaly(d);
    const eccentricAnomaly = MathUtil.fixAngle(meanAnomaly + MathUtil.rad2deg(
      body.eccentricity * MathUtil.sin(meanAnomaly) * (
        1 + body.eccentricity * MathUtil.cos(meanAnomaly)
      )
    ));

    const xv = MathUtil.cos(eccentricAnomaly) - body.eccentricity;
    const yv = Math.sqrt(1.0 - body.eccentricity**2) * MathUtil.sin(eccentricAnomaly);
    const trueAnomaly = MathUtil.fixAngle(MathUtil.rad2deg(Math.atan2(yv, xv)));
    const distance = Math.sqrt(xv**2 + yv**2) * body.meanDistance;

    const trueLongitude = trueAnomaly + body.periapsisArgument;
    const xs = distance * MathUtil.cos(trueLongitude);
    const ys = distance * MathUtil.sin(trueLongitude);
    const zs = 0; // since the Sun always is in the ecliptic plane, zs is of course zero

    const xe = xs;
    const ye = ys * MathUtil.cos(CelestialBody.earth.tilt);
    const ze = ys * MathUtil.sin(CelestialBody.earth.tilt);

    return {
      rightAscension: MathUtil.fixAngle(MathUtil.rad2deg(Math.atan2(ye, xe))),
      declination: MathUtil.fixAngle(MathUtil.rad2deg(Math.atan2(ze, Math.sqrt(xe**2 + ye**2)))),
      distance
    };
  }

  public static RaDec2AzAlt(body: CelestialBody, datetime: TDateTime): [number, number] {
    const fractionalDay = (12 + datetime.hour + datetime.minute / 60) / 24;
    // 12PM -> solar right ascension
    // 06PM -> SRA + 90
    // 12AM -> SRA + 180
    const lmst = MathUtil.fixAngle2(fractionalDay * 360 + CelestialBody.sun.rightAscension);
    const localHourAngle = MathUtil.fixAngle2(lmst - body.rightAscension);
    const latitude = AppComponent.instance.city.latitude;

    const altitude = MathUtil.fixAngle2(MathUtil.asin(
      MathUtil.sin(latitude) * MathUtil.sin(body.declination) +
      MathUtil.cos(latitude) * MathUtil.cos(body.declination) * MathUtil.cos(localHourAngle)
    ));

    const hemisphere = latitude >= 0 ? 180 : 0;
    const azimuth = MathUtil.fixAngle2(hemisphere - MathUtil.acos(
      (MathUtil.sin(body.declination) - MathUtil.sin(altitude) * MathUtil.sin(latitude))
      / (MathUtil.cos(altitude) * MathUtil.cos(latitude))
    )) * Math.sign(MathUtil.sin(localHourAngle));

    return [azimuth, altitude];
  }

  public static onScreenPosition(body: CelestialBody): [string, string] {
    const sf = 1;
    const top = `calc(90vh - ${body.altitude*sf}vmin)`;
    const left = `calc(50vw + ${body.azimuth*sf}vmin)`;
    return [top, left];
  }

  public static updateOcclusion(body: VisibleCelestialBody) {
    const earthToMoon = body.vectorFromEarth();
    const earthToSun = CelestialBody.sun.vectorFromEarth();
    const moonToSun = earthToSun.minus(earthToMoon);
    const moonToEarth = earthToMoon.times(-1);

    // 0.0 = new moon
    // 0.5 = half moon
    // 1.0 = full moon
    // Precisely: proportion of equatorial diameter that is visible from earth
    body.equatorialIllumination = 0.5 + 0.5 * MathUtil.cos(moonToEarth.angleTo(moonToSun));

    // Direction of illumination
    // 0 = illuminated from the right
    // 90 = illuminated from below
    // 180 = illuminated from the left
    const moonToSunFlat = moonToSun.cross(earthToMoon).cross(earthToMoon);
    const northFlat = new Vector(0,1,0).cross(earthToMoon).cross(earthToMoon);
    const sunDirection = northFlat.signedAngleTo(moonToSunFlat, earthToMoon) - 90;
    const latitudeAngle = 90 - AppComponent.instance.city.latitude;
    body.illuminationDirection = MathUtil.fixAngle(sunDirection + latitudeAngle);
  }

  public static getDayLength(solarDeclination: number): number {
    const latitude = AppComponent.instance.city.latitude;
    const cos = MathUtil.tan(latitude) * MathUtil.tan(solarDeclination);
    const sunrise = MathUtil.acos(cos); // this only works because acos is clamped
    const sunset = 360 - sunrise;
    return (sunset - sunrise) / 15;
  }

}
