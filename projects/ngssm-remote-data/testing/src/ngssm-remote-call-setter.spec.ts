import { TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { provideNgssmStoreTesting } from 'ngssm-store/testing';
import { provideNgssmRemoteCallConfig, RemoteCallStatus, selectRemoteCall } from 'ngssm-remote-data';

import { provideNgssmRemoteCallTesting } from './provide-ngssm-remote-call-testing';
import { NgssmRemoteCallSetter } from './ngssm-remote-call-setter';

describe('NgssmRemoteCallSetter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNgssmStoreTesting(),
        provideNgssmRemoteCallTesting(),
        provideNgssmRemoteCallConfig({
          id: 'first',
          triggeredActionTypes: [],
          resultActionTypes: []
        }),
        provideNgssmRemoteCallConfig({
          id: 'second',
          triggeredActionTypes: [],
          resultActionTypes: []
        })
      ]
    });
  });

  it(`should update the status of a remote call`, () => {
    const setter = TestBed.inject(NgssmRemoteCallSetter);
    setter.setRemoteCallStatus('first', RemoteCallStatus.inProgress);

    const store = TestBed.inject(Store);
    expect(selectRemoteCall(store.state(), 'first')?.status).toEqual(RemoteCallStatus.inProgress);
  });

  it(`should update the error of a data source`, () => {
    const setter = TestBed.inject(NgssmRemoteCallSetter);
    setter.setRemoteCallError('first', { title: 'testing error' });

    const store = TestBed.inject(Store);
    expect(selectRemoteCall(store.state(), 'first')?.error).toEqual({ title: 'testing error' });
  });
});
