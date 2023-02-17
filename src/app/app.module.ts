import { NgModule } from '@angular/core';

import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { NGSSM_AG_GRID_OPTIONS, provideNgssmAgGrid } from 'ngssm-ag-grid';
import { NgssmNavigationModule } from 'ngssm-navigation';
import { provideNgssmRemoteData } from 'ngssm-remote-data';
import { NgssmShellModule } from 'ngssm-shell';
import { MaterialImportsModule, NgssmToolkitModule, useDefaultErrorStateMatcher } from 'ngssm-toolkit';
import { NGSSM_TREE_DATA_SERVICE, provideNgssmTree } from 'ngssm-tree';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoModule } from './todo/public-api';
import { AceEditorModule } from './ace-editor/public-api';
import { ToolkitModule } from './toolkit/public-api';
import { ShellDemoModule } from './shell-demo/public-api';
import { TreeDataService } from './ngssm-tree-demo/tree-data.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    MaterialImportsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgssmShellModule.forRoot(),
    NgssmToolkitModule,
    NgssmNavigationModule,
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
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { horizontalPosition: 'right', verticalPosition: 'top', duration: 1000 }
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
    },
    provideNgssmRemoteData(),
    provideNgssmTree(),
    provideNgssmAgGrid(),
    { provide: NGSSM_TREE_DATA_SERVICE, useClass: TreeDataService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
