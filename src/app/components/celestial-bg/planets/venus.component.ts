import { Component } from "@angular/core";
import { AU, days, km } from "src/app/util/units";
import { CelestialBg } from "../celestial-bg.component";
import { HeliocentricBody } from "../celestial-body/intrasolar-body";

@Component({
  selector: 'app-venus',
    templateUrl: HeliocentricBody.templateUrl,
    styleUrl: HeliocentricBody.styleUrl
})
export class VenusComponent extends HeliocentricBody {

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