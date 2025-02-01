import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Effect, Store, State, Action } from 'ngssm-store';
import { NgssmNotifierService } from 'ngssm-toolkit';

import { TodoActionType } from '../actions';
import { TodoItemEditorComponent } from '../components/todo-item-editor/todo-item-editor.component';
import { todoItemKey } from '../model';
import { selectTodoState } from '../state';
import { NgssmLoadDataSourceValueAction } from 'ngssm-data';

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
          new NgssmLoadDataSourceValueAction(todoItemKey, {
            forceReload: true,
            parameter: {
              value: 12345
            }
          })
        );

        store.dispatchAction(
          new NgssmLoadDataSourceValueAction(todoItemKey, {
            forceReload: true,
            parameter: {
              value: selectTodoState(state).todoItemEditor.todoItemId
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
