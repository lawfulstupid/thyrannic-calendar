import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TemporalUnit } from "src/app/model/temporal-unit";

@Component({
  selector: 'time-unit',
  templateUrl: './time-unit.component.html',
  styleUrls: ['./time-unit.component.scss']
})
export class TimeUnitComponent {

  @Input()
  text!: string;

  @Input()
  unit!: TemporalUnit;

  @Output()
  change: EventEmitter<[number, TemporalUnit]> = new EventEmitter();

}
