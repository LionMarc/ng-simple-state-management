import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';

import { MaterialImportsModule } from 'ngssm-toolkit';
import { NgssmRemoteDataReloadButtonComponent, NGSSM_REMOTE_DATA_PROVIDER } from 'ngssm-remote-data';
import { NGSSM_NAVIGATION_LOCKING_CONFIG } from 'ngssm-navigation';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoItemProviderService, TodoItemsService } from './services';
import { TodoItemEditorComponent } from './components/todo-item-editor/todo-item-editor.component';
import { todoEditorEffectProvider } from './effects/todo-editor.effect';
import { TodoItemEditorReducer } from './reducers/todo-item-editor.reducer';
import { TodoActionType } from './actions';
import { editedTodoItemSubmissionEffectProvider } from './effects/edited-todo-item-submission.effect';
import { TodoCountComponent } from './components/todo-count/todo-count.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { provideReducer } from 'ngssm-store';

@NgModule({
  declarations: [TodoItemEditorComponent, TodoCountComponent, TodoFooterComponent],
  imports: [ReactiveFormsModule, MaterialImportsModule, AgGridModule, TodoRoutingModule, NgssmRemoteDataReloadButtonComponent],
  providers: [
    { provide: NGSSM_REMOTE_DATA_PROVIDER, useClass: TodoItemsService, multi: true },
    { provide: NGSSM_REMOTE_DATA_PROVIDER, useClass: TodoItemProviderService, multi: true },
    todoEditorEffectProvider,
    provideReducer(TodoItemEditorReducer),
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
