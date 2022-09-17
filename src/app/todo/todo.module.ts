import { NgModule } from '@angular/core';

import { MaterialImportsModule, NgssmToolkitModule } from 'ngssm-toolkit';
import { NGSSM_REMOTE_DATA_PROVIDER } from 'ngssm-remote-data';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoDashboardComponent } from './components/todo-dashboard/todo-dashboard.component';
import { TodoItemsService } from './services';
import { TodoItemComponent } from './components/todo-item/todo-item.component';

@NgModule({
  declarations: [TodoDashboardComponent, TodoItemComponent],
  imports: [MaterialImportsModule, NgssmToolkitModule, TodoRoutingModule],
  providers: [{ provide: NGSSM_REMOTE_DATA_PROVIDER, useClass: TodoItemsService, multi: true }]
})
export class TodoModule {}
