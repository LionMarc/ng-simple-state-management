import { NgModule } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgssmAgGridModule, NGSSM_AG_GRID_OPTIONS } from 'ngssm-ag-grid';
import { NgssmNavigationModule } from 'ngssm-navigation';
import { NgssmRemoteDataModule } from 'ngssm-remote-data';
import { NgssmShellModule } from 'ngssm-shell';
import { MaterialImportsModule, NgssmToolkitModule, useDefaultErrorStateMatcher } from 'ngssm-toolkit';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoModule } from './todo/public-api';
import { AceEditorModule } from './ace-editor/public-api';
import { ToolkitModule } from './toolkit/public-api';
import { ShellDemoModule } from './shell-demo/public-api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    MaterialImportsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgssmShellModule.forRoot(),
    NgssmToolkitModule,
    NgssmRemoteDataModule,
    NgssmNavigationModule,
    NgssmAgGridModule.forRoot(),
    TodoModule,
    AceEditorModule,
    ToolkitModule,
    ShellDemoModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { position: { top: '40px' }, closeOnNavigation: false }
    },
    useDefaultErrorStateMatcher,
    {
      provide: NGSSM_AG_GRID_OPTIONS,
      useValue: {
        theme: 'ag-theme-alpine',
        statusBar: {
          statusPanels: [
            {
              statusPanel: 'agTotalAndFilteredRowCountComponent'
            }
          ]
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
