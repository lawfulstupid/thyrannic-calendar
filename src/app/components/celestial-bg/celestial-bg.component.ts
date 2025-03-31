import { Component } from '@angular/core';
import { IntrasolarBody } from './celestial-body/intrasolar-body';
import { EarthComponent } from "./earth/earth.component";
import { StarsComponent } from "./stars/stars.component";
import { SunComponent } from "./sun/sun.component";

@Component({
  selector: 'app-celestial-bg',
  templateUrl: './celestial-bg.component.html'
})
export class CelestialBg {

  public static earth: EarthComponent;
  public static stars: StarsComponent;
  public static sun: SunComponent;

  public static bodies: Array<IntrasolarBody> = [];
  private static initialized = false;

  public static init() {
    const loop = setInterval(() => {
      if (this.sun && this.earth && this.stars) {
        clearInterval(loop);
        this.update();
        this.initialized = true;
      }
    }, 1);
  }

  public static register(body: any & { constructor: { ID: string }}) {
    console.debug('Registering', body.constructor.ID);
    body.constructor.instance = body;
    (<any>CelestialBg)[body.constructor.ID] = body;
    if (body instanceof IntrasolarBody) {
      this.bodies.push(body);
    }
    if (this.initialized) {
      body.update();
    }
  }

  public static update() {
    // Always update sun first
    this.sun.update();
    this.earth.update();
    this.stars.update();
    // Update other celestial bodies
    this.bodies.forEach(body => {
      if (body !== this.sun) body.update();
    });
    this.setZIndices();
  }

  private static setZIndices() {
    this.bodies.sort((a,b) => b.distance - a.distance);
    this.bodies.forEach((body, idx) => {
      body.zIndex = idx;
    });
  }

}
