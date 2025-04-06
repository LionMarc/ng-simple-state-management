import { EnvironmentProviders, inject, makeEnvironmentProviders } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { NGSSM_NAVIGATION_LOCKING_CONFIG } from 'ngssm-navigation';
import { Action, State, provideEffectFunc, provideEffects, provideReducer } from 'ngssm-store';
import { provideNgssmDataSource } from 'ngssm-data';

import { TodoItemsService } from './services';
import { TodoEditorEffect } from './effects/todo-editor.effect';
import { TodoItemEditorReducer } from './reducers/todo-item-editor.reducer';
import { TodoActionType } from './actions';
import { EditedTodoItemSubmissionEffect } from './effects/edited-todo-item-submission.effect';
import { todoItemKey, todoItemsKey } from './model';

const testingEffectFunc = (state: State, action: Action) => {
  inject(HttpClient)
    .get('testing')
    .subscribe((r) => console.log(r, action));
};

export const provideTodo = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideNgssmDataSource(
      todoItemsKey,
      () => {
        const service = inject(TodoItemsService);
        return service.get();
      },
      { dataLifetimeInSeconds: 600 }
    ),
    provideNgssmDataSource(
      todoItemKey,
      (state: State, dataSourceKey, parameter?: number) => {
        if (!parameter) {
          throw new Error('Invalid todo item id.');
        }

        const service = inject(TodoItemsService);
        const items = service.items;

        const wanted = items.find((i) => i.id === parameter);
        if (wanted) {
          return of(wanted);
        }

        return throwError(() => ({
          error: { type: 'https://tools.ietf.org/html/rfc7231#section-6.5.4', title: 'Not Found', status: 404 }
        }));
      },
      { dataLifetimeInSeconds: 600 }
    ),
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
