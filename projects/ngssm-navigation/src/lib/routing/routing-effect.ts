import { effect, inject, untracked } from '@angular/core';
import { Router } from '@angular/router';

import { Logger, Store } from 'ngssm-store';

import { RoutingAction } from './routing-action';

export const routingEffectInitializer = async () => {
  const store = inject(Store);
  const router = inject(Router);
  const logger = inject(Logger);

  effect(() => {
    const action = store.processedAction();
    const routingAction = action as RoutingAction;
    if (routingAction.navigate) {
      logger.information(`[Routing Effect] Processing action ${action.type}`);
      try {
        untracked(() => routingAction.navigate?.(store.state(), router));
        logger.information(`[Routing Effect] Successfully navigated for action ${action.type}`);
      } catch (error) {
        logger.error(`[Routing Effect] Error while processing action ${action.type}: ${error}`);
      }
    }
  });

  return true;
};
