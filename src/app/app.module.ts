import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { TimeUnitComponent } from './components/time-unit/time-unit.component';
import { InputDialog } from './dialogs/input/input.dialog';
import { OrdinalPipe } from './pipes/ordinal';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TimeUnitComponent,
    OrdinalPipe,
    InputDialog
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatDialogModule,
    MatInputModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
