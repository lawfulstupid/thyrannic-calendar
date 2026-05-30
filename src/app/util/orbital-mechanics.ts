import { AppComponent } from "../app.component";
import { CelestialBg } from "../components/celestial-bg/celestial-bg.component";
import { IntrasolarBody } from "../components/celestial-bg/celestial-body/intrasolar-body";
import { Earth } from "../components/celestial-bg/earth/earth";
import { TemporalUnit } from "../model/temporal-unit";
import { TDate } from "../model/thyrannic-date";
import { TDateTime } from "../model/thyrannic-date-time";
import { MathUtil } from "./math-util";
import { angle, distance, minutes, time } from "./units";
import { Vector } from "./vector";

export type DistLong = { distance: distance, trueLongitude: angle };
export type Orbital = DistLong & { heliocentric: boolean, ascendingNodeLongitude: angle, inclination: angle };
export type RaDec = { rightAscension: angle, declination: angle }; // position relative to earth
export type AzAlt = { azimuth: angle, altitude: angle }; // position relative to observer on earth

// units in vmin, centred at (50vw, 90vh) on screen
export type ScreenPos = { display: true, screenY: number, screenX: number, screenSf: number } | { display: false };

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
      declination: MathUtil.fixAngle(MathUtil.atan2(ze, Math.sqrt(xe**2 + ye**2))),
      distance: Math.sqrt(xe**2 + ye**2 + ze**2)
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

  // Converts azimuth + altitude to screen position calc
  public static AzAlt2ScreenPos(body: AzAlt): ScreenPos {
    /* GNOMONIC/RECTILINEAR PROJECTION
     * Assume observer is at the origin of a unit sphere
     * The body we want to render is on the surface of the sphere
     * The observer is looking in the direction of the positive x-axis
     * For reference, +Y is above the observer and +Z is to their right
     * The viewport is a rectangle on the plane x = d where d is the distance of the viewport from the observer
     * We draw a line from the origin to the body and see where it insersects the viewport
     * That gives us the coordinates of the body as rendered on the viewport
     *
     * Amendment: observer is looking at centre of viewport, slightly above horizon
     * Viewport is now a plane at a similar angle to the y-axis
     */

    // Compute distance to viewport (50 = half viewport width in vmin)
    const d = 50 / MathUtil.tan(AppComponent.FOV / 2);

    // Compute observer's focal vector
    const ELEVATION = 0; // arbitrary angle above horizon
    const f = Vector.fromSpherical(-AppComponent.instance.bearing.angle, ELEVATION, d);
    // plane perpendicular to F and passing through the tip of F is given by (X - F) ⋅ F = 0
    // where X = (x,y,z) is a point in space

    // New bases that form (x,y) coords of viewport
    const xDir = f.cross(new Vector(0,1,0)).normal();
    const yDir = xDir.cross(f).normal();

    // Compute position of body on unit sphere
    const p = Vector.fromSpherical(body.azimuth, body.altitude);
    // this is distanceless i.e. a ray given by X = sP for some s > 0

    // These intersect where both equations are simultaneously true:
    // (sP - F) ⋅ F = 0
    // => sP⋅F - F⋅F = 0
    // => s = F⋅F / P⋅F
    const s = f.dot(f) / p.dot(f);
    if (s <= 0) return { display: false } // body is behind observer

    // Line to body intersects viewport at X = sP
    const i = p.times(s);

    // Project 3d space onto 2d viewport plane
    const cx = i.minus(f).dot(xDir);
    const cy = i.minus(f).dot(yDir);

    // Occlusion culling
    if (Math.abs(cy) > 1000 || Math.abs(cx) > 1000) return { display: false };

    return {
      display: true,
      screenY: cy,
      screenX: cx,
      screenSf: 1 / MathUtil.cos(i.angleTo(f))
    }
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

  public static getDayLength(solarDeclination: angle): time {
    const latitude = AppComponent.instance.city.latitude;
    const cos = MathUtil.tan(latitude) * MathUtil.tan(solarDeclination);
    const sunrise = MathUtil.acos(cos); // this only works because acos is clamped
    const sunset = 360 - sunrise;
    return (sunset - sunrise) / 15;
  }

  public static skyPath(rightAscension: angle, declination: angle): Array<AzAlt> {
    const path: Array<AzAlt> = [];
    const dt = TDate.fromDate().at(12, 0);
    const minutesPerDay = TemporalUnit.DAY.as(TemporalUnit.MINUTE);

    for (let u = 0; u <= minutesPerDay; u++) {
      const { azimuth, altitude } = this.RaDec2AzAlt({ rightAscension, declination }, dt.add(u, TemporalUnit.MINUTE));
      path.push({ azimuth, altitude });
    }

    return path;
  }

}
