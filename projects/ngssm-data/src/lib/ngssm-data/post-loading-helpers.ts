import { Injector, effect, inject, runInInjectionContext } from '@angular/core';

import { Store } from 'ngssm-store';

import { NgssmDataSourceValueStatus } from './model';
import { NgssmDataActionType, NgssmSetDataSourceValueAction } from './actions';

/**
 * Creates a runner function that executes a post-loading action when the specified data source's value is set.
 * The runner listens for NgssmSetDataSourceValueAction for the given dataSourceKey and invokes the provided postLoadingAction
 * with the new status. The effect is automatically destroyed after the action is processed.
 *
 * @param dataSourceKey The key of the data source to monitor.
 * @param postLoadingAction A callback to execute with the new NgssmDataSourceValueStatus. It is called in an injection context.
 * @returns A function that, when called, sets up the effect and runner.
 */
export const postNgssmDataSourceLoadingActionRunnerBuilder = (
  dataSourceKey: string,
  postLoadingAction: (status: NgssmDataSourceValueStatus) => void
): (() => void) => {
  const injector = inject(Injector);
  return () => {
    runInInjectionContext(injector, () => {
      const store = inject(Store);
      const effectRef = effect(() => {
        const action = store.processedAction();
        if (action.type === NgssmDataActionType.setDataSourceValue) {
          const typedAction = action as NgssmSetDataSourceValueAction;
          if (typedAction.key === dataSourceKey) {
            runInInjectionContext(injector, () => postLoadingAction(typedAction.status));
            effectRef.destroy();
          }
        }
      });
    });
  };
};
