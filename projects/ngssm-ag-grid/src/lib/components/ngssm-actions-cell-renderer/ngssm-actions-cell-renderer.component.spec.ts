import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatCard, MatCardActions, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { BehaviorSubject } from 'rxjs';

import { ICellRendererParams } from 'ag-grid-community';

import { NgssmActionsCellRendererParams } from './ngssm-actions-cell-renderer-params';
import { NgssmActionsCellRendererComponent } from './ngssm-actions-cell-renderer.component';
import { ActionPopupComponent } from './action-config';

interface TestingData {
  value: number;
}

@Component({
  selector: 'ngssm-testing-popup',
  template: `
    <mat-card class="flex-column-stretch">
      <mat-card-header>
        <mat-card-title>{{ title() }}</mat-card-title>
      </mat-card-header>
      <mat-card-actions>
        <button mat-button (click)="isPopupOpen.set(false)">Close</button>
      </mat-card-actions>
    </mat-card>
  `,
  imports: [MatCard, MatCardHeader, MatCardActions, MatCardTitle, MatButton]
})
class TestingPoupuComponent implements ActionPopupComponent<TestingData> {
  public readonly title = signal<string>('Popup Title');
  public isPopupOpen = signal(false);

  public init(popupRendered: WritableSignal<boolean>, params?: ICellRendererParams<TestingData, unknown>, popupParameter?: unknown): void {
    this.isPopupOpen = popupRendered;
    this.title.set(`${popupParameter}: ${params?.data?.value}`);
  }
}

