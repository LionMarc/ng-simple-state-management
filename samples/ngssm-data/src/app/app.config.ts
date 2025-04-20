import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { provideConsoleAppender } from 'ngssm-store';
import { provideNgssmAgGrid } from 'ngssm-ag-grid';
import { provideNgssmData, provideNgssmDataSource } from 'ngssm-data';

import { routes } from './app.routes';
import { alertRulesKey, alertRulesLoader } from './model/alert-rule';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    provideConsoleAppender('ngssm-data-demo'),
    provideNgssmAgGrid(),
    provideNgssmData(),
    provideNgssmDataSource(alertRulesKey, alertRulesLoader)
  ]
};
