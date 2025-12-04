import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreMock } from 'ngssm-store/testing';
import { Store } from '../store';
import { NgssmRegisterFeatureStateAction, NgssmStoreActionType, NgssmUnregisterFeatureStateAction } from '../actions';
import { ProvideNgssmFeatureStateDirectiveTestComponent } from './provide-ngssm-feature-state-directive-test.component';

describe('ProvideNgssmFeatureStateDirective', () => {
  let fixture: ComponentFixture<ProvideNgssmFeatureStateDirectiveTestComponent>;
  let store: StoreMock;

  beforeEach(async () => {
    store = new StoreMock({});
    vi.spyOn(store, 'dispatchAction');
    await TestBed.configureTestingModule({
      imports: [ProvideNgssmFeatureStateDirectiveTestComponent],
      providers: [{ provide: Store, useValue: store }],
      teardown: { destroyAfterEach: false }
    }).compileComponents();

    fixture = TestBed.createComponent(ProvideNgssmFeatureStateDirectiveTestComponent);
    fixture.nativeElement.style['min-height'] = '200px';
    fixture.detectChanges();
  });

  it(`should dispatch an action of type '${NgssmStoreActionType.registerFeatureState}' to register the state associated to the component`, () => {
    expect(store.dispatchAction).toHaveBeenCalledWith(
      new NgssmRegisterFeatureStateAction('my-feature-state', {
        id: 'testing'
      })
    );
  });

  it(`should dispatch an action of type '${NgssmStoreActionType.unregisterFeatureState}' to unregister the state associated to the component when the component is destroyed`, () => {
    fixture.destroy();

    expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmUnregisterFeatureStateAction('my-feature-state'));
  });
});
