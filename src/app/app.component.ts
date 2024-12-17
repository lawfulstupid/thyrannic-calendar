import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TemporalUnit } from './model/temporal-unit';
import { TYear } from './model/thyrannic-year';
import { TDateTime } from './model/thyrannic-date-time';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly environment = environment;

  year: TYear = TYear.fromDate();
  date = TDateTime.fromDate();
  daysInQuarter = TemporalUnit.EPOCH.as(TemporalUnit.DAY);
  dateSeq: number = this.date.valueOf();
  dateFromSeq = TDateTime.fromValue(31200930+7);

}
