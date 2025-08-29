import { effect, inject, untracked } from '@angular/core';

import { EffectFunc, State, Action, Logger, Store } from 'ngssm-store';

import { NgssmDataActionType, NgssmLoadDataSourceValueAction, NgssmSetDataSourceValueAction } from './actions';
import { selectNgssmDataSourceValue } from './selectors';
import { NgssmDataSourceValueStatus } from './model';
import { selectNgssmDataState } from './state';

/**
 * Effect function that handles loading a data source with a dependency.
 *
 * This effect checks if the requested data source has a dependency that is not yet loaded.
 * If the data source is not currently loading and has a dependency, it dispatches an action
 * to load the dependency data source first. If the data source does not have a dependency,
 * it logs an error message.
 *
 * @param state - The current application state.
 * @param action - The action triggering the effect, expected to be of type NgssmLoadDataSourceValueAction.
 * @returns void
 */
export const loadDataSourceWithDependencyEffect: EffectFunc = (state: State, action: Action) => {
  const ngssmLoadDataSourceValueAction = action as NgssmLoadDataSourceValueAction;
  const dataSourceValue = selectNgssmDataSourceValue(state, ngssmLoadDataSourceValueAction.key);

  // We only take into account source with a dependency not already loaded. In that case, the status must not be loading.
  if (dataSourceValue.status === NgssmDataSourceValueStatus.loading) {
    return;
  }

  const dataSource = selectNgssmDataState(state).dataSources[ngssmLoadDataSourceValueAction.key];

  const dependency = dataSource.dependsOnDataSource;
  if (!dependency) {
    // Date source is already loaded and has no dependency.
    // This is the usual case with data source with a lifetime not null and reloaded without being forced when a page is opened.
    return;
  }

  const store = inject(Store);
  store.dispatchAction(new NgssmLoadDataSourceValueAction(dependency));
};

/**
 * Effect initializer that listens for NgssmSetDataSourceValueAction and dispatches any delayed loading actions
 * for dependent data sources. This ensures that when a data source is set, any queued actions for sources
 * waiting on this dependency are executed.
 */
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
