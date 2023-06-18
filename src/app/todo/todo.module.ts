import { NgModule, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';

import { MaterialImportsModule } from 'ngssm-toolkit';
import { NgssmRemoteDataReloadButtonComponent, provideRemoteDataFunc, provideRemoteDataProviders } from 'ngssm-remote-data';
import { NGSSM_NAVIGATION_LOCKING_CONFIG } from 'ngssm-navigation';
import { provideEffects, provideReducer } from 'ngssm-store';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoItemProviderService, TodoItemsService } from './services';
import { TodoItemEditorComponent } from './components/todo-item-editor/todo-item-editor.component';
import { TodoEditorEffect } from './effects/todo-editor.effect';
import { TodoItemEditorReducer } from './reducers/todo-item-editor.reducer';
import { TodoActionType } from './actions';
import { EditedTodoItemSubmissionEffect } from './effects/edited-todo-item-submission.effect';
import { TodoCountComponent } from './components/todo-count/todo-count.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { todoItemsKey } from './model';

@NgModule({
  declarations: [TodoItemEditorComponent, TodoCountComponent, TodoFooterComponent],
  imports: [ReactiveFormsModule, MaterialImportsModule, AgGridModule, TodoRoutingModule, NgssmRemoteDataReloadButtonComponent],
  providers: [
    provideRemoteDataFunc(
      todoItemsKey,
      () => {
        const service = inject(TodoItemsService);
        return service.get();
      },
      600
    ),
    provideRemoteDataProviders(TodoItemProviderService),
    provideReducer(TodoItemEditorReducer),
    provideEffects(EditedTodoItemSubmissionEffect, TodoEditorEffect),
    {
      provide: NGSSM_NAVIGATION_LOCKING_CONFIG,
      multi: true,
      useValue: {
        actionsLockingNavigation: [TodoActionType.addTodoItem, TodoActionType.editTodoItem],
        actionsUnLockingNavigation: [TodoActionType.closeTodoItemEditor]
      }
    }
  ]
})
export class TodoModule {}
