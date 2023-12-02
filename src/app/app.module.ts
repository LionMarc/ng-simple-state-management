import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { NGSSM_AG_GRID_OPTIONS, provideNgssmAgGrid } from 'ngssm-ag-grid';
import { NgssmCachesDisplayButtonComponent, provideNgssmRemoteCall, provideNgssmRemoteData } from 'ngssm-remote-data';
import {
  defaultRegexEditorValidator,
  MaterialImportsModule,
  NGSSM_REGEX_EDITOR_VALIDATOR,
  provideNgssmMatDialog,
  RegexEditorValidator,
  useDefaultErrorStateMatcher
} from 'ngssm-toolkit';
import { NGSSM_TREE_DATA_SERVICE, provideNgssmTree, provideNgssmExpressionTree } from 'ngssm-tree';
import { provideNgssmNavigation } from 'ngssm-navigation';
import { ShellComponent, provideNgssmShell } from 'ngssm-shell';
import { provideNgssmVisibility } from 'ngssm-store/visibility';
import { provideNgssmServiceInfo } from 'ngssm-remote-data/service-info';
import { provideConsoleAppender } from 'ngssm-store';
import { provideNgssmData } from 'ngssm-data';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoModule } from './todo/public-api';
import { AceEditorModule } from './ace-editor/public-api';
import { ShellDemoModule } from './shell-demo/public-api';
import { TreeDataService } from './ngssm-tree-demo/tree-data.service';
import { provideRemoteDataDemo } from './remote-data-demo/public-api';
import { provideJsonBuilder } from './ngssm-expression-tree-demo/json-builder/provide-json-builder';
import { provideToolkitDemo } from './toolkit/public-api';
import { provideNgssmDataDemo } from './ngssm-data-demo/public-api';

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
    TodoModule,
    AceEditorModule,
    ShellDemoModule,
    AppRoutingModule,
    NgssmCachesDisplayButtonComponent,
    ShellComponent
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { position: { top: '40px' }, closeOnNavigation: false }
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { horizontalPosition: 'right', verticalPosition: 'top', duration: 1000 }
    },
    provideConsoleAppender('Main'),
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
        },
        defaultColDef: {
          resizable: true,
          sortable: true
        }
      }
    },
    provideNgssmShell(),
    provideNgssmRemoteData(),
    provideNgssmTree(),
    provideNgssmNavigation(),
    provideNgssmAgGrid(),
    provideNgssmRemoteCall(),
    provideNgssmExpressionTree(),
    provideNgssmVisibility(),
    provideNgssmServiceInfo(),
    provideNgssmMatDialog(),
    provideNgssmData(),
    { provide: NGSSM_TREE_DATA_SERVICE, useClass: TreeDataService, multi: true },
    { provide: NGSSM_REGEX_EDITOR_VALIDATOR, useFactory: dotnetRegexValidatorFactory },
    provideRemoteDataDemo(),
    provideJsonBuilder(),
    provideToolkitDemo(),
    provideNgssmDataDemo()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
