import { Component } from '@angular/core';
import { ArukmaComponent } from './celestial-body/arukma.component';
import { LositComponent } from './celestial-body/losit.component';
import { SunComponent } from "./celestial-body/sun.component";
import { EarthComponent } from "./earth/earth.component";
import { StarsComponent } from "./stars/stars.component";

@Component({
  selector: 'app-celestial-bg',
  standalone: true,
  templateUrl: './celestial-bg.component.html',
  imports: [EarthComponent, SunComponent, ArukmaComponent, LositComponent, StarsComponent]
})
export class CelestialBgComponent {

}
