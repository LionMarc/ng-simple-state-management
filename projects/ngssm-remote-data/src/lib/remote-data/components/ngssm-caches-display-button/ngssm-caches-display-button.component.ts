import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Store } from 'ngssm-store';

import { RemoteDataActionType } from '../../actions';

@Component({
  selector: 'ngssm-caches-display-button',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './ngssm-caches-display-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmCachesDisplayButtonComponent {
  private readonly store = inject(Store);

  public displayCaches(): void {
    this.store.dispatchActionType(RemoteDataActionType.displayCaches);
  }
}
