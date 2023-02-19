import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoteDataGetterParams } from './remote-data-getter-params';

export interface RemoteDataProvider<TData = any, TValue = any> {
  readonly remoteDataKey: string;
  readonly cacheDurationInSeconds?: number;

  get(params?: RemoteDataGetterParams<TValue>): Observable<TData>;
}

export const NGSSM_REMOTE_DATA_PROVIDER = new InjectionToken<RemoteDataProvider>('NGSSM_REMOTE_DATA_PROVIDER');
