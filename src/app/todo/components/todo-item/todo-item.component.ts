import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Store } from 'ngssm-store';
import { dataSourceToSignal } from 'ngssm-data';

import { TodoItem, todoItemsKey } from '../../model';
import { EditTodoItemAction } from '../../actions';

@Component({
  selector: 'ngssm-todo-item',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
  private readonly store = inject(Store);

  private readonly todoItems = dataSourceToSignal<TodoItem[]>(todoItemsKey, { defaultValue: [] });

  public readonly todoId = input<number>(0);

  public readonly todoItem = computed<TodoItem | undefined>(() => {
    return this.todoItems.value().find((t) => t.id === this.todoId());
  });

  public editTodoItem(id: number): void {
    this.store.dispatchAction(new EditTodoItemAction(id));
  }
}
