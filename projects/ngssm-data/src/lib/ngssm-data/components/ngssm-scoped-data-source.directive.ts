import { Directive, effect, inject, input, OnDestroy } from '@angular/core';

import { ACTION_DISPATCHER, ActionDispatcher } from 'ngssm-store';

import { NgssmDataSource } from '../model';
import { NgssmRegisterDataSourceAction, NgssmUnregisterDataSourceAction } from '../actions';

@Directive({
  selector: '[ngssmScopedDataSource]'
})
export class NgssmScopedDataSourceDirective implements OnDestroy {
  private readonly actionDispatcher: ActionDispatcher = inject(ACTION_DISPATCHER);
  private isInitialized = false;

  public readonly ngssmScopedDataSource = input.required<NgssmDataSource, NgssmDataSource>({
    transform: this.checkDataSoruce
  });

  constructor() {
    effect(() => {
      const dataSource = this.ngssmScopedDataSource();
      this.actionDispatcher.dispatchAction(new NgssmRegisterDataSourceAction(dataSource));
    });
  }

  public ngOnDestroy(): void {
    const key = this.ngssmScopedDataSource().key;
    if (key) {
      this.actionDispatcher.dispatchAction(new NgssmUnregisterDataSourceAction(key));
    }
  }

  private checkDataSoruce(value: NgssmDataSource): NgssmDataSource {
    if (this.isInitialized) {
      throw new Error('Data source is already set.');
    }

    this.isInitialized = true;

    return value;
  }
}
