import { EnvironmentInjector, Injectable, runInInjectionContext } from '@angular/core';

import { Effect, Store, State, Action, Logger } from 'ngssm-store';

import { NgssmDataActionType, NgssmDataSourceValueAction, NgssmSetDataSourceValueAction } from '../actions';
import { selectNgssmDataState } from '../state';
import { NgssmDataSourceValueStatus } from '../model';

@Injectable()
export class DataLoadingEffect implements Effect {
  public readonly processedActions: string[] = [NgssmDataActionType.loadDataSourceValue];

  constructor(
    private logger: Logger,
    private injector: EnvironmentInjector
  ) {}

  public processAction(store: Store, state: State, action: Action): void {
    if (action.type === NgssmDataActionType.loadDataSourceValue) {
      const key = (action as NgssmDataSourceValueAction).key;
      const dataSource = selectNgssmDataState(state).dataSources[key];
      if (!dataSource) {
        this.logger.error(`No data source setup for key '${key}'`);
        return;
      }

      const dataSourceValue = selectNgssmDataState(state).dataSourceValues[key];
      if (dataSourceValue?.status !== NgssmDataSourceValueStatus.loading) {
        this.logger.information(
          `Data source value for '${key}' is not in '${NgssmDataSourceValueStatus.loading}' status: '${dataSourceValue?.status}'`
        );
        return;
      }

      runInInjectionContext(this.injector, () => {
        dataSource.dataLoadingFunc(state, dataSourceValue.parameter).subscribe({
          next: (value) => store.dispatchAction(new NgssmSetDataSourceValueAction(key, NgssmDataSourceValueStatus.loaded, value)),
          error: (error) => {
            this.logger.error(`Unable to load data for '${key}'`, error);
            store.dispatchAction(new NgssmSetDataSourceValueAction(key, NgssmDataSourceValueStatus.error));
          }
        });
      });
    }
  }
}
