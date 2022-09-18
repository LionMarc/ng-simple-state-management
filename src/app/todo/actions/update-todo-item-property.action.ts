import { Action } from 'ngssm-store';
import { TodoActionType } from './todo-action-type';

export class UpdateTodoItemPropertyAction implements Action {
  public readonly type: string = TodoActionType.updateTodoItemProperty;

  constructor(public readonly propertyName: string, public readonly propertyValue: any) {}
}
