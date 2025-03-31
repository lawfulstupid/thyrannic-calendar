import { NgFor, NgIf, PercentPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { AbsPipe } from "src/app/pipes/abs.pipe";
import { PowPipe } from "src/app/pipes/pow.pipe";
import { SvgPathPipe } from "src/app/pipes/svg-path.pipe";
import { CelestialBg } from "./celestial-bg.component";
import { Earth } from "./earth/earth";
import { Arukma } from "./moons/arukma";
import { Losit } from "./moons/losit";
import { Venus } from "./planets/venus";
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
    Venus
  ],
  imports: [AbsPipe, NgIf, NgFor, PercentPipe, PowPipe, SvgPathPipe],
  exports: [CelestialBg]
})
export class CelestialBgModule { }
