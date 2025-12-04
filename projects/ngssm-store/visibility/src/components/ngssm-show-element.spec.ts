import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

import { StoreMock, provideNgssmStoreTesting } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';

import { NgssmVisibilityStateSpecification } from '../state';
import { NgssmVisibilityActionType, ShowElementAction } from '../actions';
import { NgssmShowElement } from './ngssm-show-element';

@Component({
    template: ` <button mat-raised-button [ngssmShowElement]="'element-one'" id="buttonId">Show Element</button> `,
    imports: [MatButtonModule, NgssmShowElement]
})
class TestingComponent {
}

describe('NgssmShowElement', () => {
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
        const directive = fixture.debugElement.query(By.directive(NgssmShowElement)).injector.get(NgssmShowElement);
        expect(directive).toBeTruthy();
    });

    it(`should dispatch an action of type '${NgssmVisibilityActionType.showElement}' when clicking on button`, async () => {
        const button = await loader.getHarness(MatButtonHarness.with({ selector: '#buttonId' }));

        await button.click();

        expect(storeMock.dispatchAction).toHaveBeenCalledWith(new ShowElementAction('element-one'));
    });
});
