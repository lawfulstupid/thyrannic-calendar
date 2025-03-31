import { Component } from '@angular/core';
import { OrbitalMechanics } from 'src/app/util/orbital-mechanics';
import { days, deg, km } from '../../../util/units';
import { CelestialBg } from '../celestial-bg.component';
import { GeocentricBody, IntrasolarBody } from '../celestial-body/intrasolar-body';

@Component({
  selector: Losit.ID,
  templateUrl: IntrasolarBody.templateUrl,
  styleUrl: IntrasolarBody.styleUrl
})
export class Losit extends GeocentricBody {

  public static readonly ID = 'losit';

  override color = 'rgb(63, 21, 16)';
  override brightness = 0.92;
  override occlude = true;

  override inclination = 10.1134 * deg;
  override periapsisArgument = 265.951 * deg;
  override eccentricity = 0.1361;
  override originAngle = CelestialBg.sun.originAngle + 321.7148 * deg;
  override orbitalPeriod = OrbitalMechanics.synodicToSiderealPeriod(48.28098 * days);
  override ascendingNodeLongitude = 329.915 * deg;
  override radius = 1968.45 * km;
  override mass = 1.04794E23;

}
