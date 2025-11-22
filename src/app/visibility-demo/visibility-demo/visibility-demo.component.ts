import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Store } from 'ngssm-store';
import {
  DefineElementsGroupAction,
  HideElementDirective,
  IsElementVisiblePipe,
  ShowElementDirective,
  ToggleElementVisibilityDirective,
  VisibilityToggleGroupComponent,
  isElementVisible
} from 'ngssm-store/visibility';

@Component({
  selector: 'ngssm-visibility-demo',
  imports: [
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
export class VisibilityDemoComponent {
  protected store = inject(Store);

  public readonly explorerVisible = isElementVisible('explorer');
  public readonly searchVisible = isElementVisible('search');
  public readonly bugsVisible = isElementVisible('bugs');

  public readonly visibilityItems: { key: string; label: string }[] = [
    { key: 'leftPart', label: 'Left' },
    { key: 'centerPart', label: 'Center' },
    { key: 'rightPart', label: 'Right' }
  ];
  constructor() {
    this.store.dispatchAction(new DefineElementsGroupAction(['explorer', 'search', 'bugs']));
  }
}
