import { ApplicationInitStatus } from '@angular/core';
import { Router } from '@angular/router';
import { fakeAsync, TestBed } from '@angular/core/testing';

import { provideConsoleAppender, State, Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { provideNgssmNavigation } from './provide-ngssm-navigation';

describe('provideNgssmNavigation', () => {
  let router: Router;
  let store: StoreMock;

  beforeEach(async () => {
    store = new StoreMock({});
    TestBed.configureTestingModule({
      providers: [provideNgssmNavigation(), provideConsoleAppender('test'), { provide: Store, useValue: store }]
    });

    await TestBed.inject(ApplicationInitStatus).donePromise;
    router = TestBed.inject(Router);
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

      store.processedAction.set(action);

      TestBed.tick();

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

      store.processedAction.set(action);

      TestBed.tick();

      expect(router.navigate).not.toHaveBeenCalled();
    }));
  });
});
