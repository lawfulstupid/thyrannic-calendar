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

  public changeDateTime(event: [number, TemporalUnit]) {
    this.datetime = this.datetime.add(event[0], event[1]);
  }

}
