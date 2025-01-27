import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CelestialBgComponent } from './components/celestial-bg/celestial-bg.component';
import { CelestialBody } from './components/celestial-bg/celestial-body/celestial-body';
import { PinnedDateComponent } from "./components/pinned-date/pinned-date.component";
import { TimeUnitComponent } from './components/time-unit/time-unit.component';
import { City } from './model/city';
import { TemporalUnit } from './model/temporal-unit';
import { TDate } from './model/thyrannic-date';
import { TDateTime } from './model/thyrannic-date-time';
import { OrdinalPipe } from './pipes/ordinal';
import { LocalStorage } from './util/local-storage';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CelestialBgComponent, OrdinalPipe, TimeUnitComponent, FormsModule, NgFor, PinnedDateComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public static instance: AppComponent;
  
  protected readonly environment = environment;
  protected readonly units = TemporalUnit;
  protected readonly cities: Array<City> = City.values;

  private _datetime: TDateTime;
  public get datetime(): TDateTime {
    return this._datetime;
  }
  // Update datetime and set in local storage
  protected set datetime(datetime: TDateTime) {
    this._datetime = datetime;
    LocalStorage.CURRENT_DATETIME.put(datetime.valueOf().toString());
  }
  
  protected _city: City = City.THYRANNOS;
  public get city(): City { return this._city; }
  
  constructor() {
    AppComponent.instance = this;
    
    // Load last datetime from storage
    const storedValue = LocalStorage.CURRENT_DATETIME.get();
    if (storedValue !== null) {
      this._datetime = TDateTime.fromValue(Number(storedValue));
    } else {
      // Default value
      this._datetime = TDate.fromDate().at(12, 0);
    }
  }
  
  public changeDateTime([quantity, unit]: [number, TemporalUnit]) {
    try {
      this.datetime = this.datetime.add(quantity, unit);
    } catch (err) {
      console.error('Illegal operation:', err);
    }
  }
  
  public changeCity() {
    CelestialBody.update();
  }

}
