import { NgFor, NgIf, PercentPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { AbsPipe } from "src/app/pipes/abs.pipe";
import { CelestialBg } from "./celestial-bg.component";
import { EarthComponent } from "./earth/earth.component";
import { ArukmaComponent } from "./moons/arukma.component";
import { LositComponent } from "./moons/losit.component";
import { StarsComponent } from "./stars/stars.component";
import { SunComponent } from "./sun/sun.component";
import { VenusComponent } from "./planets/venus.component";
import { Arukma2Component } from "./moons/arukma2.component";

@NgModule({
  declarations: [
    CelestialBg,
    EarthComponent,
    SunComponent,
    ArukmaComponent,
    Arukma2Component,
    LositComponent,
    StarsComponent,
    VenusComponent
  ],
  imports: [AbsPipe, NgIf, NgFor, PercentPipe],
  exports: [CelestialBg]
})
export class CelestialBgModule {}
