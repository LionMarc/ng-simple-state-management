import { ApplicationConfig, effect, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';

import { provideNgssmStore, provideConsoleAppender, Store, Logger } from 'ngssm-store';
import { provideNgssmAgGrid } from 'ngssm-ag-grid';
import { provideNgssmRemoteCall, provideNgssmRemoteData } from 'ngssm-remote-data';
import { provideNgssmMatDialog, useDefaultErrorStateMatcher } from 'ngssm-toolkit';
import { NGSSM_TREE_DATA_SERVICE, provideNgssmTree, provideNgssmExpressionTree } from 'ngssm-tree';
import { provideNgssmNavigation } from 'ngssm-navigation';
import { provideNgssmShell } from 'ngssm-shell';
import { provideNgssmVisibility } from 'ngssm-store/visibility';
import { provideNgssmData } from 'ngssm-data';
import { provideNgssmSmusdi } from 'ngssm-smusdi';

import { TreeDataService } from './ngssm-tree-demo/tree-data.service';
import { provideRemoteDataDemo } from './remote-data-demo/public-api';
import { provideJsonBuilder } from './ngssm-expression-tree-demo/json-builder/provide-json-builder';
import { provideToolkitDemo } from './toolkit/public-api';
import { provideNgssmDataDemo } from './ngssm-data-demo/public-api';
import { provideTodo } from './todo/provide-todo';
import { routes } from './app.routes';

import { provideNgssmFeatureStateDemo } from './ngssm-feature-state-demo/public-api';

export const actionEffectInitializer = async () => {
  const store = inject(Store);
  const logger = inject(Logger);

  store.useMacroTasks = true;
  store.processedAction$.subscribe((action) => logger.debug(`[Store] Action ${action.type} received as observable`));

  effect(() => {
    const action = store.processedAction();

    logger.debug(`[Store] Action ${action.type} received as signal`);
  });

  return true;
};

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([MatDialogModule, MatSnackBarModule]),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { position: { top: '40px' }, closeOnNavigation: false }
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { horizontalPosition: 'right', verticalPosition: 'top', duration: 1000 }
    },
    provideNgssmStore(),
    provideConsoleAppender('Main'),
    useDefaultErrorStateMatcher,
    provideNgssmShell(),
    provideNgssmRemoteData(),
    provideNgssmTree(),
    provideNgssmNavigation(),
    provideNgssmAgGrid({
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
      },
      loadSavedGridStatesAtStartup: true
    }),
    provideNgssmRemoteCall(),
    provideNgssmExpressionTree(),
    provideNgssmVisibility(),
    provideNgssmMatDialog(),
    provideNgssmData(),
    { provide: NGSSM_TREE_DATA_SERVICE, useClass: TreeDataService, multi: true },
    provideRemoteDataDemo(),
    provideJsonBuilder(),
    provideToolkitDemo(),
    provideNgssmDataDemo(),
    provideTodo(),
    provideNgssmFeatureStateDemo(),
    provideNgssmSmusdi('http://localhost:5100/info'),
    provideAppInitializer(actionEffectInitializer)
  ]
};
