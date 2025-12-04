import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { Store } from 'ngssm-store';
import { NgssmDataLoading, NgssmDataSourceValueStatus, provideNgssmDataSource, selectNgssmDataSourceValue } from 'ngssm-data';
import { provideNgssmStoreTesting } from 'ngssm-store/testing';

import { provideNgssmDataTesting } from './provide-ngssm-data-testing';
import { NgssmDataSourceValueSetter } from './ngssm-data-source-value-setter';

describe('NgssmDataSourceValueSetter', () => {
    beforeEach(() => {
        const firstSourceLoading: NgssmDataLoading = (): Observable<string[]> => {
            return of([]);
        };
        const secondSourceLoading: NgssmDataLoading = (): Observable<string[]> => {
            return of([]);
        };

        TestBed.configureTestingModule({
            providers: [
                provideNgssmStoreTesting(),
                provideNgssmDataTesting(),
                provideNgssmDataSource('first', firstSourceLoading, { dataLifetimeInSeconds: 560 }),
                provideNgssmDataSource('second', secondSourceLoading)
            ]
        });
    });

    it(`should update the status of a data source`, () => {
        const setter = TestBed.inject(NgssmDataSourceValueSetter);
        setter.setDataSourceStatus('first', NgssmDataSourceValueStatus.loading);

        const store = TestBed.inject(Store);
        expect(selectNgssmDataSourceValue(store.state(), 'first')?.status).toEqual(NgssmDataSourceValueStatus.loading);
    });

    it(`should update the value of a data source`, () => {
        const setter = TestBed.inject(NgssmDataSourceValueSetter);
        setter.setDataSourceValue('first', { label: 'testing' });

        const store = TestBed.inject(Store);
        expect(selectNgssmDataSourceValue(store.state(), 'first')?.value).toEqual({ label: 'testing' });
    });

    it(`should update the status and the value of a data source`, () => {
        const setter = TestBed.inject(NgssmDataSourceValueSetter);
        setter.setDataSourceValue('first', { label: 'testing' }).setDataSourceStatus('first', NgssmDataSourceValueStatus.loading);

        const store = TestBed.inject(Store);
        expect(selectNgssmDataSourceValue(store.state(), 'first')?.value).toEqual({ label: 'testing' });
        expect(selectNgssmDataSourceValue(store.state(), 'first')?.status).toEqual(NgssmDataSourceValueStatus.loading);
    });

    it(`should update the parameter of a data source`, () => {
        const setter = TestBed.inject(NgssmDataSourceValueSetter);
        setter.setDataSourceParameter('first', { connectorId: 'gtkjhy' });

        const store = TestBed.inject(Store);
        expect(selectNgssmDataSourceValue(store.state(), 'first')?.parameter).toEqual({ connectorId: 'gtkjhy' });
    });

    it(`should update the status and the value of an additional property`, () => {
        const setter = TestBed.inject(NgssmDataSourceValueSetter);
        setter.setAdditionalProperty('first', 'my-prop', { label: 'testing' }, NgssmDataSourceValueStatus.loading);

        const store = TestBed.inject(Store);
        expect(selectNgssmDataSourceValue(store.state(), 'first')?.additionalProperties['my-prop']?.value).toEqual({ label: 'testing' });
        expect(selectNgssmDataSourceValue(store.state(), 'first')?.additionalProperties['my-prop']?.status).toEqual(NgssmDataSourceValueStatus.loading);
    });

    it(`should update the overall parameter validity of a data source`, () => {
        const setter = TestBed.inject(NgssmDataSourceValueSetter);
        setter.setParameterValidity('first', true);

        const store = TestBed.inject(Store);
        expect(selectNgssmDataSourceValue(store.state(), 'first')?.parameterIsValid).toBe(true);

        // Toggle to false
        setter.setParameterValidity('first', false);
        expect(selectNgssmDataSourceValue(store.state(), 'first')?.parameterIsValid).toBe(false);
    });

    it(`should update partial parameter validity for a data source`, () => {
        const setter = TestBed.inject(NgssmDataSourceValueSetter);
        // Set partial validity for key 'fieldA'
        setter.setParameterValidity('second', true, 'fieldA');

        const store = TestBed.inject(Store);
        expect(selectNgssmDataSourceValue(store.state(), 'second')?.parameterPartialValidity?.['fieldA']).toBe(true);

        // Update partial validity to false
        setter.setParameterValidity('second', false, 'fieldA');
        expect(selectNgssmDataSourceValue(store.state(), 'second')?.parameterPartialValidity?.['fieldA']).toBe(false);
    });

    it(`should clear the overall parameter validity of a data source`, () => {
        const setter = TestBed.inject(NgssmDataSourceValueSetter);
        setter.setParameterValidity('first', true);

        const store = TestBed.inject(Store);
        expect(selectNgssmDataSourceValue(store.state(), 'first')?.parameterIsValid).toBe(true);

        // Clear overall validity
        setter.clearParameterValidity('first');
        expect(selectNgssmDataSourceValue(store.state(), 'first')?.parameterIsValid).toBeUndefined();
    });

    it(`should clear a partial parameter validity entry for a data source`, () => {
        const setter = TestBed.inject(NgssmDataSourceValueSetter);
        setter.setParameterValidity('second', true, 'fieldB');

        const store = TestBed.inject(Store);
        expect(selectNgssmDataSourceValue(store.state(), 'second')?.parameterPartialValidity?.['fieldB']).toBe(true);

        // Clear partial validity
        setter.clearParameterValidity('second', 'fieldB');
        expect(selectNgssmDataSourceValue(store.state(), 'second')?.parameterPartialValidity?.['fieldB']).toBeUndefined();
    });

    // Tests for setOutdatedValueFlag
    it(`should set the valueOutdated flag to true and then to false for a data source`, () => {
        const setter = TestBed.inject(NgssmDataSourceValueSetter);

        // Mark as outdated
        setter.setOutdatedValueFlag('first', true);
        let store = TestBed.inject(Store);
        expect(selectNgssmDataSourceValue(store.state(), 'first')?.valueOutdated).toBe(true);

        // Mark as up-to-date
        setter.setOutdatedValueFlag('first', false);
        store = TestBed.inject(Store);
        expect(selectNgssmDataSourceValue(store.state(), 'first')?.valueOutdated).toBe(false);
    });
});
