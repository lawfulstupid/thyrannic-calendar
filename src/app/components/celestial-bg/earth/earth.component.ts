import { Component } from '@angular/core';
import { TDateTime } from 'src/app/model/thyrannic-date-time';
import { CelestialBody } from '../celestial-body/celestial-body';

@Component({
  selector: 'app-earth',
  standalone: true,
  imports: [],
  templateUrl: './earth.component.html',
  styleUrl: './earth.component.scss'
})
export class EarthComponent {
  
  constructor() {
    CelestialBody.earth = this;
  }
  
  readonly tilt: number = 24.12;
  readonly latitude: number = 35.19;

  public update(datetime: TDateTime) {
    
  }

}
