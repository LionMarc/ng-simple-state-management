import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { selectRemoteData } from 'ngssm-remote-data';
import { createSignal } from 'ngssm-store';

import { todoItemsKey } from '../../model';

@Component({
  selector: 'ngssm-todo-footer',
  imports: [CommonModule],
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFooterComponent {
  public readonly count = createSignal((state) => ((selectRemoteData(state, todoItemsKey)?.data ?? []) as unknown[]).length);
}
