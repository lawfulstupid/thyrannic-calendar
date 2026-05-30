
import { Pipe, PipeTransform } from "@angular/core";
import { AzAlt, OrbitalMechanics } from "../util/orbital-mechanics";

@Pipe({
  name: 'svgPoints',
  standalone: true,
  pure: false
})
export class SvgPointsPipe implements PipeTransform {

  transform(path: Array<AzAlt> = [], fill: boolean = false): string {
    return path
      // Map onto viewport
      .map(point => OrbitalMechanics.AzAlt2ScreenPos(point))
      // Remove culled points
      .filter(pos => pos.display)
      // Sort left to right
      .sort((a, b) => a.screenX - b.screenX)
      // Discard unused properties
      .map(({ screenX, screenY }) => ({ screenX, screenY }))
      // close the loop without intersection if fill=true
      .concat(fill ? [{ screenX: 1000, screenY: -100 }, { screenX: -1000, screenY: -100 }] : [])
      // join into path string
      .map(({ screenX, screenY }) => `${screenX},${(90 - screenY)}`).join(' ');
  }

}