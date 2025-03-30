import { Component } from "@angular/core";
import { AU, days, deg, km } from "src/app/util/units";
import { CelestialBg } from "../celestial-bg.component";
import { HeliocentricBody, IntrasolarBody } from "../celestial-body/intrasolar-body";

@Component({
  selector: 'app-venus',
  templateUrl: IntrasolarBody.templateUrl,
  styleUrl: IntrasolarBody.styleUrl
})
export class VenusComponent extends HeliocentricBody {

  override color: string = 'orange';
  override brightness: number = 0.4;
  override zIndex: number = 2;

  override inclination: number = 3.3946 * deg;
  override ascendingNodeLongitude: number = 76.6799 * deg;
  override periapsisArgument: number = 54.8910 * deg;
  override eccentricity: number = 0.006773;
  override originAngle: number = 179.5761 * deg;
  override orbitalPeriod: number = 224.701 * days;
  override meanDistance: number = 0.72333 * AU;
  override radius: number = 6051.8 * km;

  constructor() {
    super();
    CelestialBg.venus = this;
  }

}