import { Routes } from '@angular/router';

import { ngssmLoadDataSourceValue } from 'ngssm-data';

import { TodoDashboardComponent } from './components/todo-dashboard/todo-dashboard.component';
import { todoItemsKey } from './model';

export const todoRoutes: Routes = [
  {
    path: 'todo-list',
    component: TodoDashboardComponent,
    canActivate: [ngssmLoadDataSourceValue(todoItemsKey, false)]
  }
];
