import { effect, inject, untracked } from '@angular/core';

import { EffectFunc, State, Action, Logger, Store } from 'ngssm-store';

import { NgssmDataActionType, NgssmLoadDataSourceValueAction, NgssmSetDataSourceValueAction } from './actions';
import { selectNgssmDataSourceValue } from './selectors';
import { NgssmDataSourceValueStatus } from './model';
import { selectNgssmDataState } from './state';

export const loadDataSourceWithDependencyEffect: EffectFunc = (state: State, action: Action) => {
  const logger = inject(Logger);
  const ngssmLoadDataSourceValueAction = action as NgssmLoadDataSourceValueAction;
  const dataSourceValue = selectNgssmDataSourceValue(state, ngssmLoadDataSourceValueAction.key);

  // We only take into account source with a dependency not already loaded. In that case, the status must not be loading.
  if (dataSourceValue.status === NgssmDataSourceValueStatus.loading) {
    return;
  }

  const dataSource = selectNgssmDataState(state).dataSources[ngssmLoadDataSourceValueAction.key];

  // Should not happen. But, just in case...
  const dependency = dataSource.dependsOnDataSource;
  if (!dependency) {
    logger.error(`Data source ${ngssmLoadDataSourceValueAction.key} depends on no other data source!`);
    return;
  }

  const store = inject(Store);
  store.dispatchAction(new NgssmLoadDataSourceValueAction(dependency));
};

export const dependentDataSourceLoadInitializer = async () => {
  const store = inject(Store);
  const logger = inject(Logger);

  effect(() => {
    const action = store.processedAction();
    if (action.type !== NgssmDataActionType.setDataSourceValue) {
      return;
    }

    const setDataSourceValueAction = action as NgssmSetDataSourceValueAction;
    const state = untracked<State>(() => store.state());

    const storedAction = selectNgssmDataState(state).delayedActions[setDataSourceValueAction.key];
    if (storedAction) {
      logger.information(`Dispatching delayed loading action for source ${(storedAction as NgssmLoadDataSourceValueAction).key}`);
      store.dispatchAction(storedAction);
    }
  });
};
