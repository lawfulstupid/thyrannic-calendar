import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'pow',
  standalone: true
})
export class PowPipe implements PipeTransform {

  transform(x: number, n: number): number {
    return Math.pow(x, n);
  }

}