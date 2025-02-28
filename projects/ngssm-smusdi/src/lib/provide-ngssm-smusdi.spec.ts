import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { NgssmLoadDataSourceValueAction } from 'ngssm-data';
import { StoreMock } from 'ngssm-store/testing';

import { provideNgssmSmusdi } from './provide-ngssm-smusdi';

describe('provideNgssmSmusdi', () => {
  let store: StoreMock;

  beforeEach(async () => {
    store = new StoreMock({});
    spyOn(store, 'dispatchAction');
    TestBed.configureTestingModule({
      providers: [provideNgssmSmusdi('my-service'), { provide: Store, useValue: store }]
    });

    await TestBed.get(ApplicationInitStatus).donePromise;
  });

  it(`should dispatch an action to load the service info`, () => {
    expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmLoadDataSourceValueAction('service-info', { forceReload: true }));
  });
});
