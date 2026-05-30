import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { CelestialBg } from './components/celestial-bg/celestial-bg.component';
import { CelestialBgModule } from './components/celestial-bg/celestial-bg.module';
import { Earth } from './components/celestial-bg/earth/earth';
import { HoldableButtonComponent } from './components/holdable-button/holdable-button.component';
import { PinnedDateComponent } from "./components/pinned-date/pinned-date.component";
import { TimeUnitComponent } from './components/time-unit/time-unit.component';
import { Bearing } from './model/bearing';
import { City } from './model/city';
import { TemporalUnit } from './model/temporal-unit';
import { TDate } from './model/thyrannic-date';
import { TDateTime } from './model/thyrannic-date-time';
import { DegreesPipe } from './pipes/degrees.pipe';
import { OrdinalPipe } from './pipes/ordinal.pipe';
import { LocalValue } from './util/local-value';
import { MathUtil } from './util/math-util';
import { angle } from './util/units';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FontAwesomeModule, CelestialBgModule, OrdinalPipe, DegreesPipe, TimeUnitComponent, FormsModule, NgIf, NgFor, PinnedDateComponent, HoldableButtonComponent],
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
  protected get sunPathEnabled() { return !!CelestialBg.sun.skyPath.enabled; }

  public static readonly FOV = 90;

  // Load datetime from local storage
  private _datetime: TDateTime = LocalValue.CURRENT_DATETIME.get() || TDate.fromDate().at(12, 0);
  public get datetime(): TDateTime {
    return this._datetime;
  }
  // Update datetime and set in local storage
  protected set datetime(datetime: TDateTime) {
    this._datetime = datetime;
    LocalValue.CURRENT_DATETIME.put(datetime);
    CelestialBg.updatePositions();
  }

  protected _city: City = LocalValue.CITY.get() || City.THYRANNOS;
  public get city(): City { return this._city; }
  public set city(city: City) {
    const longDiff = city.longitude - this._city.longitude;
    this._city = city;
    LocalValue.CITY.put(city);
    this.datetime = this.datetime.add(Math.round(longDiff * 4), TemporalUnit.MINUTE); // triggers CelestialBg.updatePositions()
    CelestialBg.earth.updateLocation();
  }

  public bearing: Bearing = this.city.latitude >= 0 ? Bearing.SOUTH : Bearing.NORTH;
  public elevation: { min: angle, max: angle, angle: angle } = { min: this.environment.mobile ? 30 : 40, max: 90, angle: 0 };

  constructor() {
    AppComponent.instance = this;
    this.elevation.angle = this.elevation.min;
    CelestialBg.init();
  }

  public changeDateTime([quantity, unit]: [number, TemporalUnit]) {
    try {
      this.datetime = this.datetime.add(quantity, unit);
    } catch (err) {
      console.error('Illegal operation:', err);
    }
  }

  public updateSunPathMode() {
    CelestialBg.sun.updatePath(!CelestialBg.sun.skyPath.enabled);
  }

  public changeBearing(dir?: 1 | -1) {
    if (dir !== undefined) {
      const targetAngle = MathUtil.fixAngle(this.bearing.angle + dir * 5);
      const targetBearing = Bearing.values.find(bearing => bearing.angle === targetAngle);
      if (targetBearing) {
        this.bearing = targetBearing;
      } else {
        this.bearing = Bearing.custom(targetAngle);
      }
    }
    CelestialBg.updateScreenPositions();
  }

  public changeElevation(dir: 1 | -1) {
    this.elevation.angle = MathUtil.clamp(this.elevation.min, this.elevation.angle + dir * 5, this.elevation.max);
    CelestialBg.updateScreenPositions();
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

  protected get defaultTextColor(): string {
    return CelestialBg.sun.altitude > Earth.HORIZON ? 'black' : 'whitesmoke';
  }

}
