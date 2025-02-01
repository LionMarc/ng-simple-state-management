import { Injectable } from '@angular/core';

import { NgssmLoadDataSourceValueAction } from 'ngssm-data';
import { Effect, Store, State, Action, Logger } from 'ngssm-store';

import { TodoActionType } from '../actions';
import { todoItemsKey } from '../model';
import { TodoItemsService } from '../services';
import { selectTodoState } from '../state';

@Injectable()
export class EditedTodoItemSubmissionEffect implements Effect {
  public readonly processedActions: string[] = [TodoActionType.submitEditedTodoItem];

  constructor(
    private todoItemsService: TodoItemsService,
    private logger: Logger
  ) {}

  public processAction(store: Store, state: State, action: Action): void {
    const todoItem = selectTodoState(state).todoItemEditor.todoItem;
    if (!todoItem) {
      return;
    }

    const id = selectTodoState(state).todoItemEditor.todoItemId;
    console.log('CALLED', todoItem, id);
    if (id === undefined) {
      this.todoItemsService.createTodoItem(todoItem).subscribe({
        next: () => {
          this.logger.information('To-Do created.');
          store.dispatchAction(new NgssmLoadDataSourceValueAction(todoItemsKey, { forceReload: true }));
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
          store.dispatchAction(new NgssmLoadDataSourceValueAction(todoItemsKey, { forceReload: true }));
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
