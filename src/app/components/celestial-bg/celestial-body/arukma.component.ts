import { Component } from '@angular/core';
import { CelestialBody } from './celestial-body';
import { SunComponent } from './sun.component';

@Component({
  selector: 'app-arukma',
  standalone: true,
  imports: [],
  templateUrl: './celestial-body.html',
  styleUrl: './celestial-body.scss'
})
export class ArukmaComponent extends CelestialBody {

  override color = 'rgb(32, 33, 35)';
  override brightness = 2.4;
  override zIndex = 3;

  override inclination = 6.6541;
  override periapsisArgument = 229.951;
  override eccentricity = 0.0464;
  override originAngle = SunComponent.INSTANCE.originAngle + 76.0417;
  override orbitalPeriod = CelestialBody.synodicToSiderealPeriod(17.79459);
  override ascendingNodeLongitude = 344.672;
  override meanDistance = 278311.973;
  override radius = 1481.52;

}
