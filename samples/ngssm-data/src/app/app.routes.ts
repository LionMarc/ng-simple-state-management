import { Routes } from '@angular/router';

import { NotFoundComponent } from 'ngssm-toolkit';
import { ngssmLoadDataSourceValue } from 'ngssm-data';

import { AlertRulesComponent } from './components';
import { alertRulesKey } from './model';

export const routes: Routes = [
  { path: 'alert-rules', component: AlertRulesComponent, canActivate: [ngssmLoadDataSourceValue(alertRulesKey)] },
  { path: '**', component: NotFoundComponent }
];
