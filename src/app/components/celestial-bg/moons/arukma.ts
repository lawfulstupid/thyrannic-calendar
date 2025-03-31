import { Component } from '@angular/core';
import { OrbitalMechanics } from 'src/app/util/orbital-mechanics';
import { days, deg, km } from '../../../util/units';
import { CelestialBg } from '../celestial-bg.component';
import { GeocentricBody, IntrasolarBody } from '../celestial-body/intrasolar-body';

@Component({
  selector: Arukma.ID,
  templateUrl: IntrasolarBody.templateUrl,
  styleUrl: IntrasolarBody.styleUrl
})
export class Arukma extends GeocentricBody {

  public static readonly ID = 'arukma';

  override color = 'rgb(32, 33, 35)';
  override brightness = 2.4;
  override occlude = true;

  override inclination = 6.6541 * deg;
  override periapsisArgument = 229.951 * deg;
  override eccentricity = 0.0464;
  override originAngle = CelestialBg.sun.originAngle + 76.0417 * deg;
  override orbitalPeriod = OrbitalMechanics.synodicToSiderealPeriod(17.79459 * days);
  override ascendingNodeLongitude = 344.672 * deg;
  override radius = 1481.52 * km;
  override mass = 4.2089E22;

}
