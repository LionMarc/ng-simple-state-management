import { EnvironmentInjector, Injectable, runInInjectionContext } from '@angular/core';

import { Effect, Store, State, Action, Logger } from 'ngssm-store';

import {
  NgssmDataActionType,
  NgssmDataSourceValueAction,
  NgssmLoadDataSourceAdditionalPropertyValueAction,
  NgssmSetDataSourceAdditionalPropertyValueAction,
  NgssmSetDataSourceValueAction
} from '../actions';
import { selectNgssmDataState } from '../state';
import { NgssmDataSourceValueStatus } from '../model';

@Injectable()
export class DataLoadingEffect implements Effect {
  public readonly processedActions: string[] = [
    NgssmDataActionType.loadDataSourceValue,
    NgssmDataActionType.loadDataSourceAdditionalPropertyValue
  ];

  constructor(
    private logger: Logger,
    private injector: EnvironmentInjector
  ) {}

  public processAction(store: Store, state: State, action: Action): void {
    const key = (action as NgssmDataSourceValueAction).key;
    const dataSource = selectNgssmDataState(state).dataSources[key];
    if (!dataSource) {
      this.logger.error(`No data source setup for key '${key}'`);
      return;
    }

    const dataSourceValue = selectNgssmDataState(state).dataSourceValues[key];

    switch (action.type) {
      case NgssmDataActionType.loadDataSourceValue: {
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

        break;
      }

      case NgssmDataActionType.loadDataSourceAdditionalPropertyValue: {
        const ngssmLoadDataSourceAdditionalPropertyValueAction = action as NgssmLoadDataSourceAdditionalPropertyValueAction;
        const property = ngssmLoadDataSourceAdditionalPropertyValueAction.property;
        if (dataSourceValue.additionalProperties[property]?.status !== NgssmDataSourceValueStatus.loading) {
          this.logger.information(
            `Data source additional property value for '${key}' and property '${property}' is not in '${NgssmDataSourceValueStatus.loading}' status: '${dataSourceValue?.status}'`
          );
          return;
        }

        runInInjectionContext(this.injector, () => {
          dataSource.dataLoadingFunc(state, dataSourceValue.parameter, property).subscribe({
            next: (value) =>
              store.dispatchAction(
                new NgssmSetDataSourceAdditionalPropertyValueAction(key, property, NgssmDataSourceValueStatus.loaded, value)
              ),
            error: (error) => {
              this.logger.error(`Unable to load data for '${key}' and property '${property}'`, error);
              store.dispatchAction(new NgssmSetDataSourceAdditionalPropertyValueAction(key, property, NgssmDataSourceValueStatus.error));
            }
          });
        });

        break;
      }
    }
  }
}
