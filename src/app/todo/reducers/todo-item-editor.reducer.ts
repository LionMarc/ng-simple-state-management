import { Injectable, Provider } from '@angular/core';
import { selectRemoteData } from 'ngssm-remote-data';

import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';

import { EditTodoItemAction, TodoActionType, UpdateTodoItemPropertyAction } from '../actions';
import { TodoItem, todoItemsKey } from '../model';
import { getDefaultTodoItemEditor, updateTodoState } from '../state';

@Injectable()
export class TodoItemEditorReducer implements Reducer {
  public readonly processedActions: string[] = [
    TodoActionType.addTodoItem,
    TodoActionType.editTodoItem,
    TodoActionType.updateTodoItemProperty,
    TodoActionType.submitEditedTodoItem
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case TodoActionType.addTodoItem:
        return updateTodoState(state, {
          todoItemEditor: { $set: getDefaultTodoItemEditor() }
        });

      case TodoActionType.editTodoItem:
        const editTodoItemAction = action as EditTodoItemAction;
        return updateTodoState(state, {
          todoItemEditor: {
            todoItemId: { $set: editTodoItemAction.todoItemId },
            todoItem: {
              $set: (selectRemoteData(state, todoItemsKey).data ?? []).find((t: TodoItem) => t.id === editTodoItemAction.todoItemId)
            },
            submissionInProgress: { $set: false }
          }
        });

      case TodoActionType.updateTodoItemProperty:
        const updateTodoItemPropertyAction = action as UpdateTodoItemPropertyAction;
        return updateTodoState(state, {
          todoItemEditor: {
            todoItem: {
              [updateTodoItemPropertyAction.propertyName]: { $set: updateTodoItemPropertyAction.propertyValue }
            }
          }
        });

      case TodoActionType.submitEditedTodoItem:
        return updateTodoState(state, {
          todoItemEditor: {
            submissionInProgress: { $set: true }
          }
        });
    }

    return state;
  }
}

export const todoItemEditorReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: TodoItemEditorReducer,
  multi: true
};
