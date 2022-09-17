import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface RemoteDataProvider {
  readonly remoteDataKey: string;
  readonly cacheDurationInSeconds: number;

  get(): Observable<any>;
}

export const NGSSM_REMOTE_DATA_PROVIDER = new InjectionToken<RemoteDataProvider>('NGSSM_REMOTE_DATA_PROVIDER');
