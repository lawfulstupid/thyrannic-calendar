import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CelestialBgComponent } from './components/celestial-bg/celestial-bg.component';
import { TimeUnitComponent } from './components/time-unit/time-unit.component';
import { TemporalUnit } from './model/temporal-unit';
import { TDateTime } from './model/thyrannic-date-time';
import { TDay } from './model/thyrannic-day';
import { TYear } from './model/thyrannic-year';
import { OrdinalPipe } from './pipes/ordinal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CelestialBgComponent, OrdinalPipe, TimeUnitComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly environment = environment;
  readonly units = TemporalUnit;

  datetime: TDateTime = new TYear(20, 24).on(49, TDay.BROGOS).at(10, 30);

  public changeDateTime([quantity, unit]: [number, TemporalUnit]) {
    try {
      this.datetime = this.datetime.add(quantity, unit);
    } catch (err) {
      console.error('Illegal operation:', err);
    }
  }

}
