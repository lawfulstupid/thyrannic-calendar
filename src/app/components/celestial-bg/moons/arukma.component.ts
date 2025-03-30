import { Component } from '@angular/core';
import { OrbitalMechanics } from 'src/app/util/orbital-mechanics';
import { days, deg, km } from '../../../util/units';
import { CelestialBg } from '../celestial-bg.component';
import { GeocentricBody } from '../celestial-body/intrasolar-body';

@Component({
  selector: 'app-arukma',
  templateUrl: GeocentricBody.templateUrl,
  styleUrl: GeocentricBody.styleUrl
})
export class ArukmaComponent extends GeocentricBody {

  override color = 'rgb(32, 33, 35)';
  override brightness = 2.4;
  override zIndex = 3;
  override occlude = true;

  override inclination = 6.6541 * deg;
  override periapsisArgument = 229.951 * deg;
  override eccentricity = 0.0464;
  override originAngle = CelestialBg.sun.originAngle + 76.0417 * deg;
  override orbitalPeriod = OrbitalMechanics.synodicToSiderealPeriod(17.79459 * days);
  override ascendingNodeLongitude = 344.672 * deg;
  override meanDistance = 278311.973 * km;
  override radius = 1481.52 * km;

  constructor() {
    super();
    CelestialBg.arukma = this;
  }

}
