import { NgFor, NgIf, PercentPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { AbsPipe } from "src/app/pipes/abs.pipe";
import { PowPipe } from "src/app/pipes/pow.pipe";
import { SvgPointsPipe } from "src/app/pipes/svg-points";
import { CelestialBg } from "./celestial-bg.component";
import { Earth } from "./earth/earth";
import { Arukma } from "./moons/arukma";
import { Losit } from "./moons/losit";
import { Sky } from "./sky/sky";
import { Stars } from "./stars/stars";
import { Sun } from "./sun/sun";

@NgModule({
  declarations: [
    CelestialBg,
    Sun,
    Earth,
    Stars,
    Sky,
    Arukma,
    Losit,
  ],
  imports: [AbsPipe, NgIf, NgFor, PercentPipe, PowPipe, SvgPointsPipe],
  exports: [CelestialBg]
})
export class CelestialBgModule { }
