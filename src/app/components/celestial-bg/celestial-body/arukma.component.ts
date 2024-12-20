import { Component } from '@angular/core';
import { CelestialBody } from './celestial-body';

@Component({
  selector: 'app-arukma',
  standalone: true,
  imports: [],
  templateUrl: './celestial-body.html',
  styleUrl: './celestial-body.scss'
})
export class ArukmaComponent extends CelestialBody {

  override angularDiameter = 0.61;
  override color = 'rgb(32, 33, 35)';
  override brightness = 2.4;
  override zIndex = 3;

  override inclination = 6.6541;
  override periapsisArgument = 229.951;
  override eccentricity = 0.0264;
  override originAngle = 76.0417;
  override orbitalPeriod = 17.79459;
  override ascendingNodeLongitude = 114.672;

}
