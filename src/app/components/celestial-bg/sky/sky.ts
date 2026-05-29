import { Component } from "@angular/core";
import { CelestialBg } from "../celestial-bg.component";

@Component({
  selector: 'g#' + Sky.ID,
  templateUrl: './sky.html'
})
export class Sky {

  public static readonly ID = 'sky';

  constructor() {
    CelestialBg.register(this);
  }

  get color() {
    return CelestialBg.earth?.skyColor || 'blue';
  }

}