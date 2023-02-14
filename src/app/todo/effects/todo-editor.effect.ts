import { Injectable, Provider } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadRemoteDataAction } from 'ngssm-remote-data';

import { Effect, Store, State, Action, NGSSM_EFFECT } from 'ngssm-store';
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

  constructor(private matDialog: MatDialog, private notifier: NgssmNotifierService) {}

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

        store.dispatchAction(
          new LoadRemoteDataAction(todoItemKey, true, {
            serviceParams: selectTodoState(state).todoItemEditor.todoItemId,
            callbackAction: TodoActionType.todoItemLoaded
          })
        );

        break;

      case TodoActionType.closeTodoItemEditor:
        this.dialog?.close();
        this.dialog = undefined;

        break;

      case TodoActionType.todoItemLoaded:
        this.notifier.notifySuccess('Todo Item loaded');

        break;
    }
  }
}

export const todoEditorEffectProvider: Provider = {
  provide: NGSSM_EFFECT,
  useClass: TodoEditorEffect,
  multi: true
};
