import { Action } from 'ngssm-store';
import { TodoActionType } from './todo-action-type';

export class EditTodoItemAction implements Action {
  public readonly type: string = TodoActionType.editTodoItem;

  constructor(public readonly todoItemId: number) {}
}
