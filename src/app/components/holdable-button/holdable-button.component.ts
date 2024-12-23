import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-holdable-button',
  standalone: true,
  imports: [],
  templateUrl: './holdable-button.component.html',
  styleUrl: './holdable-button.component.scss'
})
export class HoldableButtonComponent {

  private static readonly MAX_INTERVAL: number = 100;
  private static readonly MIN_INTERVAL: number = 20;

  @Output()
  output: EventEmitter<void> = new EventEmitter();

  private timer?: NodeJS.Timeout;

  down() {
    this.timer = setTimeout(() => this.startLoop(HoldableButtonComponent.MAX_INTERVAL), 500);
  }

  private startLoop(interval: number) {
    if (interval === HoldableButtonComponent.MIN_INTERVAL) {
      this.timer = setInterval(() => this.output.emit(), HoldableButtonComponent.MIN_INTERVAL);
    } else {
      this.timer = setTimeout(() => {
        this.output.emit();
        this.startLoop(interval - 1);
      }, interval);
    }
  }

  up() {
    clearInterval(this.timer);
  }

}
