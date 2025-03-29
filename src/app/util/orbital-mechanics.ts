import { AppComponent } from "../app.component";
import { CelestialBg } from "../components/celestial-bg/celestial-bg.component";
import { IntrasolarBody } from "../components/celestial-bg/celestial-body/intrasolar-body";
import { EarthComponent } from "../components/celestial-bg/earth/earth.component";
import { TemporalUnit } from "../model/temporal-unit";
import { TDate } from "../model/thyrannic-date";
import { TDateTime } from "../model/thyrannic-date-time";
import { MathUtil } from "./math-util";
import { angle, distance, minutes, time } from "./units";
import { Vector } from "./vector";

export type DistLong = { distance: distance, trueLongitude: angle };
export type RaDec = { rightAscension: angle, declination: angle };
export type AzAlt = { azimuth: angle, altitude: angle };
export type ScreenPos = { top: string, left: string };

export class OrbitalMechanics {

  private constructor() {}

  public static synodicToSiderealPeriod(p: time): time {
    return 1 / (1/p + 1/CelestialBg.sun.orbitalPeriod);
  }

  // Computes true longitude + distance to an object
  public static computeDistLong(body: IntrasolarBody, datetime: TDateTime): DistLong {
    const d = datetime.valueOf() * minutes;
    const meanAnomaly = body.meanAnomaly(d);
    const eccentricAnomaly = MathUtil.fixAngle(meanAnomaly + MathUtil.rad2deg(
      body.eccentricity * MathUtil.sin(meanAnomaly) * (
        1 + body.eccentricity * MathUtil.cos(meanAnomaly)
      )
    ));

    // Compute distance, true anomaly, true longitude
    const xv = MathUtil.cos(eccentricAnomaly) - body.eccentricity;
    const yv = Math.sqrt(1.0 - body.eccentricity**2) * MathUtil.sin(eccentricAnomaly);
    const trueAnomaly = MathUtil.fixAngle(MathUtil.atan2(yv, xv));

    return {
      distance: Math.sqrt(xv**2 + yv**2) * body.meanDistance,
      trueLongitude: trueAnomaly + body.periapsisArgument
    }
  }

  // Converts distance + true longitude + inclination to right ascension + declination
  public static DistLong2RaDec(body: DistLong & { inclination: angle }): RaDec {
    // Compute ecliptic rectangular geocentric coordinates
    const xs = body.distance * MathUtil.cos(body.inclination) * MathUtil.cos(body.trueLongitude);
    const ys = body.distance * MathUtil.cos(body.inclination) * MathUtil.sin(body.trueLongitude);
    const zs = body.distance * MathUtil.sin(body.inclination);

    // Compute equatorial rectangular geocentric coordinates
    const xe = xs;
    const ye = ys * MathUtil.cos(EarthComponent.TILT) - zs * MathUtil.sin(EarthComponent.TILT);
    const ze = ys * MathUtil.sin(EarthComponent.TILT) + zs * MathUtil.cos(EarthComponent.TILT);

    // Compute right ascension and declination
    return {
      rightAscension: MathUtil.fixAngle(MathUtil.atan2(ye, xe)),
      declination: MathUtil.fixAngle(MathUtil.atan2(ze, Math.sqrt(xe**2 + ye**2))),
    }
  }

  // Computes right ascension + declination for an object
  public static computeRaDec(body: IntrasolarBody, datetime: TDateTime): RaDec {
    const distLong = OrbitalMechanics.computeDistLong(body, datetime);
    return OrbitalMechanics.DistLong2RaDec({ ...distLong, inclination: body.inclination });
  }

  // Converts right ascension + declination to azimuth + altitude
  public static RaDec2AzAlt(body: RaDec, datetime: TDateTime): AzAlt {
    const fractionalDay = (12 + datetime.hour + datetime.minute / 60) / 24;
    // 12PM -> solar right ascension
    // 06PM -> SRA + 90
    // 12AM -> SRA + 180
    const lmst = MathUtil.fixAngle2(fractionalDay * 360 + CelestialBg.sun.rightAscension);
    const localHourAngle = MathUtil.fixAngle2(lmst - body.rightAscension);
    const latitude = AppComponent.instance.city.latitude;

    const altitude = MathUtil.fixAngle2(MathUtil.asin(
      MathUtil.sin(latitude) * MathUtil.sin(body.declination) +
      MathUtil.cos(latitude) * MathUtil.cos(body.declination) * MathUtil.cos(localHourAngle)
    ));

    const azimuth = MathUtil.fixAngle2(MathUtil.atan2(
      MathUtil.sin(localHourAngle),
      MathUtil.cos(localHourAngle) * MathUtil.sin(latitude) - MathUtil.tan(body.declination) * MathUtil.cos(latitude)
    ) + AppComponent.instance.bearing.angle);

    return { azimuth, altitude };
  }

