import { TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { ngssmLoadDataSourceValue } from './ngssm-data-source';
import { NgssmDataActionType, NgssmLoadDataSourceValueAction } from '../actions';

describe('NgssmDataSource', () => {
  describe('ngssmLoadDataSourceValue', () => {
    let storeMock: StoreMock;

    beforeEach(() => {
      storeMock = new StoreMock({});
      TestBed.configureTestingModule({ providers: [{ provide: Store, useValue: storeMock }] });
    });

    it(`should return true`, () => {
      const func = ngssmLoadDataSourceValue('testing');
      const result = TestBed.runInInjectionContext(() => func());
      expect(result).toBeTrue();
    });

    [true, false].forEach((forceReload) => {
      it(`should dispatch an action of type '${NgssmDataActionType.loadDataSourceValue}'`, () => {
        spyOn(storeMock, 'dispatchAction');

        const func = ngssmLoadDataSourceValue('testing', forceReload);
        TestBed.runInInjectionContext(() => func());

        expect(storeMock.dispatchAction).toHaveBeenCalledWith(new NgssmLoadDataSourceValueAction('testing', { forceReload }));
      });
    });
  });
});
