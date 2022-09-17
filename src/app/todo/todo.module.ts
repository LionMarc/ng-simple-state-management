import { NgModule } from '@angular/core';

import { MaterialImportsModule } from 'ngssm-toolkit';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoDashboardComponent } from './components/todo-dashboard/todo-dashboard.component';

@NgModule({
  declarations: [TodoDashboardComponent],
  imports: [MaterialImportsModule, TodoRoutingModule],
  providers: []
})
export class TodoModule {}
