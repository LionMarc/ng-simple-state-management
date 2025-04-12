import { effect, inject, untracked } from '@angular/core';

import { Logger, State, Store } from 'ngssm-store';

import { NgssmSetDataSourceValueAction, NgssmDataActionType, NgssmLoadDataSourceValueAction } from './actions';
import { selectNgssmDataState } from './state';

export const dataSourcesLinkerInitializer = async () => {
  const store = inject(Store);
  const logger = inject(Logger);

  effect(() => {
    const action = store.processedAction();
    if (action.type !== NgssmDataActionType.setDataSourceValue) {
      return;
    }

    const setDataSourceValueAction = action as NgssmSetDataSourceValueAction;
    const state = selectNgssmDataState(untracked<State>(() => store.state())).dataSources;
    for (const linkedKey of Object.keys(state).filter((key) => state[key].linkedToDataSource === setDataSourceValueAction.key)) {
      logger.information(`Force reload of data source'${linkedKey}' linked to '${setDataSourceValueAction.key}'`);
      store.dispatchAction(
        new NgssmLoadDataSourceValueAction(linkedKey, {
          forceReload: true
        })
      );
    }
  });

  return true;
};
