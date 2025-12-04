import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { RemoteDataActionType } from '../../actions';
import { RemoteDataStateSpecification } from '../../state';
import { NgssmCachesDisplayButtonComponent } from './ngssm-caches-display-button.component';

describe('NgssmCachesDisplayButtonComponent', () => {
    let component: NgssmCachesDisplayButtonComponent;
    let fixture: ComponentFixture<NgssmCachesDisplayButtonComponent>;
    let store: StoreMock;
    let loader: HarnessLoader;

    beforeEach(async () => {
        store = new StoreMock({
            [RemoteDataStateSpecification.featureStateKey]: RemoteDataStateSpecification.initialState
        });
        await TestBed.configureTestingModule({
            imports: [NgssmCachesDisplayButtonComponent],
            providers: [{ provide: Store, useValue: store }],
            teardown: { destroyAfterEach: false }
        }).compileComponents();

        fixture = TestBed.createComponent(NgssmCachesDisplayButtonComponent);
        component = fixture.componentInstance;
        fixture.nativeElement.style['min-height'] = '200px';
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`should dispatch a '${RemoteDataActionType.displayCaches}' when clicking on button`, async () => {
        vi.spyOn(store, 'dispatchActionType');
        const element = await loader.getHarness(MatButtonHarness);

        await element.click();

        expect(store.dispatchActionType).toHaveBeenCalledWith(RemoteDataActionType.displayCaches);
    });
});
