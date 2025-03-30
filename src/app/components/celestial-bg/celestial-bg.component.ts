import { Component } from '@angular/core';
import { EarthComponent } from "./earth/earth.component";
import { ArukmaComponent } from './moons/arukma.component';
import { LositComponent } from './moons/losit.component';
import { StarsComponent } from "./stars/stars.component";
import { SunComponent } from "./sun/sun.component";
import { VenusComponent } from './planets/venus.component';

@Component({
  selector: 'app-celestial-bg',
  templateUrl: './celestial-bg.component.html'
})
export class CelestialBg {

  public static sun: SunComponent;
  public static arukma: ArukmaComponent;
  public static losit: LositComponent;
  public static earth: EarthComponent;
  public static stars: StarsComponent;
  public static venus: VenusComponent;

  public static init() {
    const loop = setInterval(() => {
      if (this.sun && this.arukma && this.losit && this.earth && this.stars && this.venus) {
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
    this.venus.update();
    this.setZIndices();
  }

  private static setZIndices() {
    const bodies = [this.sun, this.arukma, this.losit, this.venus];
    bodies.sort((a,b) => b.distance - a.distance);
    bodies.forEach((body, idx) => {
      body.zIndex = idx;
    });
  }

}
