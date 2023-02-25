import { Injectable } from '@angular/core';

import { Store } from 'ngssm-store';
import { InitNgssmTreeAction } from 'ngssm-tree';

@Injectable({
  providedIn: 'root'
})
export class TreeInitGuard {
  constructor(private store: Store) {}

  public canActivate(): boolean {
    this.store.dispatchAction(
      new InitNgssmTreeAction('demo', 'DemoType', {
        nodeId: '0',
        label: 'Linux',
        type: 'directory',
        isExpandable: true
      })
    );
    return true;
  }
}
