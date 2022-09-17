import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialImportsModule, NgssmToolkitModule } from 'ngssm-toolkit';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [MaterialImportsModule, BrowserModule, AppRoutingModule, BrowserAnimationsModule, NgssmToolkitModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
