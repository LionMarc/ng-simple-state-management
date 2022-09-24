import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialImportsModule, NgssmToolkitModule } from 'ngssm-toolkit';
import { NGSSM_REMOTE_DATA_PROVIDER } from 'ngssm-remote-data';
import { NGSSM_NAVIGATION_LOCKING_CONFIG } from 'ngssm-navigation';

import { AgGridModule } from 'ag-grid-angular';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoDashboardComponent } from './components/todo-dashboard/todo-dashboard.component';
import { TodoItemsService } from './services';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoItemEditorComponent } from './components/todo-item-editor/todo-item-editor.component';
import { todoEditorEffectProvider } from './effects/todo-editor.effect';
import { todoItemEditorReducerProvider } from './reducers/todo-item-editor.reducer';
import { TodoActionType } from './actions';
import { editedTodoItemSubmissionEffectProvider } from './effects/edited-todo-item-submission.effect';
import { NgssmAgGridModule } from 'ngssm-ag-grid';

@NgModule({
  declarations: [TodoDashboardComponent, TodoItemComponent, TodoItemEditorComponent],
  imports: [ReactiveFormsModule, MaterialImportsModule, AgGridModule, NgssmToolkitModule, NgssmAgGridModule, TodoRoutingModule],
  providers: [
    { provide: NGSSM_REMOTE_DATA_PROVIDER, useClass: TodoItemsService, multi: true },
    todoEditorEffectProvider,
    todoItemEditorReducerProvider,
    {
      provide: NGSSM_NAVIGATION_LOCKING_CONFIG,
      multi: true,
      useValue: {
        actionsLockingNavigation: [TodoActionType.addTodoItem, TodoActionType.editTodoItem],
        actionsUnLockingNavigation: [TodoActionType.closeTodoItemEditor]
      }
    },
    editedTodoItemSubmissionEffectProvider
  ]
})
export class TodoModule {}
