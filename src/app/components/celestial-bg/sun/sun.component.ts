import { Component } from '@angular/core';
import { AU, days, deg, km } from '../../../util/units';
import { CelestialBg } from '../celestial-bg.component';
import { IntrasolarBody } from '../celestial-body/intrasolar-body';

@Component({
  selector: 'app-sun',
  templateUrl: '../celestial-body/intrasolar-body.html',
  styleUrl: '../celestial-body/intrasolar-body.scss'
})
export class SunComponent extends IntrasolarBody {

  override color = 'yellow';
  override brightness = 1;
  override zIndex = 1;
  override occlude = false;

  override inclination = 0 * deg;
  override periapsisArgument = 94.662 * deg;
  override eccentricity = 0.0167;
  override originAngle = 11.2854 * deg;
  override orbitalPeriod = 340.16433 * days;
  override ascendingNodeLongitude = 316.224 * deg;
  override meanDistance = 1 * AU;
  override radius = 695_700 * km;

  constructor() {
    super();
    CelestialBg.sun = this;
  }

}
