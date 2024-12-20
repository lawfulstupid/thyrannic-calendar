import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-holdable-button',
  standalone: true,
  imports: [],
  templateUrl: './holdable-button.component.html',
  styleUrl: './holdable-button.component.scss'
})
export class HoldableButtonComponent {

  @Output()
  output: EventEmitter<void> = new EventEmitter();

  private timer?: NodeJS.Timeout;

  down() {
    this.timer = setTimeout(() => this.startLoop(), 500);
  }

  private startLoop() {
    this.timer = setInterval(() => this.output.emit(), 100);
  }

  up() {
    clearInterval(this.timer);
    this.output.emit();
  }

}
