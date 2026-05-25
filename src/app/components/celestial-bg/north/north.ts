import { Component } from '@angular/core';
import { CelestialBg } from '../celestial-bg.component';
import { GeocentricBody } from '../celestial-body/intrasolar-body';
import { Earth } from '../earth/earth';
import { OrbitalMechanics } from 'src/app/util/orbital-mechanics';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: North.ID,
  templateUrl: './north.html',
  styleUrl: './north.scss'
})
export class North {

  public static readonly ID = 'north';

  protected ring: NorthRing;

  constructor() {
    CelestialBg.register(this);
    this.ring = new NorthRing();
  }

  public update() {
    this.ring.update();
  }

}

class NorthRing extends GeocentricBody {

  override color: string = 'red';
  override brightness: number = 1;
  override occlude: boolean = false;
  override inclination: number = -Earth.TILT;
  override ascendingNodeLongitude: number = 0;
  override periapsisArgument: number = 0;
  override eccentricity: number = 1;
  override originAngle: number = 0;
  override orbitalPeriod: number = 1;
  override meanDistance: number = 1;
  override radius: number = 1;

  constructor() {
    super();
  }

  override update() {
    this.rightAscension = 0;
    this.declination = 90;
    ({ azimuth: this.azimuth, altitude: this.altitude } = OrbitalMechanics.RaDec2AzAlt({ rightAscension: 0, declination: 90 }, AppComponent.instance.datetime));
    const pos = OrbitalMechanics.AzAlt2ScreenPos(this);
    if (this.display = pos.display) {
      ({ bottom: this.bottom, left: this.left, scale: this.scale } = pos);
    }
  }

  public readonly diameter: number = 20;

}
