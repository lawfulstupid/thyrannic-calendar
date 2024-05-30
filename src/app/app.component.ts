import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ThyrannicYear } from 'src/app/model/thyrannic-year';
import { ThyrannicDate } from './model/thyrannic-date';
import { ThyrannicDay } from './model/thyrannic-day';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  readonly environment = environment;
  
  year: ThyrannicYear = new ThyrannicYear(20,22);
  date: ThyrannicDate = new ThyrannicDate(this.year, 43, ThyrannicDay.DOLGOS);
  
}
