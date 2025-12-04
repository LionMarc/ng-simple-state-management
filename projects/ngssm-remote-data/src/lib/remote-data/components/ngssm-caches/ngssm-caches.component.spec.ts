import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatTableHarness } from '@angular/material/table/testing';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { LoadRemoteDataAction, RemoteDataActionType } from '../../actions';
import { DataStatus } from '../../model';
import { RemoteDataStateSpecification, updateRemoteDataState } from '../../state';
import { NgssmCachesComponent } from './ngssm-caches.component';

describe('NgssmCachesComponent', () => {
    let component: NgssmCachesComponent;
    let fixture: ComponentFixture<NgssmCachesComponent>;
    let store: StoreMock;
    let loader: HarnessLoader;

    beforeEach(async () => {
        store = new StoreMock({
            [RemoteDataStateSpecification.featureStateKey]: RemoteDataStateSpecification.initialState
        });
        await TestBed.configureTestingModule({
            imports: [NgssmCachesComponent],
            providers: [{ provide: Store, useValue: store }],
            teardown: { destroyAfterEach: false }
        }).compileComponents();

        fixture = TestBed.createComponent(NgssmCachesComponent);
        component = fixture.componentInstance;
        fixture.nativeElement.style['min-height'] = '400px';
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.detectChanges();

        vi.spyOn(store, 'dispatchActionType');
        vi.spyOn(store, 'dispatchAction');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`should dispatch a '${RemoteDataActionType.closeCachesComponent}' action when clicking on the close button`, async () => {
        const element = await loader.getHarness(MatButtonHarness.with({ selector: '#closeButton' }));

        await element.click();

        expect(store.dispatchActionType).toHaveBeenCalledWith(RemoteDataActionType.closeCachesComponent);
    });

    it(`should render the list of caches`, async () => {
        const state = updateRemoteDataState(store.stateValue, {
            ['key1']: {
                $set: {
                    status: DataStatus.loading
                }
            },
            ['key2']: {
                $set: {
                    status: DataStatus.loading
                }
            },
            ['key3']: {
                $set: {
                    status: DataStatus.loaded
                }
            }
        });

        store.stateValue = state;

        fixture.detectChanges();
        await fixture.whenStable();

        const element = await loader.getHarness(MatTableHarness);

        const rows = await element.getRows();

        expect(rows.length).toEqual(3);

        const columnsText = await element.getCellTextByColumnName();

        expect(columnsText['key'].text).toEqual(['key1', 'key2', 'key3']);
    });

    it(`should not be able to reload data when cache is in '${DataStatus.loading}' state`, async () => {
        const state = updateRemoteDataState(store.stateValue, {
            ['key1']: {
                $set: {
                    status: DataStatus.loading
                }
            }
        });

        store.stateValue = state;

        fixture.detectChanges();
        await fixture.whenStable();

        const element = await loader.getHarness(MatButtonHarness.with({ selector: '#reload_key1' }));

        const isDisabled = await element.isDisabled();

        expect(isDisabled).toBe(true);
    });

    [DataStatus.error, DataStatus.loaded, DataStatus.none, DataStatus.notFound].forEach((status) => {
        it(`should be able to reload data when cache is in '${status}' state`, async () => {
            const state = updateRemoteDataState(store.stateValue, {
                ['key1']: {
                    $set: {
                        status: status
                    }
                }
            });

            store.stateValue = state;

            fixture.detectChanges();
            await fixture.whenStable();

            const element = await loader.getHarness(MatButtonHarness.with({ selector: '#reload_key1' }));

            const isDisabled = await element.isDisabled();

            expect(isDisabled).toBe(false);
        });

        it(`should dispatch a '${RemoteDataActionType.loadRemoteData} when clicking on reload button and cache is in '${status}' state`, async () => {
            const state = updateRemoteDataState(store.stateValue, {
                ['key1']: {
                    $set: {
                        status: status
                    }
                }
            });

            store.stateValue = state;

            fixture.detectChanges();
            await fixture.whenStable();

            const element = await loader.getHarness(MatButtonHarness.with({ selector: '#reload_key1' }));

            await element.click();

            expect(store.dispatchAction).toHaveBeenCalledWith(new LoadRemoteDataAction('key1', { forceReload: true, keepStoredGetterParams: true }));
        });
    });
});
