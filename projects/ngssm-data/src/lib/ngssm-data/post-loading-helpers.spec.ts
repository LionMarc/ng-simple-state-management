import { TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { postNgssmDataSourceLoadingActionRunnerBuilder } from './post-loading-helpers';
import { NgssmDataSourceValueStatus } from './model';
import { NgssmSetDataSourceValueAction } from './actions';

describe('Post loading helpers', () => {
  describe('postNgssmDataSourceLoadingActionRunnerBuilder', () => {
    const dataSourceKey = 'my-source';
    let store: StoreMock;
    let factory: () => void;
    let postLoadingAction: {
      action: (status: NgssmDataSourceValueStatus) => void;
    };

    beforeEach(() => {
      store = new StoreMock({});
      postLoadingAction = {
        action: (status) => {
          console.log('postLoadingAction', status);
        }
      };
      vi.spyOn(postLoadingAction, 'action');
      TestBed.configureTestingModule({
        providers: [{ provide: Store, useValue: store }]
      });

      factory = TestBed.runInInjectionContext(() => postNgssmDataSourceLoadingActionRunnerBuilder(dataSourceKey, postLoadingAction.action));
    });

    [
      NgssmDataSourceValueStatus.error,
      NgssmDataSourceValueStatus.loaded,
      NgssmDataSourceValueStatus.loading,
      NgssmDataSourceValueStatus.none,
      NgssmDataSourceValueStatus.notRegistered
    ].forEach((status) => {
      it(`should call the post loading action with status '${status}' when data source '${dataSourceKey}' value is set`, () => {
        factory();
        store.processedAction.set(new NgssmSetDataSourceValueAction(dataSourceKey, status));
        TestBed.tick();
        expect(postLoadingAction.action).toHaveBeenCalledWith(status);
      });

      it(`should not call the post loading action when a data source other than'${dataSourceKey}' value is set`, () => {
        factory();
        store.processedAction.set(new NgssmSetDataSourceValueAction('another-one', status));
        TestBed.tick();
        expect(postLoadingAction.action).not.toHaveBeenCalled();
      });

      it(`should not call the post loading action when data source '${dataSourceKey}' value is set again`, () => {
        factory();
        store.processedAction.set(new NgssmSetDataSourceValueAction(dataSourceKey, status));
        TestBed.tick();
        (postLoadingAction.action as Mock).mockClear();
        store.processedAction.set(new NgssmSetDataSourceValueAction(dataSourceKey, status));
        TestBed.tick();
        expect(postLoadingAction.action).not.toHaveBeenCalled();
      });
    });
  });
});
