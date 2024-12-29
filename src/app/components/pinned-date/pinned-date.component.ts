import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBookmark as faBookmarkOpen } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkClosed } from "@fortawesome/free-solid-svg-icons";
import { AppComponent } from 'src/app/app.component';
import { TemporalUnit } from 'src/app/model/temporal-unit';
import { TDateTime } from 'src/app/model/thyrannic-date-time';

@Component({
  selector: 'app-pinned-date',
  standalone: true,
  imports: [FontAwesomeModule, NgIf, NgFor, FormsModule],
  templateUrl: './pinned-date.component.html',
  styleUrl: './pinned-date.component.scss'
})
export class PinnedDateComponent {
  
  readonly faBookmarkOpen = faBookmarkOpen;
  readonly faBookmarkClosed = faBookmarkClosed;
  readonly units = [TemporalUnit.MINUTE, TemporalUnit.HOUR, TemporalUnit.DAY, TemporalUnit.WEEK, TemporalUnit.QUARTER, TemporalUnit.YEAR, TemporalUnit.EPOCH];
  
  protected pinnedDate?: TDateTime;
  protected comparisonUnit: TemporalUnit = TemporalUnit.DAY;
  protected comparisonDist?: number;
  protected comparisonDir?: 'ago' | 'ahead';
  
  @Input('datetime')
  set setDateTime(datetime: TDateTime) {
    this.update(datetime);
  }
  
  @Output()
  setDate: EventEmitter<TDateTime> = new EventEmitter();
  
  public pin() {
    this.pinnedDate = AppComponent.instance.datetime;
    this.update();
  }
  
  public unpin() {
    this.pinnedDate = undefined;
  }
  
  public update(datetime: TDateTime = AppComponent.instance.datetime) {
    const diff = this.pinnedDate?.diff(datetime, this.comparisonUnit) || 0;
    this.comparisonDist = Math.abs(diff);
    this.comparisonDir = Math.sign(diff) > 0 ? 'ahead' : 'ago';
  }
  
  public resetDate() {
    this.setDate.emit(this.pinnedDate);
  }

}
