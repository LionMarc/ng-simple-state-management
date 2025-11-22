import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { Store } from 'ngssm-store';
import {
  DefineElementsGroupAction,
  isElementVisible,
  NgssmToggleElementVisibility,
  NgssmHideElement,
  NgssmShowElement,
  NgssmVisibilityToggleGroup,
  NgssmIsElementVisiblePipe
} from 'ngssm-store/visibility';

@Component({
  selector: 'ngssm-visibility-demo',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    MatButton,
    NgssmToggleElementVisibility,
    NgssmHideElement,
    NgssmShowElement,
    NgssmVisibilityToggleGroup,
    NgssmIsElementVisiblePipe
  ],
  templateUrl: './visibility-demo.component.html',
  styleUrls: ['./visibility-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisibilityDemoComponent {
  protected store = inject(Store);

  protected readonly explorerVisible = isElementVisible('explorer');
  protected readonly searchVisible = isElementVisible('search');
  protected readonly bugsVisible = isElementVisible('bugs');

  protected readonly visibilityItems: { key: string; label: string }[] = [
    { key: 'leftPart', label: 'Left' },
    { key: 'centerPart', label: 'Center' },
    { key: 'rightPart', label: 'Right' }
  ];

  constructor() {
    this.store.dispatchAction(new DefineElementsGroupAction(['explorer', 'search', 'bugs']));
  }
}
