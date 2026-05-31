import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faClose, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
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

  protected readonly icons = {
    play: faPlay,
    pause: faPause,
    menu: faBars,
    close: faClose
  }

  protected readonly environment = environment;
  protected menuOpen: boolean = false;
  protected readonly units = TemporalUnit;
  protected readonly cities: Array<City> = City.values;
  protected readonly bearings: Array<Bearing> = Bearing.values;
  protected dateUiOpacity: 0 | 50 | 100 = 100;

  public static readonly FOV = 90;
  private static readonly ANGLE_INCREMENT = 5;

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
    if (environment.mobile) {
      setTimeout(() => this.moveToMenu(), 0);
    }
  }

  public changeDateTime([quantity, unit]: [number, TemporalUnit]) {
    try {
      this.datetime = this.datetime.add(quantity, unit);
    } catch (err) {
      console.error('Illegal operation:', err);
    }
  }

  protected get sunPathEnabled() { return !!CelestialBg.sun.skyPath.enabled; }
  protected set sunPathEnabled(state: boolean) {
    CelestialBg.sun.updatePath(state);
  }

  public updateDateUiOpacity() {
    switch (this.dateUiOpacity) {
      case 100: this.dateUiOpacity = 50; break;
      case 50: this.dateUiOpacity = 0; break;
      case 0: this.dateUiOpacity = 100; break;
    }
  }

  public changeBearing(dir?: 1 | -1) {
    if (dir !== undefined) {
      const targetAngle = MathUtil.fixAngle(this.changeAngle(this.bearing.angle, dir));
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
    this.elevation.angle = MathUtil.clamp(
      this.elevation.min,
      this.changeAngle(this.elevation.angle, dir),
      this.elevation.max
    );
    CelestialBg.updateScreenPositions();
  }

  private changeAngle(angle: angle, dir: 1 | -1): angle {
    // Apply change
    const target = angle + dir * AppComponent.ANGLE_INCREMENT;
    // Snap to grid
    return AppComponent.ANGLE_INCREMENT * Math.round(target / AppComponent.ANGLE_INCREMENT);
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

  private moveToMenu() {
    const menuBarItems = document.querySelectorAll('.menubar > .hidable');
    const menuItems = document.querySelectorAll('.menu > *');
    const menu = <HTMLDivElement>document.querySelector('.menu');
    Array.prototype.slice.call(menuBarItems).forEach(menuItem => {
      menu.appendChild(menuItem);
    });
    Array.prototype.slice.call(menuItems).forEach(menuItem => {
      menu.appendChild(menuItem);
    });
  }

  private static readonly DRAG_REDUCTION_FACTOR = 5;
  private static readonly DRAG_UPDATE_MS = 10;
  protected dragToLookEnabled: boolean = true;
  private dragOrigin?: { clientX: number, clientY: number, bearing: angle, elevation: angle };
  private dragLatest?: { clientX: number, clientY: number };
  private dragUpdateLoop?: NodeJS.Timeout;

  protected dragStart({ clientX, clientY }: MouseEvent | PointerEvent) {
    this.menuOpen = false;
    if (!this.dragToLookEnabled) return;
    this.dragOrigin = {
      clientX,
      clientY,
      bearing: this.bearing.angle,
      elevation: this.elevation.angle
    };
    this.dragLatest = undefined;
    this.dragUpdateLoop = setInterval(() => {
      if (this.dragOrigin === undefined) return this.dragEnd(); // cancel
      if (this.dragLatest === undefined) return; // wait

      this.bearing = Bearing.custom(this.dragOrigin.bearing + (this.dragLatest.clientX - this.dragOrigin.clientX) / AppComponent.DRAG_REDUCTION_FACTOR);
      this.elevation.angle = MathUtil.clamp(this.elevation.min, this.dragOrigin.elevation + (this.dragLatest.clientY - this.dragOrigin.clientY) / AppComponent.DRAG_REDUCTION_FACTOR, this.elevation.max);
      CelestialBg.updateScreenPositions();
    }, AppComponent.DRAG_UPDATE_MS);
  }

  protected dragEnd() {
    this.dragOrigin = undefined;
    clearInterval(this.dragUpdateLoop);
  }

  protected drag(event: MouseEvent | PointerEvent) {
    if (!this.dragToLookEnabled || !this.dragOrigin) return; //ignore
    this.dragLatest = event;
  }

}