describe('NgssmActionsCellRendererComponent', () => {
  let component: NgssmActionsCellRendererComponent;
  let fixture: ComponentFixture<NgssmActionsCellRendererComponent>;
  let loader: HarnessLoader;
  let rootLoader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgssmActionsCellRendererComponent, TestingPoupuComponent],
      teardown: { destroyAfterEach: false }
    });

    fixture = TestBed.createComponent(NgssmActionsCellRendererComponent);
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '300px';
    fixture.nativeElement.style['margin-top'] = '20px';
    loader = TestbedHarnessEnvironment.loader(fixture);
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should render a button per defined action`, () => {
    const cellRendererParams: NgssmActionsCellRendererParams = {
      actions: [
        {
          cssClass: 'fa-solid fa-pen-to-square'
        },
        {
          cssClass: 'fa-solid fa-rotate-left'
        },
        {
          cssClass: 'fa-solid fa-trash-can'
        }
      ]
    };

    component.agInit(cellRendererParams as unknown as ICellRendererParams);

    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.ngssm-actions-cell-button'));
    expect(buttons.length).toEqual(3);
  });

  describe(`when using a disabled function`, () => {
    let cellRendererParams: NgssmActionsCellRendererParams<TestingData> = {
      actions: []
    };

    beforeEach(() => {
      cellRendererParams = {
        actions: [
          {
            cssClass: 'fa-solid fa-pen-to-square',
            isDisabled: (params: ICellRendererParams<TestingData, unknown>) => (params.data?.value ?? -1) < 0
          }
        ]
      };
    });

    it(`should set button as disabled when value is negative`, async () => {
      component.agInit({
        ...cellRendererParams,
        data: {
          value: -6
        }
      } as unknown as ICellRendererParams);

      fixture.detectChanges();

      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#action_0' }));

      expect(await element.isDisabled()).toBeTrue();
    });

    it(`should not set button as disabled when value is positive`, async () => {
      component.agInit({
        ...cellRendererParams,
        data: {
          value: 6
        }
      } as unknown as ICellRendererParams);

      fixture.detectChanges();

      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#action_0' }));

      expect(await element.isDisabled()).toBeFalse();
    });
  });

  describe(`when using an observable for disabled status`, () => {
    let cellRendererParams: NgssmActionsCellRendererParams<TestingData> = {
      actions: []
    };

    const testingDisabled$ = new BehaviorSubject<boolean>(false);

    beforeEach(() => {
      cellRendererParams = {
        actions: [
          {
            cssClass: 'fa-solid fa-pen-to-square',
            isDisabled: testingDisabled$
          }
        ]
      };

      component.agInit({
        ...cellRendererParams
      } as unknown as ICellRendererParams);

      fixture.detectChanges();
    });

    it(`should set button as disabled when observable value is true`, async () => {
      testingDisabled$.next(true);
      fixture.detectChanges();

      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#action_0' }));

      expect(await element.isDisabled()).toBeTrue();
    });

    it(`should not set button as disabled when observable value is false`, async () => {
      testingDisabled$.next(false);
      fixture.detectChanges();

      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#action_0' }));

      expect(await element.isDisabled()).toBeFalse();
    });
  });

  describe(`when using a signal for disabled status`, () => {
    let cellRendererParams: NgssmActionsCellRendererParams<TestingData> = {
      actions: []
    };

    const testingDisabled = signal(false);

    beforeEach(() => {
      cellRendererParams = {
        actions: [
          {
            cssClass: 'fa-solid fa-pen-to-square',
            isDisabled: testingDisabled
          }
        ]
      };

      component.agInit({
        ...cellRendererParams
      } as unknown as ICellRendererParams);

      fixture.detectChanges();
    });

    it(`should set button as disabled when observable value is true`, async () => {
      testingDisabled.set(true);
      fixture.detectChanges();

      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#action_0' }));

      expect(await element.isDisabled()).toBeTrue();
    });

    it(`should not set button as disabled when observable value is false`, async () => {
      testingDisabled.set(false);
      fixture.detectChanges();

      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#action_0' }));

      expect(await element.isDisabled()).toBeFalse();
    });
  });

  describe(`when using a hidden function`, () => {
    let cellRendererParams: NgssmActionsCellRendererParams<TestingData> = {
      actions: []
    };

    beforeEach(() => {
      cellRendererParams = {
        actions: [
          {
            cssClass: 'fa-solid fa-pen-to-square',
            isHidden: (params: ICellRendererParams<TestingData, unknown>) => (params.data?.value ?? -1) < 0
          }
        ]
      };
    });

    it(`should not display button when value is negative`, () => {
      component.agInit({
        ...cellRendererParams,
        data: {
          value: -6
        }
      } as unknown as ICellRendererParams);

      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('#action_0'));

      expect(element).toBeFalsy();
    });

    it(`should display button when value is positive`, () => {
      component.agInit({
        ...cellRendererParams,
        data: {
          value: 6
        }
      } as unknown as ICellRendererParams);

      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('#action_0'));

      expect(element).toBeTruthy();
    });
  });

  describe(`when using an observable for hidden status`, () => {
    let cellRendererParams: NgssmActionsCellRendererParams<TestingData> = {
      actions: []
    };

    const testingHidden$ = new BehaviorSubject<boolean>(false);

    beforeEach(() => {
      cellRendererParams = {
        actions: [
          {
            cssClass: 'fa-solid fa-pen-to-square',
            isHidden: testingHidden$
          }
        ]
      };

      component.agInit({
        ...cellRendererParams
      } as unknown as ICellRendererParams);

      fixture.detectChanges();
    });

    it(`should not display button when observable value is true`, () => {
      testingHidden$.next(true);
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('#action_0'));

      expect(element).toBeFalsy();
    });

    it(`should display button when observable value is false`, () => {
      testingHidden$.next(false);
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('#action_0'));

      expect(element).toBeTruthy();
    });
  });

  describe(`when using a signal for hidden status`, () => {
    let cellRendererParams: NgssmActionsCellRendererParams<TestingData> = {
      actions: []
    };

    const testingHidden = signal<boolean>(false);

    beforeEach(() => {
      cellRendererParams = {
        actions: [
          {
            cssClass: 'fa-solid fa-pen-to-square',
            isHidden: testingHidden
          }
        ]
      };

      component.agInit({
        ...cellRendererParams
      } as unknown as ICellRendererParams);

      fixture.detectChanges();
    });

    it(`should not display button when observable value is true`, () => {
      testingHidden.set(true);
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('#action_0'));

      expect(element).toBeFalsy();
    });

    it(`should display button when observable value is false`, () => {
      testingHidden.set(false);
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('#action_0'));

      expect(element).toBeTruthy();
    });
  });

  describe('with a custom popup component', () => {
    let cellRendererParams: NgssmActionsCellRendererParams<TestingData> | ICellRendererParams = {
      actions: []
    };

    beforeEach(async () => {
      cellRendererParams = {
        actions: [
          {
            cssClass: 'fa-solid fa-trash-can',
            popupComponent: TestingPoupuComponent,
            popupParameter: 'Testing'
          }
        ],
        data: {
          value: 6
        }
      };

      component.agInit({
        ...cellRendererParams
      } as unknown as ICellRendererParams);

      fixture.detectChanges();

      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#action_0' }));

      await element.click();
    });

    it(`should render the popup component`, () => {
      const popup = document.querySelector('ngssm-testing-popup');
      expect(popup).toBeTruthy();
    });

    it(`should render the title with the current row data and the popup parameter`, async () => {
      const popup = await rootLoader.getHarness(MatCardHarness.with({ selector: 'ngssm-testing-popup mat-card' }));
      const title = await popup.getTitleText();
      expect(title).toBe('Testing: 6');
    });

    it(`should hide the popup when clicking on No button`, async () => {
      const popup = await rootLoader.getHarness(MatCardHarness.with({ selector: 'ngssm-testing-popup mat-card' }));
      const button = await popup.getHarness(MatButtonHarness.with({ text: 'Close' }));
      await button.click();
      const popup2 = document.querySelector('ngssm-testing-popup');
      expect(popup2).toBeFalsy();
    });
  });
});
