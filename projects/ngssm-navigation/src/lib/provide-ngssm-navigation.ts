import { EnvironmentProviders, makeEnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { Router } from '@angular/router';

import { provideReducer } from 'ngssm-store';

import { isNavigationUnLocked } from './guards';
import { NavigationReducer } from './reducers/navigation.reducer';

const initializeNavigation = () => {
  inject(Router).config.forEach((route) => {
    route.canDeactivate = [() => isNavigationUnLocked(), ...(route.canDeactivate ?? [])];
  });
};

export const provideNgssmNavigation = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideReducer(NavigationReducer), provideAppInitializer(initializeNavigation)]);
};
