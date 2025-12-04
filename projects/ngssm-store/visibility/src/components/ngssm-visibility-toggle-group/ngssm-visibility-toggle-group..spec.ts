import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonToggleHarness } from '@angular/material/button-toggle/testing';

import { StoreMock, provideNgssmStoreTesting } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';

import { NgssmVisibilityToggleGroup } from './ngssm-visibility-toggle-group';
import { NgssmVisibilityStateSpecification } from '../../state';
import { NgssmVisibilityActionType, ToggleElementVisibilityAction } from '../../actions';

describe('NgssmVisibilityToggleGroup', () => {
  let component: NgssmVisibilityToggleGroup;
  let fixture: ComponentFixture<NgssmVisibilityToggleGroup>;
  let storeMock: StoreMock;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NgssmVisibilityToggleGroup],
      providers: [provideNgssmStoreTesting()],
      teardown: { destroyAfterEach: false }
    });
    fixture = TestBed.createComponent(NgssmVisibilityToggleGroup);
    fixture.nativeElement.style['min-height'] = '300px';
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;

    storeMock = TestBed.inject(Store) as unknown as StoreMock;

    storeMock.stateValue = {
      ...storeMock.stateValue,
      [NgssmVisibilityStateSpecification.featureStateKey]: NgssmVisibilityStateSpecification.initialState
    };

    fixture.componentRef.setInput('items', [
      {
        label: 'Left',
        key: 'left-value'
      },
      {
        label: 'Right',
        key: 'right-value'
      }
    ]);

    fixture.detectChanges();
    await fixture.whenStable();

    vi.spyOn(storeMock, 'dispatchAction');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should dispatch an action of type ${NgssmVisibilityActionType.toggleElementVisibility}' when cliking on left button`, async () => {
    const element = await loader.getHarness(MatButtonToggleHarness.with({ selector: '#left-value' }));

    await element.toggle();

    expect(storeMock.dispatchAction).toHaveBeenCalledWith(new ToggleElementVisibilityAction('left-value'));
  });

  it(`should render a check indicator when hideMultipleSelectionIndicator is false and itme is selected`, async () => {
    const element = await loader.getHarness(MatButtonToggleHarness.with({ selector: '#left-value' }));

    await element.toggle();

    const check = fixture.debugElement.query(By.css('mat-pseudo-checkbox'));
    expect(check).toBeTruthy();
  });

  it(`should not render a check indicator when hideMultipleSelectionIndicator is true and item is selected`, async () => {
    fixture.componentRef.setInput('hideMultipleSelectionIndicator', true);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = await loader.getHarness(MatButtonToggleHarness.with({ selector: '#left-value' }));

    await element.toggle();

    const check = fixture.debugElement.query(By.css('mat-pseudo-checkbox'));
    expect(check).toBeFalsy();
  });
});
