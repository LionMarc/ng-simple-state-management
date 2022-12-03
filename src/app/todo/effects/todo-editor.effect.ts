import { Injectable, Provider } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { Effect, Store, State, Action, NGSSM_EFFECT } from 'ngssm-store';

import { TodoActionType } from '../actions';
import { TodoItemEditorComponent } from '../components/todo-item-editor/todo-item-editor.component';

@Injectable()
export class TodoEditorEffect implements Effect {
  private dialog: MatDialogRef<TodoItemEditorComponent> | undefined;

  public readonly processedActions: string[] = [
    TodoActionType.addTodoItem,
    TodoActionType.closeTodoItemEditor,
    TodoActionType.editTodoItem
  ];

  constructor(private matDialog: MatDialog) {}

  public processAction(store: Store, state: State, action: Action): void {
    switch (action.type) {
      case TodoActionType.addTodoItem:
      case TodoActionType.editTodoItem:
        this.dialog = this.matDialog.open(TodoItemEditorComponent, {
          disableClose: true
        });

        break;

      case TodoActionType.closeTodoItemEditor:
        this.dialog?.close();
        this.dialog = undefined;

        break;
    }
  }
}

export const todoEditorEffectProvider: Provider = {
  provide: NGSSM_EFFECT,
  useClass: TodoEditorEffect,
  multi: true
};
