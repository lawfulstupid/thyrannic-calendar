import { AppComponent } from "../app.component";
import { TemporalUnit } from "../model/temporal-unit";
import { TDate } from "../model/thyrannic-date";
import { MathUtil } from "./math-util";
import { OrbitalMechanics } from "./orbital-mechanics";
import { angle, AzAlt } from "./units";
import { Vector } from "./vector";

// Units in vmin, centred at (50vw, 50vh) on desktop viewport (+x = right, +y = up)
export type ScreenPos = { display: true, screenY: number, screenX: number, screenSf: number } | { display: false };
type ScreenDim = { min: number, max: number, axis: Vector };

export class Viewport {

  private static focus: Vector;
  private static focusNormSq: number;
  private static x: ScreenDim;
  private static y: ScreenDim;

  private constructor() { }

  // Relcalculates constants on viewport update
  public static update() {
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
    const focalLength = 50 / MathUtil.tan(AppComponent.FOV / 2);

    // Compute observer's focal vector
    Viewport.focus = Vector.fromSpherical(-AppComponent.instance.bearing.angle, AppComponent.instance.elevation.angle, focalLength);
    Viewport.focusNormSq = Viewport.focus.dot(Viewport.focus);
    // plane perpendicular to F and passing through the tip of F is given by (X - focus) ⋅ focus = 0
    // where X = (x,y,z) is a point in space

    // New bases that form (x,y) coords of viewport
    const xDir = Viewport.focus.cross(new Vector(0, 1, 0)).normal(); // points right
    const yDir = Viewport.focus.cross(xDir).normal(); // points down (because viewport Y is reversed)

    // Compute viewport boundaries for occlusion culling
    const width = window.innerWidth;
    const height = window.innerHeight;
    const vmin = Math.min(width, height) / 100;
    const maxX = width < height ? 50 : width / (2 * vmin);
    const maxY = width < height ? height / vmin - 50 : 50;

    // continued in AzAlt2ScreenPos()...
    Viewport.x = { min: -maxX, max: maxX, axis: xDir }
    Viewport.y = { max: 50, min: -maxY, axis: yDir }
  }

  // Converts azimuth + altitude to screen position calc
  public static AzAlt2ScreenPos(body: AzAlt): ScreenPos {
    // ...continued from update()

    // Compute position of body on unit sphere
    const p = Vector.fromSpherical(body.azimuth, body.altitude);
    // this is distanceless i.e. a ray given by X = sP for some s > 0

    // These intersect where both equations are simultaneously true:
    // (sP - F) ⋅ F = 0
    // => sP⋅F - F⋅F = 0
    // => s = F⋅F / P⋅F
    const s = Viewport.focusNormSq / Viewport.focus.dot(p);
    if (s <= 0) return { display: false } // body is behind observer

    // Line to body intersects viewport at X = sP
    const i = p.times(s);

    // Project 3d space onto 2d viewport plane
    const iRelF = i.minus(Viewport.focus);
    const cx = iRelF.dot(Viewport.x.axis);
    const cy = iRelF.dot(Viewport.y.axis);

    // Error protection
    if (isNaN(cx) || isNaN(cy)) return { display: false };

    return {
      display: true,
      screenY: cy,
      screenX: cx,
      screenSf: 1 / MathUtil.cos(i.angleTo(Viewport.focus))
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

  public static inBounds(point: ScreenPos): boolean {
    if (!point.display) return false;
    if (!Viewport.x || !Viewport.y) return false;
    return Viewport.x.min <= point.screenX && point.screenX <= Viewport.x.max
      && Viewport.y.min <= point.screenY && point.screenY <= Viewport.y.max;
  }

}
