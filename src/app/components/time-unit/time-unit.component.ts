import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { filter } from "rxjs";
import { InputDialog } from "src/app/dialogs/input/input.dialog";
import { TemporalUnit } from "src/app/model/temporal-unit";
import { TDay } from "src/app/model/thyrannic-day";

@Component({
  selector: 'time-unit',
  templateUrl: './time-unit.component.html',
  styleUrls: ['./time-unit.component.scss']
})
export class TimeUnitComponent {

  @Input()
  unit!: TemporalUnit;

  @Input()
  value!: number;

  @Output()
  change: EventEmitter<[number, TemporalUnit]> = new EventEmitter();

  constructor(private dialogMgr: MatDialog) {}

  public changeValue(amount: number) {
    this.change.emit([amount, this.unit]);
  }

  public setValue() {
    const config = {
      data: {
        title: 'Set the ' + this.unit.toString().toLowerCase(),
        options: this.unit === TemporalUnit.DAY ? TDay.values : undefined
      }
    }

    this.dialogMgr.open(InputDialog, config).afterClosed()
      .pipe(filter(x => x !== undefined))
      .subscribe(newValue => {
        this.changeValue(newValue - this.value);
      });
  }

}
