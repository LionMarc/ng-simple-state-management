import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RemoteDataLoadingGuard } from 'ngssm-remote-data';

import { TodoDashboardComponent } from './components/todo-dashboard/todo-dashboard.component';
import { todoItemsKey } from './model';

const routes: Routes = [
  {
    path: 'todo-list',
    component: TodoDashboardComponent,
    canActivate: [RemoteDataLoadingGuard],
    data: {
      remoteDataItems: [
        {
          remoteDataKey: todoItemsKey,
          forceReload: false
        }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [RouterModule]
})
export class TodoRoutingModule {}
