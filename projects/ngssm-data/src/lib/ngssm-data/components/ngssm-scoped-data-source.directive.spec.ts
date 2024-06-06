import { of } from 'rxjs';

import { StoreMock } from 'ngssm-store/testing';

import { NgssmScopedDataSourceDirective } from './ngssm-scoped-data-source.directive';
import { NgssmDataActionType, NgssmUnregisterDataSourceAction } from '../actions';

describe('NgssmScopedDataSourceDirective', () => {
  let store: StoreMock;

  beforeEach(() => {
    store = new StoreMock({});
    spyOn(store, 'dispatchAction');
  });

  it('should register the source when created', () => {
    const directive = new NgssmScopedDataSourceDirective(store as any);
    directive.ngssmScopedDataSource = {
      key: 'test',
      dataLoadingFunc: () => of([])
    };
    const recentCallArgs = (store.dispatchAction as any).calls.mostRecent().args[0];
    expect(recentCallArgs.type).toEqual(NgssmDataActionType.registerDataSource);
    expect(recentCallArgs.dataSource.key).toEqual('test');
  });

  it('should unregister the source when deleted', () => {
    const directive = new NgssmScopedDataSourceDirective(store as any);
    directive.ngssmScopedDataSource = {
      key: 'test',
      dataLoadingFunc: () => of([])
    };
    directive.ngOnDestroy();
    expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmUnregisterDataSourceAction('test'));
  });
});
