import { NgFor, NgIf, PercentPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { AbsPipe } from "src/app/pipes/abs.pipe";
import { CelestialBg } from "./celestial-bg.component";
import { Earth } from "./earth/earth";
import { Arukma } from "./moons/arukma";
import { Losit } from "./moons/losit";
import { Stars } from "./stars/stars";
import { Sun } from "./sun/sun";
import { PowPipe } from "src/app/pipes/pow.pipe";

@NgModule({
  declarations: [
    CelestialBg,
    Sun,
    Earth,
    Stars,
    Arukma,
    Losit,
  ],
  imports: [AbsPipe, NgIf, NgFor, PercentPipe, PowPipe],
  exports: [CelestialBg]
})
export class CelestialBgModule {}
