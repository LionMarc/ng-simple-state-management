import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadRemoteDataAction, RemoteCallError } from 'ngssm-remote-data';

import { Effect, Store, State, Action } from 'ngssm-store';
import { NgssmNotifierService } from 'ngssm-toolkit';

import { TodoActionType } from '../actions';
import { TodoItemEditorComponent } from '../components/todo-item-editor/todo-item-editor.component';
import { todoItemKey } from '../model';
import { selectTodoState } from '../state';

@Injectable()
export class TodoEditorEffect implements Effect {
  private dialog: MatDialogRef<TodoItemEditorComponent> | undefined;

  public readonly processedActions: string[] = [
    TodoActionType.addTodoItem,
    TodoActionType.closeTodoItemEditor,
    TodoActionType.editTodoItem,
    TodoActionType.todoItemLoaded
  ];

  constructor(
    private matDialog: MatDialog,
    private notifier: NgssmNotifierService
  ) {}

  public processAction(store: Store, state: State, action: Action): void {
    switch (action.type) {
      case TodoActionType.addTodoItem:
        this.dialog = this.matDialog.open(TodoItemEditorComponent, {
          disableClose: true
        });

        break;

      case TodoActionType.editTodoItem:
        this.dialog = this.matDialog.open(TodoItemEditorComponent, {
          disableClose: true
        });

        // To test error notification
        store.dispatchAction(
          new LoadRemoteDataAction(todoItemKey, {
            forceReload: true,
            params: {
              serviceParams: 12345,
              callbackAction: TodoActionType.todoItemLoaded,
              errorNotificationMessage: (error?: RemoteCallError) =>
                `Unable to load TodoItem ${selectTodoState(state).todoItemEditor.todoItemId} : ${error?.title}`
            }
          })
        );

        store.dispatchAction(
          new LoadRemoteDataAction(todoItemKey, {
            forceReload: true,
            params: {
              serviceParams: selectTodoState(state).todoItemEditor.todoItemId,
              callbackAction: TodoActionType.todoItemLoaded,
              errorNotificationMessage: (error?: RemoteCallError) =>
                `Unable to load TodoItem ${selectTodoState(state).todoItemEditor.todoItemId} : ${error?.title}`
            }
          })
        );

        break;

      case TodoActionType.closeTodoItemEditor:
        this.dialog?.close();
        this.dialog = undefined;

        break;

      case TodoActionType.todoItemLoaded:
        console.log('TodoActionType.todoItemLoaded CALLED');

        break;
    }
  }
}
