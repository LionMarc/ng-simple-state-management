import { DateTime } from 'luxon';

export const todoItemsKey = 'todo:todo-items';
export const todoItemKey = 'todo:todo-item';

export interface TodoStatus {
  lastUpdate?: DateTime;
  updatedBy?: string;
}

export interface TodoItem {
  id?: number;
  title?: string;
  status?: TodoStatus;
}
