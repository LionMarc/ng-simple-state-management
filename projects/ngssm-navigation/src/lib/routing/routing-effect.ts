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
      untracked(() => routingAction.navigate?.(store.state(), router));
    }
  });

  return true;
};
