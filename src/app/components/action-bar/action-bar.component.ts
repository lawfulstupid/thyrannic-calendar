import { Component, ElementRef, Input, ViewChild } from "@angular/core";

@Component({
  selector: 'app-actionbar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['action-bar.component.scss']
})
export class ActionBarComponent {

  @ViewChild("actionbar", {read: ElementRef, static: true})
  elementRef?: ElementRef;

  @Input()
  actions: Array<ActionItem> = [];

  @Input()
  callbackParam?: any;

  get scrollpos(): number {
    if (!this.elementRef) return 0.5;
    const elm: Element = this.elementRef.nativeElement;
    return elm.scrollLeft / (elm.scrollWidth - elm.clientWidth);
  }

  doCallback(action: ActionItem) {
    if (action.callback) {
      if (this.callbackParam === undefined) {
        action.callback();
      } else {
        action.callback(this.callbackParam);
      }
    }
  }

}

export interface ActionItem {
  label: string | number;
  callback?: Function;
  separator?: boolean;
  plaintext?: boolean;
  isDisabled?: () => boolean;
  isHidden?: () => boolean;
}