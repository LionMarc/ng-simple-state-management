import { effect, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';

import { Logger, Store } from 'ngssm-store';

import {
  NgssmDataActionType,
  NgssmLoadDataSourceAdditionalPropertyValueAction,
  NgssmSetDataSourceAdditionalPropertyValueAction
} from './actions';
import { NgssmDataSourceValueStatus } from './model';
import { selectNgssmDataSourceAdditionalPropertyValue } from './selectors';

export const postLoadingActionExecutorInitializer = async () => {
  const injector = inject(EnvironmentInjector);
  const store = inject(Store);
  const logger = inject(Logger);

  effect(() => {
    const action = store.processedAction();
    if (action.type === NgssmDataActionType.loadDataSourceAdditionalPropertyValue) {
      const ngssmLoadDataSourceAdditionalPropertyValueAction = action as NgssmLoadDataSourceAdditionalPropertyValueAction;
      if (!ngssmLoadDataSourceAdditionalPropertyValueAction.postLoadingAction) {
        return;
      }

      const isLoaded =
        selectNgssmDataSourceAdditionalPropertyValue(
          store.state(),
          ngssmLoadDataSourceAdditionalPropertyValueAction.key,
          ngssmLoadDataSourceAdditionalPropertyValueAction.property
        )?.status === NgssmDataSourceValueStatus.loaded;

      if (isLoaded) {
        logger.information(`[postLoadingActionExecutor] Executing post loading action for ${action.type}`);
        runInInjectionContext(injector, ngssmLoadDataSourceAdditionalPropertyValueAction.postLoadingAction);
      }

      return;
    }

    if (action.type === NgssmDataActionType.setDataSourceAdditionalPropertyValue) {
      const ngssmSetDataSourceAdditionalPropertyValueAction = action as NgssmSetDataSourceAdditionalPropertyValueAction;
      if (!ngssmSetDataSourceAdditionalPropertyValueAction.postLoadingAction) {
        return;
      }

      logger.information(`[postLoadingActionExecutor] Executing post loading action for ${action.type}`);
      runInInjectionContext(injector, ngssmSetDataSourceAdditionalPropertyValueAction.postLoadingAction);
    }
  });

  return true;
};
