import { TodoItem } from '../model';

export interface TodoItemEditor {
  todoItemId?: number;
  todoItem: TodoItem;
  submissionInProgress: boolean;
}

export const getDefaultTodoItemEditor = (): TodoItemEditor => ({
  todoItem: {},
  submissionInProgress: false
});
