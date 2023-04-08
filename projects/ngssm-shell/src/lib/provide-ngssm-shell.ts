import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { navigationBarReducerProvider } from './reducers/navigation-bar.reducer';
import { shellNotificationsReducerProvider } from './reducers/shell-notifications.reducer';
import { notificationShowingEffectProvider } from './effects/notification-showing.effect';

export const provideNgssmShell = (): EnvironmentProviders => {
  return makeEnvironmentProviders([navigationBarReducerProvider, shellNotificationsReducerProvider, notificationShowingEffectProvider]);
};
