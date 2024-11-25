import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { selectRemoteData } from 'ngssm-remote-data';
import { NgSsmComponent, Store } from 'ngssm-store';

import { todoItemsKey } from '../../model';

@Component({
  selector: 'app-todo-count',
  imports: [CommonModule],
  templateUrl: './todo-count.component.html',
  styleUrls: ['./todo-count.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoCountComponent extends NgSsmComponent {
  constructor(store: Store) {
    super(store);
  }

  public get count$(): Observable<number> {
    return this.watch((s) => ((selectRemoteData(s, todoItemsKey)?.data ?? []) as any[]).length);
  }
}
