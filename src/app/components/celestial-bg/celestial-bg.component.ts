import { Component, Input } from '@angular/core';
import { TDateTime } from 'src/app/model/thyrannic-date-time';
import { ArukmaComponent } from './celestial-body/arukma.component';
import { CelestialBody } from './celestial-body/celestial-body';
import { LositComponent } from './celestial-body/losit.component';
import { SunComponent } from "./celestial-body/sun.component";
import { EarthComponent } from "./earth/earth.component";

@Component({
  selector: 'app-celestial-bg',
  standalone: true,
  templateUrl: './celestial-bg.component.html',
  imports: [EarthComponent, SunComponent, ArukmaComponent, LositComponent]
})
export class CelestialBgComponent {

  @Input('datetime')
  set update(datetime: TDateTime) {
    CelestialBody.update(datetime);
  }

}
