import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Store } from 'ngssm-store';
import { InitNgssmTreeAction } from 'ngssm-tree';
import { DataStatus } from 'ngssm-remote-data';

@Injectable({
  providedIn: 'root'
})
export class TreeInitGuard implements CanActivate {
  constructor(private store: Store) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.store.dispatchAction(
      new InitNgssmTreeAction('demo', {
        nodeId: '0',
        label: 'Linux',
        type: 'directory',
        isExpandable: true
      })
    );
    return true;
  }
}
