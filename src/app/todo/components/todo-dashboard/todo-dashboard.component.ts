import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { DataStatus, selectRemoteData } from 'ngssm-remote-data';
import { NgSsmComponent, Store } from 'ngssm-store';

import { TodoItem, todoItemsKey } from '../../model';
import { TodoActionType } from '../../actions';

@Component({
  selector: 'app-todo-dashboard',
  templateUrl: './todo-dashboard.component.html',
  styleUrls: ['./todo-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoDashboardComponent extends NgSsmComponent {
  public readonly dataStatus = DataStatus;

  constructor(store: Store) {
    super(store);
  }

  public get status$(): Observable<DataStatus> {
    return this.watch((s) => selectRemoteData(s, todoItemsKey).status);
  }

  public get todoItemIds$(): Observable<number[]> {
    return this.watch((s) => (selectRemoteData(s, todoItemsKey).data ?? []).map((t: TodoItem) => t.id));
  }

  public addTodo(): void {
    this.dispatchActionType(TodoActionType.addTodoItem);
  }
}
