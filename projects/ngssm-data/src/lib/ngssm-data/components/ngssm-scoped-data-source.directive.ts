import { Directive, Input, OnDestroy } from '@angular/core';

import { Store } from 'ngssm-store';

import { NgssmDataSource } from '../model';
import { NgssmRegisterDataSourceAction, NgssmUnregisterDataSourceAction } from '../actions';

@Directive({
  selector: '[ngssmScopedDataSource]',
  standalone: true
})
export class NgssmScopedDataSourceDirective implements OnDestroy {
  private _dataSource: NgssmDataSource | undefined;

  constructor(private store: Store) {}

  @Input() set ngssmScopedDataSource(value: NgssmDataSource) {
    if (this._dataSource) {
      throw new Error('Data source is already set.');
    }
    this._dataSource = value;
    this.store.dispatchAction(new NgssmRegisterDataSourceAction(this._dataSource));
  }

  public ngOnDestroy(): void {
    const key = this._dataSource?.key;
    if (key) {
      this.store.dispatchAction(new NgssmUnregisterDataSourceAction(key));
    }
  }
}
