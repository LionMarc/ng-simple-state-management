import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { StoreMock } from 'ngssm-store/testing';
import { ACTION_DISPATCHER } from 'ngssm-store';

import { NgssmScopedDataSourceDirective } from './ngssm-scoped-data-source.directive';
import { NgssmDataActionType, NgssmUnregisterDataSourceAction } from '../actions';

describe('NgssmScopedDataSourceDirective', () => {
  let store: StoreMock;
  let storeSpy: jasmine.Spy;
  let directive: NgssmScopedDataSourceDirective;

  beforeEach(() => {
    store = new StoreMock({});
    storeSpy = spyOn(store, 'dispatchAction');
    TestBed.configureTestingModule({
      providers: [{ provide: ACTION_DISPATCHER, useValue: store }, NgssmScopedDataSourceDirective]
    });

    directive = TestBed.inject(NgssmScopedDataSourceDirective);
  });

  it('should register the source when created', () => {
    directive.ngssmScopedDataSource = {
      key: 'test',
      dataLoadingFunc: () => of([])
    };
    const recentCallArgs = storeSpy.calls.mostRecent().args[0];
    expect(recentCallArgs.type).toEqual(NgssmDataActionType.registerDataSource);
    expect(recentCallArgs.dataSource.key).toEqual('test');
  });

  it('should unregister the source when deleted', () => {
    directive.ngssmScopedDataSource = {
      key: 'test',
      dataLoadingFunc: () => of([])
    };
    directive.ngOnDestroy();
    expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmUnregisterDataSourceAction('test'));
  });
});
