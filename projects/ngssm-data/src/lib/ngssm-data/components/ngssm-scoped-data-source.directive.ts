import { Directive, inject, Input, OnDestroy } from '@angular/core';

import { ACTION_DISPATCHER, ActionDispatcher } from 'ngssm-store';

import { NgssmDataSource } from '../model';
import { NgssmRegisterDataSourceAction, NgssmUnregisterDataSourceAction } from '../actions';

@Directive({
  selector: '[ngssmScopedDataSource]',
  standalone: true
})
export class NgssmScopedDataSourceDirective implements OnDestroy {
  private readonly actionDispatcher: ActionDispatcher = inject(ACTION_DISPATCHER);
  private _dataSource: NgssmDataSource | undefined;

  @Input() set ngssmScopedDataSource(value: NgssmDataSource) {
    if (this._dataSource) {
      throw new Error('Data source is already set.');
    }
    this._dataSource = value;
    this.actionDispatcher.dispatchAction(new NgssmRegisterDataSourceAction(this._dataSource));
  }

  public ngOnDestroy(): void {
    const key = this._dataSource?.key;
    if (key) {
      this.actionDispatcher.dispatchAction(new NgssmUnregisterDataSourceAction(key));
    }
  }
}
