import { TestBed } from '@angular/core/testing';

import { provideNgssmStoreTesting, StoreMock } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';
import { NgssmVisibilityStateSpecification } from 'ngssm-store/visibility';

import { ngssmVisibilityStateInitializer, provideNgssmVisibilityTesting } from './provide-ngssm-visibility-testing';

describe('provideNgssmVisibilityTesting', () => {
    it(`should throw if StoreMock is not registered`, () => {
        TestBed.configureTestingModule({});
        try {
            TestBed.runInInjectionContext(() => ngssmVisibilityStateInitializer());
            expect(true).toBe(false);
        }
        catch (error) {
            expect((error as Error).message).toEqual('StoreMock is not registered.');
        }
    });

    it(`should register the ngssm data state in the mocked state`, () => {
        TestBed.configureTestingModule({
            providers: [provideNgssmStoreTesting(), provideNgssmVisibilityTesting()]
        });

        const store = TestBed.inject(Store) as unknown as StoreMock;
        expect(store.stateValue[NgssmVisibilityStateSpecification.featureStateKey]).toBeTruthy();
    });
});
