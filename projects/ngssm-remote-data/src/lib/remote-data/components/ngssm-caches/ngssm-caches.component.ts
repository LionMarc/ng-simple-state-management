import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

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
export class NgssmCachesComponent extends NgSsmComponent {
  private readonly _caches$ = new BehaviorSubject<Cache[]>([]);

  public readonly dataStatus = DataStatus;

  constructor(store: Store) {
    super(store);

    this.watch((s) => selectRemoteDataState(s)).subscribe((state) => {
      const caches: Cache[] = Object.keys(state).map((key) => ({
        key,
        value: state[key]
      }));
      this._caches$.next(caches);
    });
  }

  public get caches$(): Observable<Cache[]> {
    return this._caches$.asObservable();
  }

  public close(): void {
    this.dispatchActionType(RemoteDataActionType.closeCachesComponent);
  }

  public reloadCache(cache: Cache): void {
    this.dispatchAction(new LoadRemoteDataAction(cache.key, { forceReload: true, keepStoredGetterParams: true }));
  }
}
