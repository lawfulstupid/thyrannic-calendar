import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TemporalUnit } from './model/temporal-unit';
import { TDate } from './model/thyrannic-date';
import { TDay } from './model/thyrannic-day';
import { TYear } from './model/thyrannic-year';
import { TDateTime } from './model/thyrannic-date-time';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  readonly environment = environment;
  
  year: TYear = new TYear(20,22);
  date = new TDateTime(new TDate(this.year, 43, TDay.DOLGOS), 18);
  daysInQuarter = TemporalUnit.EPOCH.as(TemporalUnit.DAY);
  dateSeq: number = this.date.valueOf();
  dateFromSeq = TDateTime.fromValue(31200930+7);
  
}
