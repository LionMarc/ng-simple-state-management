import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoDashboardComponent } from './components/todo-dashboard/todo-dashboard.component';

const routes: Routes = [
  {
    path: 'todo',
    component: TodoDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [RouterModule]
})
export class TodoRoutingModule {}
