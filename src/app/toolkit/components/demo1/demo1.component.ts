import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSsmComponent, Store } from 'ngssm-store';

@Component({
  selector: 'app-demo1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Demo1Component extends NgSsmComponent {
  constructor(store: Store) {
    super(store);
  }
}
