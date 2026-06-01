import { AppComponent } from "../app.component";
import { TemporalUnit } from "../model/temporal-unit";
import { TDate } from "../model/thyrannic-date";
import { MathUtil } from "./math-util";
import { OrbitalMechanics } from "./orbital-mechanics";
import { angle, AzAlt } from "./units";
import { Vector } from "./vector";

// Units in vmin, centred at (50vw, 50vh) on desktop viewport
// +x = right, +y = up
export type ScreenPos = { display: true, screenY: number, screenX: number, screenSf: number } | { display: false };

export class Viewport {

  private constructor() { }

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
    const f = Vector.fromSpherical(-AppComponent.instance.bearing.angle, AppComponent.instance.elevation.angle, d);
    // plane perpendicular to F and passing through the tip of F is given by (X - F) ⋅ F = 0
    // where X = (x,y,z) is a point in space

    // New bases that form (x,y) coords of viewport
    const xDir = f.cross(new Vector(0, 1, 0)).normal(); // points right
    const yDir = f.cross(xDir).normal(); // points down (because viewport Y is reversed)

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

    // Error protection
    if (isNaN(cx) || isNaN(cy)) return { display: false };

    return {
      display: true,
      screenY: cy,
      screenX: cx,
      screenSf: 1 / MathUtil.cos(i.angleTo(f))
    }
  }

  public static skyPath(rightAscension: angle, declination: angle): Array<AzAlt> {
    const path: Array<AzAlt> = [];
    const dt = TDate.fromDate().at(12, 0);
    const minutesPerDay = TemporalUnit.DAY.as(TemporalUnit.MINUTE);

    for (let u = 0; u <= minutesPerDay; u++) {
      const { azimuth, altitude } = OrbitalMechanics.RaDec2AzAlt({ rightAscension, declination }, dt.add(u, TemporalUnit.MINUTE));
      path.push({ azimuth, altitude });
    }

    return path;
  }

}
