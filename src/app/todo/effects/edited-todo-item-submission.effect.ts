import { Injectable, Provider } from '@angular/core';
import { LoadRemoteDataAction } from 'ngssm-remote-data';

import { Effect, Store, State, Action, NGSSM_EFFECT } from 'ngssm-store';
import { Logger } from 'ngssm-toolkit';

import { TodoActionType } from '../actions';
import { todoItemsKey } from '../model';
import { TodoItemsService } from '../services';
import { selectTodoState } from '../state';

@Injectable()
export class EditedTodoItemSubmissionEffect implements Effect {
  public readonly processedActions: string[] = [TodoActionType.submitEditedTodoItem];

  constructor(private todoItemsService: TodoItemsService, private logger: Logger) {}

  public processAction(store: Store, state: State, action: Action): void {
    const todoItem = selectTodoState(state).todoItemEditor.todoItem;
    const id = selectTodoState(state).todoItemEditor.todoItemId;
    if (id === undefined) {
      this.todoItemsService.createTodoItem(todoItem).subscribe({
        next: () => {
          this.logger.information('To-Do created.');
          store.dispatchAction(new LoadRemoteDataAction(todoItemsKey, true));
          store.dispatchActionType(TodoActionType.closeTodoItemEditor);
        },
        error: (error) => {
          this.logger.error('Unable to create the To-Do', error);
          // TODO - register the error
        }
      });
    } else {
      this.todoItemsService.updateTodoItem(id, todoItem).subscribe({
        next: () => {
          this.logger.information('To-Do updated.');
          store.dispatchAction(new LoadRemoteDataAction(todoItemsKey, true));
          store.dispatchActionType(TodoActionType.closeTodoItemEditor);
        },
        error: (error) => {
          this.logger.error('Unable to update the To-Do', error);
          // TODO - register the error
        }
      });
    }
  }
}

export const editedTodoItemSubmissionEffectProvider: Provider = {
  provide: NGSSM_EFFECT,
  useClass: EditedTodoItemSubmissionEffect,
  multi: true
};
