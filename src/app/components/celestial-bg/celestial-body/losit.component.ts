import { Component, Input } from '@angular/core';
import { TDateTime } from 'src/app/model/thyrannic-date-time';

@Component({
  selector: 'app-losit',
  standalone: true,
  imports: [],
  templateUrl: './celestial-body.html',
  styleUrl: './celestial-body.scss'
})
export class LositComponent {
  
  angularDiameter = 0.44;
  color = 'rgb(63, 21, 16)';
  brightness = 0.92;
  zIndex = 2;
  
  top = ''; left = '';

  @Input('datetime')
  set updatePosition(datetime: TDateTime) {

  }

}
