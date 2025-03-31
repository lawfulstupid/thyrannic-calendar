import { Component } from '@angular/core';
import { MathUtil } from 'src/app/util/math-util';
import { days, deg, km } from '../../../util/units';
import { GeocentricBody, IntrasolarBody } from '../celestial-body/intrasolar-body';

@Component({
  selector: Sun.ID,
  templateUrl: IntrasolarBody.templateUrl,
  styleUrl: IntrasolarBody.styleUrl
})
export class Sun extends GeocentricBody {

  public static readonly ID = 'sun';

  override color = 'yellow';
  override brightness = 1;
  override occlude = false;

  override inclination = 0 * deg; // 0 by definition
  override periapsisArgument = 94.662 * deg;
  override eccentricity = 0.0167;
  override originAngle = MathUtil.fixAngle((11.2854 - 316.224) * deg);
  override orbitalPeriod = 340.16433 * days;
  override ascendingNodeLongitude = 0 * deg; // undefined by definition
  override radius = 695_700 * km;
  override density = 1.4102;

}
