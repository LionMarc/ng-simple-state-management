import { EnvironmentProviders, makeEnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { Router } from '@angular/router';

import { provideReducer } from 'ngssm-store';

import { isNavigationUnLocked } from './guards';
import { NavigationReducer } from './reducers/navigation.reducer';

function initializeNavigation(router: Router): () => void {
  return () => {
    router.config.forEach((route) => {
      route.canDeactivate = [() => isNavigationUnLocked(), ...(route.canDeactivate ?? [])];
    });
  };
}

export const provideNgssmNavigation = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideReducer(NavigationReducer),
    provideAppInitializer((initializeNavigation)(inject(Router)))
  ]);
};
