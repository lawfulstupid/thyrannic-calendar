import { Component, Input } from '@angular/core';
import { TDateTime } from 'src/app/model/thyrannic-date-time';
import { EarthComponent } from "./earth/earth.component";
import { SkyComponent } from './sky/sky.component';
import { SunComponent } from "./celestial-body/sun.component";
import { ArukmaComponent } from './celestial-body/arukma.component';
import { LositComponent } from './celestial-body/losit.component';

@Component({
  selector: 'app-celestial-bg',
  standalone: true,
  templateUrl: './celestial-bg.component.html',
  imports: [EarthComponent, SkyComponent, SunComponent, ArukmaComponent, LositComponent]
})
export class CelestialBgComponent {

  @Input()
  datetime!: TDateTime;

}
