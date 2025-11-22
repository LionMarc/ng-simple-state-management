import { Component, ChangeDetectionStrategy } from '@angular/core';


import { selectNgssmDataSourceValue } from 'ngssm-data';
import { createSignal } from 'ngssm-store';

import { TodoItem, todoItemsKey } from '../../model';

@Component({
  selector: 'ngssm-todo-count',
  imports: [],
  templateUrl: './todo-count.component.html',
  styleUrls: ['./todo-count.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoCountComponent {
  public readonly count = createSignal<number>((s) => (selectNgssmDataSourceValue<TodoItem[]>(s, todoItemsKey)?.value ?? []).length);
}
