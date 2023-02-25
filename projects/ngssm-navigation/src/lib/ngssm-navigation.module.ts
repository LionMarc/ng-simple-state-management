import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Router } from '@angular/router';

import { isNavigationUnLocked } from './guards';
import { navigationReducerProvider } from './reducers/navigation.reducer';

function initializeNavigation(router: Router): () => void {
  return () => {
    router.config.forEach((route) => {
      route.canDeactivate = [() => isNavigationUnLocked(), ...(route.canDeactivate ?? [])];
    });
  };
}

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [
    navigationReducerProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeNavigation,
      deps: [Router],
      multi: true
    }
  ]
})
export class NgssmNavigationModule {}
