import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonToggleHarness } from '@angular/material/button-toggle/testing';

import { StoreMock } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';

import { VisibilityToggleGroupComponent } from './visibility-toggle-group.component';
import { NgssmVisibilityStateSpecification } from '../../state';
import { NgssmVisibilityActionType, ToggleElementVisibilityAction } from '../../actions';

describe('VisibilityToggleGroupComponent', () => {
  let component: VisibilityToggleGroupComponent;
  let fixture: ComponentFixture<VisibilityToggleGroupComponent>;
  let store: StoreMock;
  let loader: HarnessLoader;

  beforeEach(async () => {
    store = new StoreMock({
      [NgssmVisibilityStateSpecification.featureStateKey]: NgssmVisibilityStateSpecification.initialState
    });
    TestBed.configureTestingModule({
      imports: [VisibilityToggleGroupComponent, NoopAnimationsModule],
      providers: [{ provide: Store, useValue: store }],
      teardown: { destroyAfterEach: false }
    });
    fixture = TestBed.createComponent(VisibilityToggleGroupComponent);
    fixture.nativeElement.style['min-height'] = '300px';
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.items = [
      {
        label: 'Left',
        key: 'left-value'
      },
      {
        label: 'Right',
        key: 'right-value'
      }
    ];

    fixture.detectChanges();
    await fixture.whenStable();

    spyOn(store, 'dispatchAction');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should dispatch an action of type ${NgssmVisibilityActionType.toggleElementVisibility}' when cliking on left button`, async () => {
    const element = await loader.getHarness(MatButtonToggleHarness.with({ selector: '#left-value' }));

    await element.toggle();

    expect(store.dispatchAction).toHaveBeenCalledWith(new ToggleElementVisibilityAction('left-value'));
  });

  it(`should render a check indicator when hideMultipleSelectionIndicator is false and itme is selected`, async () => {
    const element = await loader.getHarness(MatButtonToggleHarness.with({ selector: '#left-value' }));

    await element.toggle();

    const check = fixture.debugElement.query(By.css('mat-pseudo-checkbox'));
    expect(check).toBeTruthy();
  });

  it(`should not render a check indicator when hideMultipleSelectionIndicator is true and itme is selected`, async () => {
    component.hideMultipleSelectionIndicator = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const element = await loader.getHarness(MatButtonToggleHarness.with({ selector: '#left-value' }));

    await element.toggle();

    const check = fixture.debugElement.query(By.css('mat-pseudo-checkbox'));
    expect(check).toBeFalsy();
  });
});
