import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgssmRemoteDataModule } from 'ngssm-remote-data';
import { MaterialImportsModule, NgssmToolkitModule } from 'ngssm-toolkit';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoModule } from './todo/public-api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    MaterialImportsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgssmToolkitModule,
    NgssmRemoteDataModule,
    TodoModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
