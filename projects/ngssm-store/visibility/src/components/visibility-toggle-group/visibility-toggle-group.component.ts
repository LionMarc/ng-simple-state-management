import { Component, ChangeDetectionStrategy, Input, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { NgSsmComponent, Store } from 'ngssm-store';

import { ToggleElementVisibilityDirective } from '../toggle-element-visibility.directive';
import { IsElementVisiblePipe } from '../is-element-visible.pipe';

@Component({
    selector: 'ngssm-visibility-toggle-group',
    imports: [CommonModule, MatButtonToggleModule, ToggleElementVisibilityDirective, IsElementVisiblePipe],
    templateUrl: './visibility-toggle-group.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisibilityToggleGroupComponent extends NgSsmComponent {
  @Input() public items: { label: string; key: string }[] = [];
  @Input({ transform: booleanAttribute }) hideMultipleSelectionIndicator = false;

  constructor(store: Store) {
    super(store);
  }
}
