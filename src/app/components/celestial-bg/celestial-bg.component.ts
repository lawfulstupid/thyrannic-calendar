import { Component } from '@angular/core';
import { IntrasolarBody } from './celestial-body/intrasolar-body';
import { Earth } from "./earth/earth";
import { Stars } from "./stars/stars";
import { Sun } from "./sun/sun";

@Component({
  selector: 'app-celestial-bg',
  templateUrl: './celestial-bg.component.html'
})
export class CelestialBg {

  public static earth: Earth;
  public static stars: Stars;
  public static sun: Sun;

  public static bodies: Array<IntrasolarBody> = [];
  private static initialized = false;

  public static init() {
    const loop = setInterval(() => {
      if (this.sun && this.earth && this.stars) {
        clearInterval(loop);
        this.updatePositions();
        this.initialized = true;
      }
    }, 1);
  }

  public static register(body: any & { constructor: { ID: string }}) {
    console.debug('Registering', body.constructor.ID);
    (<any>CelestialBg)[body.constructor.ID] = body;
    if (body instanceof IntrasolarBody) {
      this.bodies.push(body);
    }
    if (this.initialized) {
      // not called for sun, earth, or stars
      body.updatePosition();
    }
  }

  public static updatePositions() {
    // Always update sun first
    this.sun.updatePosition();
    this.stars.updatePosition();
    // Update other celestial bodies
    this.bodies.forEach(body => {
      if (body !== this.sun) body.updatePosition();
    });
  }

  public static updateScreenPositions() {
    this.sun.updateScreenPosition();
    this.stars.updateScreenPosition();
    this.bodies.forEach(body => {
      if (body !== this.sun) body.updateScreenPosition();
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
