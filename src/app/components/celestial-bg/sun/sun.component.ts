import { NgFor, NgIf, PercentPipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbsPipe } from 'src/app/pipes/abs.pipe';
import { CelestialBody, IntrasolarBody } from '../celestial-body/celestial-body';

@Component({
  selector: 'app-sun',
  standalone: true,
  imports: [AbsPipe, PercentPipe, NgIf, NgFor],
  templateUrl: '../celestial-body/celestial-body.html',
  styleUrl: '../celestial-body/celestial-body.scss'
})
export class SunComponent extends IntrasolarBody {

  override color = 'yellow';
  override brightness = 1;
  override zIndex = 1;
  override occlude = false;

  override inclination = 0;
  override periapsisArgument = 94.662;
  override eccentricity = 0.0167;
  override originAngle = 11.2854;
  override orbitalPeriod = 340.16433;
  override ascendingNodeLongitude = 316.224;
  override meanDistance = 149_600_000;
  override radius = 695700;

  constructor() {
    super();
    CelestialBody.sun = this;
  }

}
