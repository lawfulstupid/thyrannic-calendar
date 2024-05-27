import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ThyrannicYear } from 'src/app/model/thyrannic-year';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  readonly environment = environment;
  
  year: ThyrannicYear = new ThyrannicYear(20,22);
  
}
