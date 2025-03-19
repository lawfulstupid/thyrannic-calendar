import { NgFor, NgIf, PercentPipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbsPipe } from 'src/app/pipes/abs.pipe';
import { OrbitalMechanics } from 'src/app/util/orbital-mechanics';
import { CelestialBody, IntrasolarBody } from './celestial-body';

@Component({
  selector: 'app-arukma',
  standalone: true,
  imports: [AbsPipe, PercentPipe, NgIf, NgFor],
  templateUrl: './celestial-body.html',
  styleUrl: './celestial-body.scss'
})
export class ArukmaComponent extends IntrasolarBody {

  override color = 'rgb(32, 33, 35)';
  override brightness = 2.4;
  override zIndex = 3;
  override occlude = true;

  override inclination = 6.6541;
  override periapsisArgument = 229.951;
  override eccentricity = 0.0464;
  override originAngle = CelestialBody.sun.originAngle + 76.0417;
  override orbitalPeriod = OrbitalMechanics.synodicToSiderealPeriod(17.79459);
  override ascendingNodeLongitude = 344.672;
  override meanDistance = 278311.973;
  override radius = 1481.52;

  constructor() {
    super();
    CelestialBody.arukma = this;
  }

}
