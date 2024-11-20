import { Component } from '@angular/core';
import { ShowElementDirective } from './show-element.directive';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

import { StoreMock } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';

import { NgssmVisibilityStateSpecification } from '../state';
import { NgssmVisibilityActionType, ShowElementAction } from '../actions';

@Component({
    template: ` <button mat-raised-button [showElement]="'element-one'" id="buttonId">Show Element</button> `,
    imports: [CommonModule, MatButtonModule, ShowElementDirective]
})
class TestingComponent {}

describe('ShowElementDirective', () => {
  let component: TestingComponent;
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
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '200px';
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);

    spyOn(store, 'dispatchAction');
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.query(By.directive(ShowElementDirective)).injector.get(ShowElementDirective);
    expect(directive).toBeTruthy();
  });

  it(`should dispatch an action of type '${NgssmVisibilityActionType.showElement}' when clicking on button`, async () => {
    const button = await loader.getHarness(MatButtonHarness.with({ selector: '#buttonId' }));

    await button.click();

    expect(store.dispatchAction).toHaveBeenCalledWith(new ShowElementAction('element-one'));
  });
});
