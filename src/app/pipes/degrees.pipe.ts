import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'degrees',
  standalone: true
})
export class DegreesPipe implements PipeTransform {

  transform(value: number, level: 'degrees' | 'minutes' | 'seconds' = 'degrees'): string {
    const degrees = value;
    const minutes = (value - Math.floor(degrees)) * 60;
    const seconds = (value - Math.floor(degrees) - Math.floor(minutes)/60) * 60 * 60;
    switch (level) {
      case 'degrees': return `${Math.round(degrees)}°`;
      case 'minutes': return `${Math.floor(degrees)}° ${Math.round(minutes)}'`;
      case 'seconds': return `${Math.floor(degrees)}° ${Math.floor(minutes)}' ${Math.round(seconds)}"`;
    }
  }

}