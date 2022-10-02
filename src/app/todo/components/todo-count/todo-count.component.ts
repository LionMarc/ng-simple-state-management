import { Component, ChangeDetectionStrategy } from '@angular/core';
import { selectRemoteData } from 'ngssm-remote-data';

import { NgSsmComponent, Store } from 'ngssm-store';
import { Observable } from 'rxjs';
import { todoItemsKey } from '../../model';

@Component({
  selector: 'app-todo-count',
  templateUrl: './todo-count.component.html',
  styleUrls: ['./todo-count.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoCountComponent extends NgSsmComponent {
  constructor(store: Store) {
    super(store);
  }

  public get count$(): Observable<number> {
    return this.watch((s) => ((selectRemoteData(s, todoItemsKey).data ?? []) as any[]).length);
  }
}
