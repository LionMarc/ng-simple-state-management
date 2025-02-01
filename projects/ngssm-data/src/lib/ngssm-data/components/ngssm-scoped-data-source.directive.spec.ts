import { of } from 'rxjs';

import { StoreMock } from 'ngssm-store/testing';

import { NgssmScopedDataSourceDirective } from './ngssm-scoped-data-source.directive';
import { NgssmDataActionType, NgssmUnregisterDataSourceAction } from '../actions';
import { Store } from 'ngssm-store';

describe('NgssmScopedDataSourceDirective', () => {
  let store: StoreMock;
  let storeSpy:jasmine.Spy;

  beforeEach(() => {
    store = new StoreMock({});
    storeSpy = spyOn(store, 'dispatchAction');
  });

  it('should register the source when created', () => {
    const directive = new NgssmScopedDataSourceDirective(store as unknown as Store);
    directive.ngssmScopedDataSource = {
      key: 'test',
      dataLoadingFunc: () => of([])
    };
    const recentCallArgs = storeSpy.calls.mostRecent().args[0];
    expect(recentCallArgs.type).toEqual(NgssmDataActionType.registerDataSource);
    expect(recentCallArgs.dataSource.key).toEqual('test');
  });

  it('should unregister the source when deleted', () => {
    const directive = new NgssmScopedDataSourceDirective(store as unknown as Store);
    directive.ngssmScopedDataSource = {
      key: 'test',
      dataLoadingFunc: () => of([])
    };
    directive.ngOnDestroy();
    expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmUnregisterDataSourceAction('test'));
  });
});
