import { Component, ChangeDetectionStrategy, booleanAttribute, input, inject } from '@angular/core';

import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { Store } from 'ngssm-store';

import { ToggleElementVisibilityDirective } from '../toggle-element-visibility.directive';
import { IsElementVisiblePipe } from '../is-element-visible.pipe';

@Component({
  selector: 'ngssm-visibility-toggle-group',
  imports: [MatButtonToggleModule, ToggleElementVisibilityDirective, IsElementVisiblePipe],
  templateUrl: './visibility-toggle-group.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisibilityToggleGroupComponent {
  public readonly store = inject(Store);

  public readonly items = input<{ label: string; key: string }[]>([]);
  public readonly hideMultipleSelectionIndicator = input<boolean, boolean>(false, { transform: booleanAttribute });
}
