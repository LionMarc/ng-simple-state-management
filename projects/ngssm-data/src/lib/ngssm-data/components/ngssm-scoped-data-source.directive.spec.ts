import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { StoreMock } from 'ngssm-store/testing';
import { ACTION_DISPATCHER } from 'ngssm-store';

import { NgssmScopedDataSourceDirective } from './ngssm-scoped-data-source.directive';
import { NgssmDataActionType, NgssmUnregisterDataSourceAction } from '../actions';
import { NgssmDataSource } from '../model';

@Component({
  template: ` <div [ngssmScopedDataSource]="dataSource()">TESTING</div> `,
  imports: [NgssmScopedDataSourceDirective]
})
class TestingComponent {
  public readonly dataSource = signal<NgssmDataSource>({
    key: 'test',
    dataLoadingFunc: () => of([])
  });
}

describe('NgssmScopedDataSourceDirective', () => {
  let store: StoreMock;
  let storeSpy: jasmine.Spy;
  let fixture: ComponentFixture<TestingComponent>;

  beforeEach(() => {
    store = new StoreMock({});
    storeSpy = spyOn(store, 'dispatchAction');
    TestBed.configureTestingModule({
      imports: [TestingComponent],
      providers: [{ provide: ACTION_DISPATCHER, useValue: store }, NgssmScopedDataSourceDirective],
      teardown: { destroyAfterEach: false }
    });

    fixture = TestBed.createComponent(TestingComponent);
    fixture.detectChanges();
  });

  it('should register the source when created', () => {
    const recentCallArgs = storeSpy.calls.mostRecent().args[0];
    expect(recentCallArgs.type).toEqual(NgssmDataActionType.registerDataSource);
    expect(recentCallArgs.dataSource.key).toEqual('test');
  });

  it('should unregister the source when deleted', () => {
    fixture.destroy();
    expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmUnregisterDataSourceAction('test'));
  });

  it('should not be able to update the data source', () => {
    fixture.componentInstance.dataSource.set({
      key: 'test2',
      dataLoadingFunc: () => of([])
    });

    let receivedError: string | undefined;
    try {
      fixture.detectChanges();
    } catch (error) {
      receivedError = (error as Error).message;
    }

    expect(receivedError).toContain('Data source is already set.');
  });
});
