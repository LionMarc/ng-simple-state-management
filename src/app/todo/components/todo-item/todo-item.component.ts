import { Component, ChangeDetectionStrategy, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';

import { selectRemoteData } from 'ngssm-remote-data';
import { NgSsmComponent, Store } from 'ngssm-store';

import { TodoItem, todoItemsKey } from '../../model';
import { EditTodoItemAction } from '../../actions';
import { selectNgssmDataSourceValue } from 'ngssm-data';

@Component({
  selector: 'app-todo-item',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent extends NgSsmComponent {
  private readonly _todoItemId$ = new Subject<number>();
  public readonly todoItem = signal<TodoItem | undefined>(undefined);

  constructor(store: Store) {
    super(store);

    combineLatest([this._todoItemId$, this.watch((s) => selectNgssmDataSourceValue<TodoItem[]>(s, todoItemsKey)?.value)]).subscribe(
      (values) => {
        this.todoItem.set((values[1] ?? []).find((t: TodoItem) => t.id === values[0]));
      }
    );
  }

  @Input()
  public set todoId(value: number) {
    this._todoItemId$.next(value);
  }

  public editTodoItem(id: number): void {
    this.dispatchAction(new EditTodoItemAction(id));
  }
}
