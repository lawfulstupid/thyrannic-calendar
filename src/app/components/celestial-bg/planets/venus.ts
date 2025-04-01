import { Component } from "@angular/core";
import { days, deg, km } from "src/app/util/units";
import { HeliocentricBody, IntrasolarBody } from "../celestial-body/intrasolar-body";

@Component({
  selector: Venus.ID,
  templateUrl: IntrasolarBody.templateUrl,
  styleUrl: IntrasolarBody.styleUrl
})
export class Venus extends HeliocentricBody {

  public static readonly ID = 'venus';

  override color = 'orange';
  override albedo = 0.76;

  override inclination = 3.3946 * deg;
  override ascendingNodeLongitude = 76.6799 * deg;
  override periapsisArgument = 54.8910 * deg;
  override eccentricity = 0.006773;
  override originAngle = 179.5761 * deg;
  override orbitalPeriod = 224.701 * days;
  override radius = 6051.8 * km;
  override density = 5.24227;

}