import { Routes } from '@angular/router';

import { ngssmReloadRemoteData } from 'ngssm-remote-data';

import { TodoDashboardComponent } from './components/todo-dashboard/todo-dashboard.component';
import { todoItemsKey } from './model';

export const todoRoutes: Routes = [
  {
    path: 'todo-list',
    component: TodoDashboardComponent,
    canActivate: [ngssmReloadRemoteData(todoItemsKey, { forceReload: false })]
  }
];
