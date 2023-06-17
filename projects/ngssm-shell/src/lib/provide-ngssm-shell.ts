import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { provideEffect, provideReducers } from 'ngssm-store';

import { NavigationBarReducer } from './reducers/navigation-bar.reducer';
import { ShellNotificationsReducer } from './reducers/shell-notifications.reducer';
import { NotificationShowingEffect } from './effects/notification-showing.effect';

export const provideNgssmShell = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideReducers(NavigationBarReducer, ShellNotificationsReducer),
    provideEffect(NotificationShowingEffect)
  ]);
};
