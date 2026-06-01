import { AppComponent } from "../app.component";
import { CelestialBg } from "../components/celestial-bg/celestial-bg.component";
import { IntrasolarBody } from "../components/celestial-bg/celestial-body/intrasolar-body";
import { Earth } from "../components/celestial-bg/earth/earth";
import { TDateTime } from "../model/thyrannic-date-time";
import { MathUtil } from "./math-util";
import { angle, AzAlt, distance, DistLong, minutes, Orbital, RaDec, time } from "./units";

export class OrbitalMechanics {

  private constructor() { }

  public static synodicToSiderealPeriod(p: time): time {
    return 1 / (1 / p + 1 / CelestialBg.sun.orbitalPeriod);
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
    const yv = Math.sqrt(1.0 - body.eccentricity ** 2) * MathUtil.sin(eccentricAnomaly);
    const trueAnomaly = MathUtil.fixAngle(MathUtil.atan2(yv, xv));

    return {
      distance: Math.sqrt(xv ** 2 + yv ** 2) * body.meanDistance,
      trueLongitude: trueAnomaly + body.periapsisArgument
    }
  }

  // Converts distance + true longitude + inclination to right ascension + declination
  public static DistLong2RaDec(body: Orbital): RaDec & { distance: distance } {
    // Compute ecliptic rectangular geocentric coordinates
    let xg, yg, zg;
    xg = body.distance * (
      MathUtil.cos(body.ascendingNodeLongitude) * MathUtil.cos(body.trueLongitude)
      - MathUtil.sin(body.ascendingNodeLongitude) * MathUtil.sin(body.trueLongitude) * MathUtil.cos(body.inclination)
    );
    yg = body.distance * (
      MathUtil.sin(body.ascendingNodeLongitude) * MathUtil.cos(body.trueLongitude)
      + MathUtil.cos(body.ascendingNodeLongitude) * MathUtil.sin(body.trueLongitude) * MathUtil.cos(body.inclination)
    );
    zg = body.distance * (
      MathUtil.sin(body.trueLongitude) * MathUtil.sin(body.inclination)
    );

    // At this point we could optionally adjust xg,yg,zg for perturbations (source 1: 7-10)

    // Adjust coordinates for heliocentrism
    if (body.heliocentric) {
      xg += CelestialBg.sun.distance * MathUtil.cos(CelestialBg.sun.trueLongitude);
      yg += CelestialBg.sun.distance * MathUtil.sin(CelestialBg.sun.trueLongitude);
    }

    // Compute equatorial rectangular geocentric coordinates
    const xe = xg;
    const ye = yg * MathUtil.cos(Earth.TILT) - zg * MathUtil.sin(Earth.TILT);
    const ze = yg * MathUtil.sin(Earth.TILT) + zg * MathUtil.cos(Earth.TILT);

    // Compute right ascension and declination (and updated distance)
    return {
      rightAscension: MathUtil.fixAngle(MathUtil.atan2(ye, xe)),
      declination: MathUtil.fixAngle(MathUtil.atan2(ze, Math.sqrt(xe ** 2 + ye ** 2))),
      distance: Math.sqrt(xe ** 2 + ye ** 2 + ze ** 2)
    }
  }

  // Computes right ascension + declination for an object
  public static computeRaDec(body: IntrasolarBody, datetime: TDateTime): RaDec {
    const distLong = this.computeDistLong(body, datetime);
    return this.DistLong2RaDec({
      ...distLong,
      heliocentric: body.heliocentric,
      ascendingNodeLongitude: body.ascendingNodeLongitude,
      inclination: body.inclination
    });
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
    ));

    return { azimuth, altitude };
  }

  public static updateOcclusion(body: IntrasolarBody) {
    const sun = CelestialBg.sun;
    const earthToMoon = body.vectorFromEarth();
    const earthToSun = sun.vectorFromEarth();
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
    const delta = MathUtil.fixAngle2(sun.azimuth - body.azimuth);
    body.illuminationDirection = -MathUtil.atan2(
      MathUtil.cos(body.altitude) * MathUtil.tan(sun.altitude) - MathUtil.sin(body.altitude) * MathUtil.cos(delta),
      MathUtil.sin(delta)
    );
  }

  public static getDayLength(solarDeclination: angle): time /* hours */ {
    const latitude = AppComponent.instance.city.latitude;
    const cos = MathUtil.tan(latitude) * MathUtil.tan(solarDeclination);
    const sunrise = MathUtil.acos(cos); // this only works because acos is clamped
    const sunset = 360 - sunrise;
    return (sunset - sunrise) / 15;
  }

}
