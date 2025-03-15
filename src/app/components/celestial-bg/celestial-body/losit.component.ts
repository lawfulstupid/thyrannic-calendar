import { PercentPipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbsPipe } from 'src/app/pipes/abs.pipe';
import { CelestialMechanics } from 'src/app/util/celestial-mechanics';
import { CelestialBody, VisibleCelestialBody } from './celestial-body';

@Component({
  selector: 'app-losit',
  standalone: true,
  imports: [AbsPipe, PercentPipe],
  templateUrl: '../celestial-body/celestial-body.html',
  styleUrl: '../celestial-body/celestial-body.scss'
})
export class LositComponent extends VisibleCelestialBody {

  override color = 'rgb(63, 21, 16)';
  override brightness = 0.92;
  override zIndex = 2;
  override occlude = true;

  override inclination = 10.1134;
  override periapsisArgument = 265.951;
  override eccentricity = 0.1361;
  override originAngle = CelestialBody.sun.originAngle + 321.7148;
  override orbitalPeriod = CelestialMechanics.synodicToSiderealPeriod(48.28098);
  override ascendingNodeLongitude = 329.915;
  override meanDistance = 512655.038;
  override radius = 1968.45;

  constructor() {
    super();
    CelestialBody.losit = this;
  }

}
