import { Component, Input } from '@angular/core';
import { TDateTime } from 'src/app/model/thyrannic-date-time';

@Component({
  selector: 'app-sky',
  standalone: true,
  imports: [],
  template: '<div></div>',
  styleUrl: './sky.component.scss'
})
export class SkyComponent {

  @Input()
  datetime!: TDateTime;

}
