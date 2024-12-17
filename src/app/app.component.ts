import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TemporalUnit } from './model/temporal-unit';
import { TYear } from './model/thyrannic-year';
import { TDateTime } from './model/thyrannic-date-time';
import { TDate } from './model/thyrannic-date';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly environment = environment;

  dates: Array<TYear | TDate | TDateTime> = [
    TYear.fromDate(),
    TDate.fromDate(),
    TDateTime.fromDate(),
    TYear.fromDate().add(1, TemporalUnit.YEAR),
    TYear.fromDate().add(1, TemporalUnit.DAY),
    TDate.fromDate().add(1, TemporalUnit.DAY),
    TDate.fromDate().add(1, TemporalUnit.HOUR),
    TDateTime.fromDate().add(1, TemporalUnit.HOUR),
    TDateTime.fromDate().add(1, TemporalUnit.QUARTER),
  ];

}
