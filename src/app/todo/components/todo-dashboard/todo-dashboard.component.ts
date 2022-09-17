import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgSsmComponent, Store } from 'ngssm-store';

@Component({
  selector: 'app-todo-dashboard',
  templateUrl: './todo-dashboard.component.html',
  styleUrls: ['./todo-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoDashboardComponent extends NgSsmComponent {
  constructor(store: Store) { 
    super(store);
  }
}
