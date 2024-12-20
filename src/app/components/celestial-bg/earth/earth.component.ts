import { Component, Input } from '@angular/core';
import { TDate } from 'src/app/model/thyrannic-date';

@Component({
  selector: 'app-earth',
  standalone: true,
  imports: [],
  template: '<div></div>',
  styleUrl: './earth.component.scss'
})
export class EarthComponent {

  @Input()
  date!: TDate;

}
