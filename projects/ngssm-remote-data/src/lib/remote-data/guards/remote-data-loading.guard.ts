import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Store } from 'ngssm-store';

import { LoadRemoteDataAction } from '../actions';
import { ReloadParams } from '../model';

export interface RemoteDataLoadingGuardItem {
  remoteDataKey: string;
  forceReload?: boolean;
}

export interface RemoteDataLoadingGuardParameters {
  remoteDataItems: RemoteDataLoadingGuardItem[];
}

@Injectable({
  providedIn: 'root'
})
export class RemoteDataLoadingGuard {
  constructor(private store: Store) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const parameters = route.data as RemoteDataLoadingGuardParameters;
    (parameters?.remoteDataItems ?? []).forEach((item) => {
      this.store.dispatchAction(new LoadRemoteDataAction(item.remoteDataKey, { forceReload: item.forceReload === true }));
    });

    return true;
  }
}

export const ngssmReloadRemoteData = <TData = any>(remoteDataKey: string, params: ReloadParams<TData> = { forceReload: true }): boolean => {
  inject(Store).dispatchAction(new LoadRemoteDataAction(remoteDataKey, params));
  return true;
};
