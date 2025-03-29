import { Component } from '@angular/core';
import { EarthComponent } from "./earth/earth.component";
import { ArukmaComponent } from './moons/arukma.component';
import { LositComponent } from './moons/losit.component';
import { StarsComponent } from "./stars/stars.component";
import { SunComponent } from "./sun/sun.component";

@Component({
  selector: 'app-celestial-bg',
  standalone: true,
  templateUrl: './celestial-bg.component.html',
  imports: [EarthComponent, SunComponent, ArukmaComponent, LositComponent, StarsComponent]
})
export class CelestialBg {

  public static sun: SunComponent;
  public static arukma: ArukmaComponent;
  public static losit: LositComponent;
  public static earth: EarthComponent;
  public static stars: StarsComponent;

  public static init() {
    const loop = setInterval(() => {
      if (this.sun && this.arukma && this.losit && this.earth && this.stars) {
        clearInterval(loop);
        this.update();
      }
    }, 1);
  }

  public static update() {
    this.sun.update();
    this.arukma.update();
    this.losit.update();
    this.earth.update();
    this.stars.update();
  }

}
