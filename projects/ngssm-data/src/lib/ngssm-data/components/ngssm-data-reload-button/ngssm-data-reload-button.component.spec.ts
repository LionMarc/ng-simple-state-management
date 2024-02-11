import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';

import { DateTime } from 'luxon';

import { StoreMock } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';

import { NgssmDataReloadButtonComponent } from './ngssm-data-reload-button.component';
import { NgssmDataStateSpecification, updateNgssmDataState } from '../../state';
import { NgssmDataSourceValueStatus } from '../../model';
import { NgssmDataActionType, NgssmLoadDataSourceValueAction } from '../../actions';

describe('NgssmDataReloadButtonComponent', () => {
  let component: NgssmDataReloadButtonComponent;
  let fixture: ComponentFixture<NgssmDataReloadButtonComponent>;
  let store: StoreMock;
  let loader: HarnessLoader;

  beforeEach(async () => {
    store = new StoreMock({
      [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
    });
    await TestBed.configureTestingModule({
      imports: [NgssmDataReloadButtonComponent],
      providers: [{ provide: Store, useValue: store }],
      teardown: { destroyAfterEach: true }
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmDataReloadButtonComponent);
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '200px';
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should be disabled when no data source key is set`, async () => {
    const element = await loader.getHarness(MatButtonHarness);

    expect(await element.isDisabled()).toBeTrue();
  });

  describe('when one data source is associated to the button', () => {
    const dataSourceKey = 'my-first-source';

    beforeEach(async () => {
      component.dataSourceKeys = [dataSourceKey];
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it(`should be disabled when state is not set for given key`, async () => {
      const element = await loader.getHarness(MatButtonHarness);

      expect(await element.isDisabled()).toBeTrue();
    });

    describe(`when state is initialized for given data source`, () => {
      beforeEach(async () => {
        const state = updateNgssmDataState(store.stateValue, {
          dataSourceValues: {
            [dataSourceKey]: {
              $set: {
                status: NgssmDataSourceValueStatus.none,
                value: undefined,
                additionalProperties: {}
              }
            }
          }
        });
        store.stateValue = state;
        fixture.detectChanges();
        await fixture.whenStable();
      });

      [
        NgssmDataSourceValueStatus.error,
        NgssmDataSourceValueStatus.loaded,
        NgssmDataSourceValueStatus.none,
        NgssmDataSourceValueStatus.notRegistered
      ].forEach((status) => {
        describe(`when data source valuestatus is ${status}`, () => {
          beforeEach(async () => {
            const state = updateNgssmDataState(store.stateValue, {
              dataSourceValues: {
                [dataSourceKey]: {
                  status: { $set: status }
                }
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

          it(`should dispatch a '${NgssmDataActionType.loadDataSourceValue}' when clicking on button`, async () => {
            spyOn(store, 'dispatchAction');
            const element = await loader.getHarness(MatButtonHarness);

            await element.click();

            expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmLoadDataSourceValueAction(dataSourceKey, true));
          });
        });
      });

      [NgssmDataSourceValueStatus.loading].forEach((status) => {
        describe(`when data source value status is ${status}`, () => {
          beforeEach(async () => {
            const state = updateNgssmDataState(store.stateValue, {
              dataSourceValues: {
                [dataSourceKey]: {
                  status: { $set: status }
                }
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

  describe(`when associate to multiple keys`, () => {
    const firstSource = 'first-data-source';
    const secondSource = 'second-source';

    beforeEach(async () => {
      component.dataSourceKeys = [firstSource, secondSource];
      fixture.detectChanges();
    });

    it(`should be disabled when no value is set set in state for the keys`, async () => {
      const element = await loader.getHarness(MatButtonHarness);

      expect(await element.isDisabled()).toBeTrue();
    });

    it(`should be enabled when at least on source is set and is not in loading status`, async () => {
      const state = updateNgssmDataState(store.stateValue, {
        dataSourceValues: {
          [firstSource]: {
            $set: {
              status: NgssmDataSourceValueStatus.none,
              value: undefined,
              additionalProperties: {}
            }
          }
        }
      });
      store.stateValue = state;
      fixture.detectChanges();

      const element = await loader.getHarness(MatButtonHarness);

      expect(await element.isDisabled()).toBeFalse();
    });

    it(`should render a mat-spinner when at least one source is in loading status`, () => {
      const state = updateNgssmDataState(store.stateValue, {
        dataSourceValues: {
          [firstSource]: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: undefined,
              additionalProperties: {}
            }
          },
          [secondSource]: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              value: undefined,
              additionalProperties: {}
            }
          }
        }
      });
      store.stateValue = state;
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('mat-spinner'));
      expect(element).toBeTruthy();
    });

    it(`should dispatch a '${NgssmDataActionType.loadDataSourceValue}' per associated source when clicking on button`, async () => {
      const state = updateNgssmDataState(store.stateValue, {
        dataSourceValues: {
          [firstSource]: {
            $set: {
              status: NgssmDataSourceValueStatus.none,
              value: undefined,
              additionalProperties: {}
            }
          }
        }
      });
      store.stateValue = state;
      fixture.detectChanges();

      spyOn(store, 'dispatchAction');
      const element = await loader.getHarness(MatButtonHarness);

      await element.click();

      expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmLoadDataSourceValueAction(firstSource, true));
      expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmLoadDataSourceValueAction(secondSource, true));
    });

    it(`should dispatch a tooltip message with the data of the oldest loaded source`, async () => {
      const state = updateNgssmDataState(store.stateValue, {
        dataSourceValues: {
          [firstSource]: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: undefined,
              lastLoadingDate: DateTime.fromISO('2023-12-04T12:34:00Z'),
              additionalProperties: {}
            }
          },
          [secondSource]: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              value: undefined,
              lastLoadingDate: DateTime.fromISO('2023-12-04T12:46:00Z'),
              additionalProperties: {}
            }
          }
        }
      });
      store.stateValue = state;
      fixture.detectChanges();

      const tooltip = await loader.getHarness(MatTooltipHarness);
      await tooltip.show();
      const text = await tooltip.getTooltipText();

      expect(text).toEqual(['Reload data.', `Loaded at ${DateTime.fromISO('2023-12-04T12:34:00Z').toHTTP()}`].join('\n'));
    });
  });
});
