import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

import { Store } from 'ngssm-store';
import { provideNgssmStoreTesting, StoreMock } from 'ngssm-store/testing';

import { NgssmVisibilityStateSpecification } from '../state';
import { NgssmVisibilityActionType, ToggleElementVisibilityAction } from '../actions';
import { NgssmToggleElementVisibility } from './ngssm-toggle-element-visibility';

@Component({
    template: ` <button mat-raised-button [ngssmToggleElementVisibility]="'element-one'" id="buttonId">Toggle Element</button> `,
    imports: [MatButtonModule, NgssmToggleElementVisibility]
})
class TestingComponent {
}

describe('NgssmToggleElementVisibility', () => {
    let fixture: ComponentFixture<TestingComponent>;
    let storeMock: StoreMock;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestingComponent],
            providers: [provideNgssmStoreTesting()],
            teardown: { destroyAfterEach: true }
        }).compileComponents();

        fixture = TestBed.createComponent(TestingComponent);
        fixture.nativeElement.style['min-height'] = '200px';
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);

        storeMock = TestBed.inject(Store) as unknown as StoreMock;

        storeMock.stateValue = {
            ...storeMock.stateValue,
            [NgssmVisibilityStateSpecification.featureStateKey]: NgssmVisibilityStateSpecification.initialState
        };

        vi.spyOn(storeMock, 'dispatchAction');
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(NgssmToggleElementVisibility)).injector.get(NgssmToggleElementVisibility);
        expect(directive).toBeTruthy();
    });

    it(`should dispatch an action of type '${NgssmVisibilityActionType.toggleElementVisibility}' when clicking on button`, async () => {
        const button = await loader.getHarness(MatButtonHarness.with({ selector: '#buttonId' }));

        await button.click();

        expect(storeMock.dispatchAction).toHaveBeenCalledWith(new ToggleElementVisibilityAction('element-one'));
    });
});
