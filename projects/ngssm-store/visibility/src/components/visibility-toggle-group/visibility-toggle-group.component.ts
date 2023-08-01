import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { NgSsmComponent, Store } from 'ngssm-store';

import { ToggleElementVisibilityDirective } from '../toggle-element-visibility.directive';
import { IsElementVisiblePipe } from '../is-element-visible.pipe';

@Component({
  selector: 'ngssm-visibility-toggle-group',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, ToggleElementVisibilityDirective, IsElementVisiblePipe],
  templateUrl: './visibility-toggle-group.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisibilityToggleGroupComponent extends NgSsmComponent {
  @Input() public items: { label: string; key: string }[] = [];

  constructor(store: Store) {
    super(store);
  }
}
