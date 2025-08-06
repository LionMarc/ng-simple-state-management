import { inject, Injectable } from '@angular/core';

import { NgssmLoadDataSourceValueAction } from 'ngssm-data';
import { Effect, State, Logger, ActionDispatcher } from 'ngssm-store';
import { RemoteCallResultProcessor } from 'ngssm-remote-data';

import { TodoActionType } from '../actions';
import { todoItemsKey } from '../model';
import { TodoItemsService } from '../services';
import { selectTodoState } from '../state';

@Injectable()
export class EditedTodoItemSubmissionEffect implements Effect {
  private readonly todoItemsService = inject(TodoItemsService);
  private readonly logger = inject(Logger);
  private readonly remoteCallResultProcesor = inject(RemoteCallResultProcessor);

  public readonly processedActions: string[] = [TodoActionType.submitEditedTodoItem];

  public processAction(actiondispatcher: ActionDispatcher, state: State): void {
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
          actiondispatcher.dispatchAction(new NgssmLoadDataSourceValueAction(todoItemsKey, { forceReload: true }));
          actiondispatcher.dispatchActionType(TodoActionType.closeTodoItemEditor);
          this.remoteCallResultProcesor.processRemoteCallSuccess('test', 'OKAYYYYYYY');
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
          actiondispatcher.dispatchAction(new NgssmLoadDataSourceValueAction(todoItemsKey, { forceReload: true }));
          actiondispatcher.dispatchActionType(TodoActionType.closeTodoItemEditor);
        },
        error: (error) => {
          this.logger.error('Unable to update the To-Do', error);
          // TODO - register the error
        }
      });
    }
  }
}
