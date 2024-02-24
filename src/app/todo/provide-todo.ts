import { EnvironmentProviders, inject, makeEnvironmentProviders } from '@angular/core';

import { provideRemoteDataFunc, provideRemoteDataProviders } from 'ngssm-remote-data';
import { NGSSM_NAVIGATION_LOCKING_CONFIG } from 'ngssm-navigation';
import { Action, State, provideEffectFunc, provideEffects, provideReducer } from 'ngssm-store';

import { TodoItemProviderService, TodoItemsService } from './services';
import { TodoEditorEffect } from './effects/todo-editor.effect';
import { TodoItemEditorReducer } from './reducers/todo-item-editor.reducer';
import { TodoActionType } from './actions';
import { EditedTodoItemSubmissionEffect } from './effects/edited-todo-item-submission.effect';
import { todoItemsKey } from './model';
import { HttpClient } from '@angular/common/http';

const testingEffectFunc = (state: State, action: Action) => {
  inject(HttpClient)
    .get('testing')
    .subscribe((r) => console.log(r, action));
};

export const provideTodo = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
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
    },
    provideEffectFunc(TodoActionType.addTodoItem, testingEffectFunc)
  ]);
};
