import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { CelestialBg } from './components/celestial-bg/celestial-bg.component';
import { CelestialBgModule } from './components/celestial-bg/celestial-bg.module';
import { EarthComponent } from './components/celestial-bg/earth/earth.component';
import { PinnedDateComponent } from "./components/pinned-date/pinned-date.component";
import { TimeUnitComponent } from './components/time-unit/time-unit.component';
import { Bearing } from './model/bearing';
import { City } from './model/city';
import { TemporalUnit } from './model/temporal-unit';
import { TDate } from './model/thyrannic-date';
import { TDateTime } from './model/thyrannic-date-time';
import { OrdinalPipe } from './pipes/ordinal';
import { LocalValue } from './util/local-value';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FontAwesomeModule, CelestialBgModule, OrdinalPipe, TimeUnitComponent, FormsModule, NgIf, NgFor, PinnedDateComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public static instance: AppComponent;

  readonly faPlay = faPlay;
  readonly faPause = faPause;

  protected readonly environment = environment;
  protected readonly units = TemporalUnit;
  protected readonly cities: Array<City> = City.values;
  protected readonly bearings: Array<Bearing> = Bearing.values;
  protected get sunPathEnabled() { return CelestialBg.sun.path.enabled; }

  // Load datetime from local storage
  private _datetime: TDateTime = LocalValue.CURRENT_DATETIME.get() || TDate.fromDate().at(12, 0);
  public get datetime(): TDateTime {
    return this._datetime;
  }
  // Update datetime and set in local storage
  protected set datetime(datetime: TDateTime) {
    this._datetime = datetime;
    LocalValue.CURRENT_DATETIME.put(datetime);
  }

  protected _city: City = LocalValue.CITY.get() || City.THYRANNOS;
  public get city(): City { return this._city; }
  public bearing: Bearing = Bearing.SOUTH;

  constructor() {
    AppComponent.instance = this;
    this.resetBearing();
    CelestialBg.init();
  }

  public changeDateTime([quantity, unit]: [number, TemporalUnit]) {
    try {
      this.datetime = this.datetime.add(quantity, unit);
      CelestialBg.update();
    } catch (err) {
      console.error('Illegal operation:', err);
    }
  }

  public changeCity() {
    this.resetBearing();
    const oldCity: City = LocalValue.CITY.get() || City.THYRANNOS;
    const longDiff = this.city.longitude - oldCity.longitude;
    this.datetime = this.datetime.add(Math.round(longDiff * 4), TemporalUnit.MINUTE);
    LocalValue.CITY.put(this._city);
    CelestialBg.update();
    CelestialBg.sun.updatePath();
    CelestialBg.earth.updateTerrain();
  }

  public updateSunPathMode() {
    CelestialBg.sun.path.enabled = !CelestialBg.sun.path.enabled;
    CelestialBg.sun.updatePath();
  }

  public changeBearing() {
    CelestialBg.update();
    CelestialBg.sun.updatePath();
    CelestialBg.earth.updateTerrain();
  }

  playLoop: NodeJS.Timeout | undefined;
  public togglePlayPause() {
    if (!this.playLoop) {
      this.playLoop = setInterval(() => {
        this.changeDateTime([1, TemporalUnit.MINUTE]);
      }, 1);
    } else {
      clearInterval(this.playLoop);
      this.playLoop = undefined;
    }
  }

  private resetBearing() {
    this.bearing = this.city.latitude >= 0 ? Bearing.SOUTH : Bearing.NORTH;
  }

  protected get defaultTextColor(): string {
    return CelestialBg.sun.altitude > EarthComponent.HORIZON ? 'black' : 'whitesmoke';
  }

}
