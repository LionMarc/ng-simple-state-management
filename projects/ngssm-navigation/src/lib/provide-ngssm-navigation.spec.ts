import { ApplicationInitStatus } from '@angular/core';
import { Router } from '@angular/router';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { provideConsoleAppender, State, Store } from 'ngssm-store';

import { provideNgssmNavigation } from './provide-ngssm-navigation';

describe('provideNgssmNavigation', () => {
  let router: Router;
  let store: Store;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideNgssmNavigation(), provideConsoleAppender('test')]
    });

    await TestBed.inject(ApplicationInitStatus).donePromise;
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
  });

  describe(`routing effect`, () => {
    it(`should execute the navigate method of the action when action is of type RoutingAction`, fakeAsync(() => {
      spyOn(router, 'navigate');
      const action = {
        type: 'ROUTING_ACTION',
        navigate: (state: State, router: Router) => {
          router.navigate(['test']);
        }
      };

      store.dispatchAction(action);

      tick(100);

      TestBed.flushEffects();

      expect(router.navigate).toHaveBeenCalledWith(['test']);
    }));

    it(`should do nothing when action is not of type RoutingAction`, fakeAsync(() => {
      spyOn(router, 'navigate');
      const action = {
        type: 'NOT_ROUTING_ACTION',
        navigateWrong: (state: State, router: Router) => {
          router.navigate(['test']);
        }
      };

      store.dispatchAction(action);

      tick(100);

      TestBed.flushEffects();

      expect(router.navigate).not.toHaveBeenCalled();
    }));
  });
});
