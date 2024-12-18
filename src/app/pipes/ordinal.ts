import { Pipe, PipeTransform } from "@angular/core";
import { MathUtil } from "../util/math-util";

@Pipe({
  name: 'ordinal'
})
export class OrdinalPipe implements PipeTransform {

  transform(value: number): string {
    return MathUtil.ordinal(value);
  }

}