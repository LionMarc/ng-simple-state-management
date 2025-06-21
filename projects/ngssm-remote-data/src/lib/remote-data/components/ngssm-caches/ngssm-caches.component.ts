import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createSignal, Store } from 'ngssm-store';

import { RemoteDataActionType, LoadRemoteDataAction } from '../../actions';
import { DataStatus, RemoteData } from '../../model';
import { selectRemoteDataState } from '../../state';

interface Cache {
  key: string;
  value: RemoteData;
}

@Component({
  selector: 'ngssm-caches',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './ngssm-caches.component.html',
  styleUrls: ['./ngssm-caches.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmCachesComponent {
  private readonly store = inject(Store);

  public readonly caches = createSignal<Cache[]>((state) => {
    const remoteDataState = selectRemoteDataState(state);
    return Object.keys(remoteDataState).map((key) => ({
      key,
      value: remoteDataState[key]
    }));
  });

  public readonly dataStatus = DataStatus;

  public close(): void {
    this.store.dispatchActionType(RemoteDataActionType.closeCachesComponent);
  }

  public reloadCache(cache: Cache): void {
    this.store.dispatchAction(new LoadRemoteDataAction(cache.key, { forceReload: true, keepStoredGetterParams: true }));
  }
}
