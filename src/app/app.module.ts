import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { OrdinalPipe } from './pipes/ordinal';
import { TimeUnitComponent } from './components/time-unit/time-unit.component';

@NgModule({
  declarations: [
    AppComponent,
    TimeUnitComponent,
    OrdinalPipe
  ],
  imports: [
    BrowserModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
