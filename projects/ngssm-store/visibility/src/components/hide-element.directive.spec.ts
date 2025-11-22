import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';
import { MatButtonHarness } from '@angular/material/button/testing';

import { StoreMock } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';

import { HideElementDirective } from './hide-element.directive';
import { NgssmVisibilityStateSpecification } from '../state';
import { HideElementAction, NgssmVisibilityActionType } from '../actions';

@Component({
  template: ` <button mat-raised-button [hideElement]="'element-one'" id="buttonId">Hide Element</button> `,
  imports: [MatButtonModule, HideElementDirective]
})
class TestingComponent {}

describe('HideElementDirective', () => {
  let fixture: ComponentFixture<TestingComponent>;
  let store: StoreMock;
  let loader: HarnessLoader;

  beforeEach(async () => {
    store = new StoreMock({
      [NgssmVisibilityStateSpecification.featureStateKey]: NgssmVisibilityStateSpecification.initialState
    });
    await TestBed.configureTestingModule({
      imports: [TestingComponent],
      providers: [{ provide: Store, useValue: store }],
      teardown: { destroyAfterEach: true }
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);
    fixture.nativeElement.style['min-height'] = '200px';
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);

    spyOn(store, 'dispatchAction');
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.query(By.directive(HideElementDirective)).injector.get(HideElementDirective);
    expect(directive).toBeTruthy();
  });

  it(`should dispatch an action of type '${NgssmVisibilityActionType.hideElement}' when clicking on button`, async () => {
    const button = await loader.getHarness(MatButtonHarness.with({ selector: '#buttonId' }));

    await button.click();

    expect(store.dispatchAction).toHaveBeenCalledWith(new HideElementAction('element-one'));
  });
});
