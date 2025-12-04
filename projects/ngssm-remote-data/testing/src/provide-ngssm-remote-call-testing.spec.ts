import { TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { provideNgssmStoreTesting, StoreMock } from 'ngssm-store/testing';
import { NgssmRemoteCallStateSpecification, provideNgssmRemoteCallConfig, RemoteCallStatus, selectRemoteCall } from 'ngssm-remote-data';

import { ngssmRemoteCallStateAndRemoteCallsInitializer, provideNgssmRemoteCallTesting } from './provide-ngssm-remote-call-testing';

describe('provideNgssmRemoteCallTesting', () => {
    it(`should throw if StoreMock is not registered`, () => {
        TestBed.configureTestingModule({});
        try {
            TestBed.runInInjectionContext(() => ngssmRemoteCallStateAndRemoteCallsInitializer());
            expect(true).toBe(false);
        }
        catch (error) {
            expect((error as Error).message).toEqual('StoreMock is not registered.');
        }
    });

    it(`should register the ngssm remote call state in the mocked state`, () => {
        TestBed.configureTestingModule({
            providers: [provideNgssmStoreTesting(), provideNgssmRemoteCallTesting()]
        });

        const store = TestBed.inject(Store) as unknown as StoreMock;
        expect(store.stateValue[NgssmRemoteCallStateSpecification.featureStateKey]).toBeTruthy();
    });

    it(`should initialize the ngssm remote calls in the mocked state`, () => {
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

        const store = TestBed.inject(Store) as unknown as StoreMock;
        expect(selectRemoteCall(store.stateValue, 'first').status).toEqual(RemoteCallStatus.none);
        expect(selectRemoteCall(store.stateValue, 'second').status).toEqual(RemoteCallStatus.none);
    });
});