  // Converts azimuth + altitude to screen position calc
  public static AzAlt2ScreenPos(body: AzAlt): ScreenPos {
    return {
      top: `calc(90vh - ${body.altitude}vmin)`,
      left: `calc(50vw + ${body.azimuth}vmin)`
    }
  }

  public static convertToGeocentric(body: IntrasolarBody) {
    // const sunToPlanet = body.vectorFromEarth();
    // const earthToSun = CelestialBg.sun.vectorFromEarth();
    // const earthToPlanet = earthToSun.plus(sunToPlanet);
    // ({ distance: body.distance, rightAscension: body.rightAscension, declination: body.declination } = earthToPlanet.toRAD());

    const xh = body.distance * (
      MathUtil.cos(body.ascendingNodeLongitude) * MathUtil.cos(body.trueLongitude)
      - MathUtil.sin(body.ascendingNodeLongitude) * MathUtil.sin(body.trueLongitude) * MathUtil.cos(body.inclination)
    );
    const yh = body.distance * (
      MathUtil.sin(body.ascendingNodeLongitude) * MathUtil.cos(body.trueLongitude)
      + MathUtil.cos(body.ascendingNodeLongitude) * MathUtil.sin(body.trueLongitude) * MathUtil.cos(body.inclination)
    );
    const zh = body.distance * (
      MathUtil.sin(body.trueLongitude) * Math.sin(body.inclination)
    );

    // For moon (already geocentric), these should both equal 0
    const xs = body.lunar ? 0 : CelestialBg.sun.distance * MathUtil.cos(CelestialBg.sun.trueLongitude);
    const ys = body.lunar ? 0 : CelestialBg.sun.distance * MathUtil.sin(CelestialBg.sun.trueLongitude);

    const xg = xh + xs;
    const yg = yh + ys;
    const zg = zh;

    const xe = xg;
    const ye = yg * MathUtil.cos(EarthComponent.TILT) - zg * MathUtil.sin(EarthComponent.TILT);
    const ze = yg * MathUtil.sin(EarthComponent.TILT) + zg * MathUtil.cos(EarthComponent.TILT);

    // This is same as end of DistLong2RaDec()
    body.rightAscension = MathUtil.fixAngle(MathUtil.rad2deg(Math.atan2(ye, xe)));
    body.declination = MathUtil.fixAngle(MathUtil.rad2deg(Math.atan2(ze, Math.sqrt(xe**2 + ye**2))));
    body.distance = Math.sqrt(xe**2 + ye**2 + ze**2);
  }

  public static updateOcclusion(body: IntrasolarBody) {
    const earthToMoon = body.vectorFromEarth();
    const earthToSun = CelestialBg.sun.vectorFromEarth();
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

  public static getDayLength(solarDeclination: angle): time {
    const latitude = AppComponent.instance.city.latitude;
    const cos = MathUtil.tan(latitude) * MathUtil.tan(solarDeclination);
    const sunrise = MathUtil.acos(cos); // this only works because acos is clamped
    const sunset = 360 - sunrise;
    return (sunset - sunrise) / 15;
  }

  public static skyPath(rightAscension: angle, declination: angle): Array<string> {
    const paths: Array<string> = [];
    let pathPoints: Array<string> = [];
    const dt = TDate.fromDate().at(12, 0);
    const minutesPerDay = TemporalUnit.DAY.as(TemporalUnit.MINUTE);

    let lastAz = 0;
    for (let u = 0; u <= minutesPerDay; u++) {
      const { azimuth, altitude } = OrbitalMechanics.RaDec2AzAlt({ rightAscension, declination }, dt.add(u, TemporalUnit.MINUTE));
      if (Math.abs(azimuth - lastAz) > 90) {
        // split paths at asymptotes
        paths.push(pathPoints.join(' '));
        pathPoints = [];
      }
      pathPoints.push(`${azimuth},${90-altitude}`);
      lastAz = azimuth;
    }
    paths.push(pathPoints.join(' '));
    return paths;
  }

}
