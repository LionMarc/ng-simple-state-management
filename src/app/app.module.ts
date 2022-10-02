import { NgModule } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgssmAgGridModule } from 'ngssm-ag-grid';
import { NgssmNavigationModule } from 'ngssm-navigation';
import { NgssmRemoteDataModule } from 'ngssm-remote-data';
import { NgssmShellModule } from 'ngssm-shell';
import { MaterialImportsModule, NgssmToolkitModule, useDefaultErrorStateMatcher } from 'ngssm-toolkit';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoModule } from './todo/public-api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    MaterialImportsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgssmShellModule,
    NgssmToolkitModule,
    NgssmRemoteDataModule,
    NgssmNavigationModule,
    NgssmAgGridModule.forRoot(),
    TodoModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { position: { top: '40px' }, closeOnNavigation: false }
    },
    useDefaultErrorStateMatcher
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
