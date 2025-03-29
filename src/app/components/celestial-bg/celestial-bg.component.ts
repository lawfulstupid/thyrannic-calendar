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
export class CelestialBgComponent {

}
