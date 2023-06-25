import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NgSsmComponent, Store } from 'ngssm-store';
import {
  DefineElementsGroupAction,
  HideElementDirective,
  IsElementVisiblePipe,
  ShowElementDirective,
  ToggleElementVisibilityDirective
} from 'ngssm-store/visibility';

@Component({
  selector: 'app-visibility-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    ToggleElementVisibilityDirective,
    IsElementVisiblePipe,
    ShowElementDirective,
    HideElementDirective
  ],
  templateUrl: './visibility-demo.component.html',
  styleUrls: ['./visibility-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisibilityDemoComponent extends NgSsmComponent {
  constructor(store: Store) {
    super(store);

    this.dispatchAction(new DefineElementsGroupAction(['explorer', 'search', 'bugs']));
  }
}
