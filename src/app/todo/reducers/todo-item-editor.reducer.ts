import { Injectable } from '@angular/core';

import { getDefaultRemoteData, selectRemoteData, updateRemoteDataState } from 'ngssm-remote-data';
import { Reducer, State, Action } from 'ngssm-store';

import { EditTodoItemAction, TodoActionType, UpdateTodoItemPropertyAction } from '../actions';
import { TodoItem, todoItemKey, todoItemsKey } from '../model';
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
      case TodoActionType.addTodoItem: {
        const updatedState = updateRemoteDataState(state, {
          [todoItemKey]: { $set: getDefaultRemoteData<TodoItem>() }
        });
        return updateTodoState(updatedState, {
          todoItemEditor: { $set: getDefaultTodoItemEditor() }
        });
      }

      case TodoActionType.editTodoItem:
        const editTodoItemAction = action as EditTodoItemAction;
        return updateTodoState(state, {
          todoItemEditor: {
            todoItemId: { $set: editTodoItemAction.todoItemId },
            todoItem: {
              $set: (selectRemoteData(state, todoItemsKey)?.data ?? []).find((t: TodoItem) => t.id === editTodoItemAction.todoItemId)
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
