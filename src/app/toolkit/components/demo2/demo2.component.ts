import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSsmComponent, Store } from 'ngssm-store';

@Component({
  selector: 'app-demo2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demo2.component.html',
  styleUrls: ['./demo2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Demo2Component extends NgSsmComponent {
  constructor(store: Store) {
    super(store);
  }
}
