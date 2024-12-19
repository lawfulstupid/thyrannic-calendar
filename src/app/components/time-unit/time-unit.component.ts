import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { filter } from "rxjs";
import { InputDialog } from "src/app/dialogs/input/input.dialog";
import { TemporalUnit } from "src/app/model/temporal-unit";

@Component({
  selector: 'app-time-unit',
  standalone: true,
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
        title: 'Set the ' + this.unit.toString().toLowerCase()
      }
    }

    this.dialogMgr.open(InputDialog, config).afterClosed()
      .pipe(filter(x => x !== undefined))
      .subscribe((modifier: string) => {
        if (modifier.match(/^[+-][0-9]+$/)) {
          this.changeValue(Number(modifier));
        } else if (modifier.match(/^[0-9]+$/)) {
          this.changeValue(Number(modifier) - this.value);
        } else {
          console.error('Invalid value:', modifier);
        }
      });
  }

}
