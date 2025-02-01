import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NgSsmComponent, Store } from 'ngssm-store';
import {
  DefineElementsGroupAction,
  HideElementDirective,
  IsElementVisiblePipe,
  ShowElementDirective,
  ToggleElementVisibilityDirective,
  VisibilityToggleGroupComponent
} from 'ngssm-store/visibility';

@Component({
  selector: 'ngssm-visibility-demo',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ToggleElementVisibilityDirective,
    IsElementVisiblePipe,
    ShowElementDirective,
    HideElementDirective,
    VisibilityToggleGroupComponent
  ],
  templateUrl: './visibility-demo.component.html',
  styleUrls: ['./visibility-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisibilityDemoComponent extends NgSsmComponent {
  public readonly visibilityItems: { key: string; label: string }[] = [
    { key: 'leftPart', label: 'Left' },
    { key: 'centerPart', label: 'Center' },
    { key: 'rightPart', label: 'Right' }
  ];
  constructor(store: Store) {
    super(store);

    this.dispatchAction(new DefineElementsGroupAction(['explorer', 'search', 'bugs']));
  }
}
