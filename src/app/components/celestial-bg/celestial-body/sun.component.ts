import { Component, Input } from '@angular/core';
import { TDateTime } from 'src/app/model/thyrannic-date-time';
import { CelestialBody } from './celestial-body';

@Component({
  selector: 'app-sun',
  standalone: true,
  imports: [],
  templateUrl: './celestial-body.html',
  styleUrl: './celestial-body.scss'
})
export class SunComponent extends CelestialBody {
  
  override angularDiameter = 0.53;
  override color = 'yellow';
  override brightness = 1;
  override zIndex = 1;
  
  override inclination = 0;
  override perihelionAngle = 94.662;
  override meanDist = 1;
  override eccentricity = 0.0167;
  override originAngle = 11.2854;
  override orbitalPeriod = 340.16433;

  @Input('datetime')
  set updatePosition(datetime: TDateTime) {
    this.update(datetime);
  }

  override ascendingNodeLongitude(d: number): number {
    return 0;
  }

}
