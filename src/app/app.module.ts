import { NgModule } from '@angular/core';

import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { NGSSM_AG_GRID_OPTIONS, provideNgssmAgGrid } from 'ngssm-ag-grid';
import { NgssmNavigationModule } from 'ngssm-navigation';
import { provideNgssmRemoteCall, provideNgssmRemoteData } from 'ngssm-remote-data';
import { NgssmShellModule } from 'ngssm-shell';
import {
  defaultRegexEditorValidator,
  MaterialImportsModule,
  NgssmToolkitModule,
  NGSSM_REGEX_EDITOR_VALIDATOR,
  RegexEditorValidator,
  useDefaultErrorStateMatcher
} from 'ngssm-toolkit';
import { NGSSM_TREE_DATA_SERVICE, provideNgssmTree } from 'ngssm-tree';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoModule } from './todo/public-api';
import { AceEditorModule } from './ace-editor/public-api';
import { ToolkitModule } from './toolkit/public-api';
import { ShellDemoModule } from './shell-demo/public-api';
import { TreeDataService } from './ngssm-tree-demo/tree-data.service';
import { provideRemoteDataDemo } from './remote-data-demo/public-api';

const dotnetRegexValidator: RegexEditorValidator = {
  validatePattern: (pattern: string) => {
    const result = JSON.parse((window as any).dotnet.tools.regexToolsApi.validatePattern(pattern));
    return result;
  },
  isMatch: (pattern: string, testString: string) => (window as any).dotnet.tools.regexToolsApi.isMatch(pattern, testString)
};

const dotnetRegexValidatorFactory = (): RegexEditorValidator => {
  if ((window as any).dotnet?.tools?.regexToolsApi) {
    return dotnetRegexValidator;
  }

  return defaultRegexEditorValidator;
};

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
    provideNgssmRemoteCall(),
    { provide: NGSSM_TREE_DATA_SERVICE, useClass: TreeDataService, multi: true },
    { provide: NGSSM_REGEX_EDITOR_VALIDATOR, useFactory: dotnetRegexValidatorFactory },
    provideRemoteDataDemo()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
