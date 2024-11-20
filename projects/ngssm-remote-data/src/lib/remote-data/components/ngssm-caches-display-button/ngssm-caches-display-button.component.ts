import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NgSsmComponent, Store } from 'ngssm-store';

import { RemoteDataActionType } from '../../actions';

@Component({
    selector: 'ngssm-caches-display-button',
    imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
    templateUrl: './ngssm-caches-display-button.component.html',
    styleUrls: ['./ngssm-caches-display-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmCachesDisplayButtonComponent extends NgSsmComponent {
  constructor(store: Store) {
    super(store);
  }

  public displayCaches(): void {
    this.dispatchActionType(RemoteDataActionType.displayCaches);
  }
}
