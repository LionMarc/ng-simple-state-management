import { Component, booleanAttribute, input, inject } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';

import { Store } from 'ngssm-store';

import { NgssmIsElementVisiblePipe } from '../ngssm-is-element-visible.pipe';
import { NgssmToggleElementVisibility } from '../ngssm-toggle-element-visibility';

@Component({
  selector: 'ngssm-visibility-toggle-group',
  imports: [MatButtonToggleGroup, MatButtonToggle, NgssmToggleElementVisibility, NgssmIsElementVisiblePipe],
  templateUrl: './ngssm-visibility-toggle-group.html'
})
export class NgssmVisibilityToggleGroup {
  public readonly items = input<{ label: string; key: string }[]>([]);
  public readonly hideMultipleSelectionIndicator = input<boolean, boolean>(false, { transform: booleanAttribute });

  protected readonly store = inject(Store);
}
