import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './input.dialog.html',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  styleUrls: ['./input.dialog.scss']
})
export class InputDialog {

  value?: number;

  constructor(
    private matDialogRef: MatDialogRef<InputDialog>,
    @Inject(MAT_DIALOG_DATA) readonly data: { title: string, options?: Array<any> }
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
