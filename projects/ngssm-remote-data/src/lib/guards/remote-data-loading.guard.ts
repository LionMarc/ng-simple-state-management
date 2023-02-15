import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Store } from 'ngssm-store';

import { LoadRemoteDataAction } from '../actions';

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
export class RemoteDataLoadingGuard implements CanActivate {
  constructor(private store: Store) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const parameters = route.data as RemoteDataLoadingGuardParameters;
    (parameters?.remoteDataItems ?? []).forEach((item) => {
      this.store.dispatchAction(new LoadRemoteDataAction(item.remoteDataKey, { forceReload: item.forceReload === true }));
    });

    return true;
  }
}
