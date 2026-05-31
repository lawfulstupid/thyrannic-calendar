
import { Pipe, PipeTransform } from "@angular/core";
import { AzAlt, OrbitalMechanics } from "../util/orbital-mechanics";

@Pipe({
  name: 'svgPath',
  standalone: true,
  pure: false
})
export class SvgPathPipe implements PipeTransform {

  transform(path: Array<AzAlt> = [], fill: boolean = false): string {
    const points = path.map(point => OrbitalMechanics.AzAlt2ScreenPos(point)); // Map onto viewport

    // Find first displayable point
    const firstPoint = points.findIndex(point => point.display);
    if (firstPoint === -1) {
      return ''; // nothing to render
    } else if (firstPoint > 0) {
      // Move leading gap to end
      points.splice(0, firstPoint);
      points.push({ display: false });
    }

    // Form a loop
    points.push(points[0]);

    // Transform into svg:path.d string
    // jumps behave differently depending on the value of `fill`:
    // fill = false => leave a gap (no line to new position)
    // fill = true => extend path down past the bottom of the screen, horizontally to new position, and back up
    return points.reduce(({ str, jump }, point) => {
      if (point.display) {
        if (jump && fill) str += ` H ${point.screenX}`; // end jump
        str += ` ${str === '' || (jump && !fill) ? 'M' : 'L'} ${point.screenX} ${point.screenY}`;
        return { str, jump: false }
      } else {
        if (!jump && fill) str += ` V 100`; // start jump
        return { str, jump: true }
      }
    }, { str: '', jump: false }).str;
  }

}