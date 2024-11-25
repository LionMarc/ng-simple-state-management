import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { selectRemoteData } from 'ngssm-remote-data';
import { NgSsmComponent, Store } from 'ngssm-store';

import { todoItemsKey } from '../../model';

@Component({
  selector: 'app-todo-footer',
  imports: [CommonModule],
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFooterComponent extends NgSsmComponent {
  constructor(store: Store) {
    super(store);
  }

  public get count$(): Observable<number> {
    return this.watch((s) => ((selectRemoteData(s, todoItemsKey)?.data ?? []) as any[]).length);
  }
}
