import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';

import { Effect, State, Action, Logger, ActionDispatcher } from 'ngssm-store';

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
  private readonly injector = inject(EnvironmentInjector);
  private readonly logger = inject(Logger);

  public readonly processedActions: string[] = [
    NgssmDataActionType.loadDataSourceValue,
    NgssmDataActionType.loadDataSourceAdditionalPropertyValue
  ];

  public processAction(actiondispatcher: ActionDispatcher, state: State, action: Action): void {
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
          dataSource.dataLoadingFunc(state, key, dataSourceValue.parameter).subscribe({
            next: (value) =>
              actiondispatcher.dispatchAction(new NgssmSetDataSourceValueAction(key, NgssmDataSourceValueStatus.loaded, value)),
            error: (error) => {
              this.logger.error(`Unable to load data for '${key}'`, error);
              actiondispatcher.dispatchAction(new NgssmSetDataSourceValueAction(key, NgssmDataSourceValueStatus.error));
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
          dataSource.additionalPropertyLoadingFunc?.(state, key, property).subscribe({
            next: (value) =>
              actiondispatcher.dispatchAction(
                new NgssmSetDataSourceAdditionalPropertyValueAction(
                  key,
                  property,
                  NgssmDataSourceValueStatus.loaded,
                  value,
                  ngssmLoadDataSourceAdditionalPropertyValueAction.postLoadingAction
                )
              ),
            error: (error) => {
              this.logger.error(`Unable to load data for '${key}' and property '${property}'`, error);
              actiondispatcher.dispatchAction(
                new NgssmSetDataSourceAdditionalPropertyValueAction(key, property, NgssmDataSourceValueStatus.error)
              );
            }
          });
        });

        break;
      }
    }
  }
}
