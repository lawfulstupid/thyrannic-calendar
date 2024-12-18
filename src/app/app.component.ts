import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TemporalUnit } from './model/temporal-unit';
import { TDateTime } from './model/thyrannic-date-time';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly environment = environment;
  readonly units = TemporalUnit;

  datetime: TDateTime = TDateTime.fromDate();

  public changeDateTime([quantity, unit]: [number, TemporalUnit]) {
    try {
      this.datetime = this.datetime.add(quantity, unit);
    } catch (err) {
      console.error('Illegal operation:', err);
    }
  }

}
