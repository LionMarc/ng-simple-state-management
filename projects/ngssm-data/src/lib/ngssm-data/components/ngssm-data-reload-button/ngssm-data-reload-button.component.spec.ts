import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconButton } from '@angular/material/button';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

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
      imports: [NgssmDataReloadButtonComponent, NoopAnimationsModule],
      providers: [{ provide: Store, useValue: store }],
      teardown: { destroyAfterEach: false }
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmDataReloadButtonComponent);
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '200px';
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
    spyOn(store, 'dispatchAction');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should be disabled when no data source key is set`, async () => {
    const element = await loader.getHarness(MatButtonHarness);

    expect(await element.isDisabled()).toBeTrue();
  });

  describe('Rendered icon', () => {
    it(`should render a fa-rotate-right by default`, () => {
      const icon = fixture.debugElement.query(By.css('.fa-rotate-right'));
      expect(icon).toBeTruthy();
    });

    it(`should render a fa-magnifying-glass when input property buttonIcon is set to fa-magnifying-glass`, async () => {
      component.buttonIcon = 'fa-solid fa-magnifying-glass';
      fixture.detectChanges();
      await fixture.whenStable();

      const icon = fixture.debugElement.query(By.css('.fa-magnifying-glass'));
      expect(icon).toBeTruthy();
    });
  });

  describe('Rendering auto reload component', () => {
    it(`should not render an auto reload component by default`, () => {
      const element = fixture.debugElement.query(By.css('ngssm-auto-reload'));
      expect(element).toBeFalsy();
    });

    describe('when autoReloadEnabled is set to true', () => {
      beforeEach(async () => {
        component.autoReloadEnabled = true;
        fixture.detectChanges();
        await fixture.whenStable();
      });

      it(`should render an auto reload component`, () => {
        const element = fixture.debugElement.query(By.css('ngssm-auto-reload'));
        expect(element).toBeTruthy();
      });

      it(`should not render an auto reload component when autoReloadEnabled is reset to false`, async () => {
        component.autoReloadEnabled = false;
        fixture.detectChanges();
        await fixture.whenStable();

        const element = fixture.debugElement.query(By.css('ngssm-auto-reload'));
        expect(element).toBeFalsy();
      });
    });
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
            const element = await loader.getHarness(MatButtonHarness);

            await element.click();

            expect(store.dispatchAction).toHaveBeenCalledWith(
              new NgssmLoadDataSourceValueAction(dataSourceKey, { forceReload: true, keepAdditionalProperties: false })
            );
          });

          it(`should dispatch a '${NgssmDataActionType.loadDataSourceValue}' with keepAdditionalProperties to true when clicking on button`, async () => {
            component.keepAdditionalProperties = true;
            const element = await loader.getHarness(MatButtonHarness);

            await element.click();

            expect(store.dispatchAction).toHaveBeenCalledWith(
              new NgssmLoadDataSourceValueAction(dataSourceKey, { forceReload: true, keepAdditionalProperties: true })
            );
          });

          describe(`when auto reload is active`, () => {
            beforeEach(async () => {
              component.autoReloadEnabled = true;
              fixture.detectChanges();
              await fixture.whenStable();
            });

            it(`should dispatch a '${NgssmDataActionType.loadDataSourceValue}' when period elapsed`, fakeAsync(async () => {
              const selector = await loader.getHarness(MatSelectHarness);
              await selector.open();
              await selector.clickOptions({ text: 'Every minute' });

              tick(60100);

              expect(store.dispatchAction).toHaveBeenCalledWith(
                new NgssmLoadDataSourceValueAction(dataSourceKey, { forceReload: true, keepAdditionalProperties: false })
              );

              discardPeriodicTasks();
            }));
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

      describe('Rendered color', () => {
        it(`should render a primary button when valueOutdated is undefined`, async () => {
          const state = updateNgssmDataState(store.stateValue, {
            dataSourceValues: {
              [dataSourceKey]: {
                valueOutdated: { $set: undefined }
              }
            }
          });
          store.stateValue = state;
          fixture.detectChanges();
          await fixture.whenStable();

          const button = fixture.debugElement.query(By.css('button')).injector.get(MatIconButton);
          expect(button.color).toEqual('primary');
        });

        it(`should render a accent button when valueOutdated is true`, async () => {
          const state = updateNgssmDataState(store.stateValue, {
            dataSourceValues: {
              [dataSourceKey]: {
                valueOutdated: { $set: true }
              }
            }
          });
          store.stateValue = state;
          fixture.detectChanges();
          await fixture.whenStable();

          const button = fixture.debugElement.query(By.css('button')).injector.get(MatIconButton);
          expect(button.color).toEqual('accent');
        });

        it(`should render a primary button when valueOutdated is false`, async () => {
          const state = updateNgssmDataState(store.stateValue, {
            dataSourceValues: {
              [dataSourceKey]: {
                valueOutdated: { $set: false }
              }
            }
          });
          store.stateValue = state;
          fixture.detectChanges();
          await fixture.whenStable();

          const button = fixture.debugElement.query(By.css('button')).injector.get(MatIconButton);
          expect(button.color).toEqual('primary');
        });
      });

      it(`should be disabled when parameter validity flag is set to false`, async () => {
        const state = updateNgssmDataState(store.stateValue, {
          dataSourceValues: {
            [dataSourceKey]: {
              status: { $set: NgssmDataSourceValueStatus.loaded },
              parameterIsValid: { $set: false }
            }
          }
        });
        store.stateValue = state;
        fixture.detectChanges();
        await fixture.whenStable();

        const element = await loader.getHarness(MatButtonHarness);

        expect(await element.isDisabled()).toBeTrue();
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

      const element = await loader.getHarness(MatButtonHarness);

      await element.click();

      expect(store.dispatchAction).toHaveBeenCalledWith(
        new NgssmLoadDataSourceValueAction(firstSource, { forceReload: true, keepAdditionalProperties: false })
      );
      expect(store.dispatchAction).toHaveBeenCalledWith(
        new NgssmLoadDataSourceValueAction(secondSource, { forceReload: true, keepAdditionalProperties: false })
      );
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

  describe('rendering label', () => {
    it('should render the label when it is set', async () => {
      component.label = 'Reload data';
      fixture.detectChanges();
      await fixture.whenStable();

      const button = await loader.getHarness(MatButtonHarness);
      expect(button).toBeTruthy();
      const text = await button.getText();
      expect(text).toContain('Reload data');
    });

    it('should render a mat-icon-button when label is not set', async () => {
      component.label = undefined;
      fixture.detectChanges();
      await fixture.whenStable();

      const button = await loader.getHarness(MatButtonHarness);
      expect(button).toBeTruthy();
      const type = await button.getVariant();
      expect(type).toEqual('icon');
    });
  });
});
