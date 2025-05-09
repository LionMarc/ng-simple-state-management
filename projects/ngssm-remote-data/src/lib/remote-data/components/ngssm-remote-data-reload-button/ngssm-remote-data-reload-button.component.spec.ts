import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { LoadRemoteDataAction, RemoteDataActionType } from '../../actions';
import { DataStatus, getDefaultRemoteData } from '../../model';
import { RemoteDataStateSpecification, updateRemoteDataState } from '../../state';
import { NgssmRemoteDataReloadButtonComponent } from './ngssm-remote-data-reload-button.component';

describe('NgssmRemoteDataReloadButtonComponent', () => {
  let component: NgssmRemoteDataReloadButtonComponent;
  let fixture: ComponentFixture<NgssmRemoteDataReloadButtonComponent>;
  let store: StoreMock;
  let loader: HarnessLoader;

  beforeEach(async () => {
    store = new StoreMock({
      [RemoteDataStateSpecification.featureStateKey]: RemoteDataStateSpecification.initialState
    });
    await TestBed.configureTestingModule({
      imports: [NgssmRemoteDataReloadButtonComponent],
      providers: [{ provide: Store, useValue: store }],
      teardown: { destroyAfterEach: true }
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmRemoteDataReloadButtonComponent);
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '200px';
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should be disabled when no remote data key is set`, async () => {
    const element = await loader.getHarness(MatButtonHarness);

    expect(await element.isDisabled()).toBeTrue();
  });

  describe('when remote data key is set', () => {
    const remoteDataKey = 'remote';

    beforeEach(async () => {
      fixture.componentRef.setInput('remoteDataKeys', [remoteDataKey]);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it(`should be disabled when state is not set for given keys`, async () => {
      const element = await loader.getHarness(MatButtonHarness);

      expect(await element.isDisabled()).toBeTrue();
    });

    describe(`when state is initialized for given remote data`, () => {
      beforeEach(async () => {
        const state = updateRemoteDataState(store.stateValue, {
          [remoteDataKey]: { $set: getDefaultRemoteData<string>('') }
        });
        store.stateValue = state;
        fixture.detectChanges();
        await fixture.whenStable();
      });

      [DataStatus.error, DataStatus.loaded, DataStatus.none, DataStatus.notFound].forEach((status) => {
        describe(`when remote data status is ${status}`, () => {
          beforeEach(async () => {
            const state = updateRemoteDataState(store.stateValue, {
              [remoteDataKey]: {
                status: { $set: status }
              }
            });
            store.stateValue = state;
            fixture.detectChanges();
            await fixture.whenStable();
          });

          it(`should be enabled`, async () => {
            const element = await loader.getHarness(MatButtonHarness);

            expect(await element.isDisabled()).toBeFalse();
          });

          it(`should dispatch a '${RemoteDataActionType.loadRemoteData}' when clicking on button`, async () => {
            spyOn(store, 'dispatchAction');
            const element = await loader.getHarness(MatButtonHarness);

            await element.click();

            expect(store.dispatchAction).toHaveBeenCalledWith(
              new LoadRemoteDataAction(remoteDataKey, { forceReload: true, keepStoredGetterParams: true })
            );
          });

          it(`should dispatch 'action-01' and 'action-02' when those actions are registered and when clicking on button`, async () => {
            spyOn(store, 'dispatchActionType');
            fixture.componentRef.setInput('actionTypes', ['action-01', 'action-02']);
            const element = await loader.getHarness(MatButtonHarness);

            await element.click();

            expect(store.dispatchActionType).toHaveBeenCalledWith('action-01');
            expect(store.dispatchActionType).toHaveBeenCalledWith('action-02');
          });
        });
      });

      [DataStatus.loading].forEach((status) => {
        describe(`when remote data status is ${status}`, () => {
          beforeEach(async () => {
            const state = updateRemoteDataState(store.stateValue, {
              [remoteDataKey]: {
                status: { $set: status }
              }
            });
            store.stateValue = state;
            fixture.detectChanges();
            await fixture.whenStable();
          });

          it(`should be disabled`, async () => {
            const element = await loader.getHarness(MatButtonHarness);

            expect(await element.isDisabled()).toBeTrue();
          });

          it(`should render a mat-spinner`, () => {
            const element = fixture.debugElement.query(By.css('mat-spinner'));
            expect(element).toBeTruthy();
          });
        });
      });
    });
  });
});
