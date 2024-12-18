import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './input.dialog.html',
  styleUrls: ['./input.dialog.scss']
})
export class InputDialog {

  value?: number;

  constructor(
    private matDialogRef: MatDialogRef<InputDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, options?: Array<any> }
  ) {
    document.querySelector('input')?.focus();
    document.querySelector('select')?.focus();
  }

  public onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.matDialogRef.close(this.value);
    }
  }

}
