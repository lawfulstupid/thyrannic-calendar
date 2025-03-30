import { Component } from "@angular/core";
import { AU, days, km } from "src/app/util/units";
import { CelestialBg } from "../celestial-bg.component";
import { IntrasolarBody } from "../celestial-body/intrasolar-body";

@Component({
  selector: 'app-venus',
  templateUrl: '../celestial-body/intrasolar-body.html',
  styleUrl: '../celestial-body/intrasolar-body.scss'
})
export class VenusComponent extends IntrasolarBody {

  override heliocentric = true;

  override color: string = 'orange';
  override brightness: number = 0.4;
  override zIndex: number = 2;
  override occlude: boolean = true;

  override inclination: number = 3.3946;
  override ascendingNodeLongitude: number = 76.6799;
  override periapsisArgument: number = 54.8910;
  override eccentricity: number = 0.006773;
  override originAngle: number = 179.5761;
  override orbitalPeriod: number = 224.701 * days;
  override meanDistance: number = 0.72333 * AU;
  override radius: number = 6051.8 * km * 100;

  constructor() {
    super();
    CelestialBg.venus = this;
  }

}