import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { ICellRendererParams } from 'ag-grid-community';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { BehaviorSubject } from 'rxjs';

import { NgssmActionsCellRendererParams } from './ngssm-actions-cell-renderer-params';
import { NgssmActionsCellRendererComponent } from './ngssm-actions-cell-renderer.component';

interface TestingData {
  value: number;
}

describe('NgssmActionsCellRendererComponent', () => {
  let component: NgssmActionsCellRendererComponent;
  let fixture: ComponentFixture<NgssmActionsCellRendererComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgssmActionsCellRendererComponent],
      imports: [MatButtonModule, MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmActionsCellRendererComponent);
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '300px';
    fixture.nativeElement.style['margin-top'] = '20px';
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should render a button per defined action`, async () => {
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

    component.agInit(cellRendererParams as any);

    fixture.detectChanges();
    await fixture.whenStable();

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
            isDisabled: (params: ICellRendererParams<TestingData, TestingData>) => (params.data?.value ?? -1) < 0
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
      } as any);

      fixture.detectChanges();
      await fixture.whenStable();

      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#action_0' }));

      expect(await element.isDisabled()).toBeTrue();
    });

    it(`should not set button as disabled when value is positive`, async () => {
      component.agInit({
        ...cellRendererParams,
        data: {
          value: 6
        }
      } as any);

      fixture.detectChanges();
      await fixture.whenStable();

      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#action_0' }));

      expect(await element.isDisabled()).toBeFalse();
    });
  });

  describe(`when using an observable for disabled status`, () => {
    let cellRendererParams: NgssmActionsCellRendererParams<TestingData> = {
      actions: []
    };

    const testingDisabled$ = new BehaviorSubject<boolean>(false);

    beforeEach(async () => {
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
      } as any);

      fixture.detectChanges();
      await fixture.whenStable();
    });

    it(`should set button as disabled when observable value is true`, async () => {
      testingDisabled$.next(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#action_0' }));

      expect(await element.isDisabled()).toBeTrue();
    });

    it(`should not set button as disabled when observable value is false`, async () => {
      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#action_0' }));

      expect(await element.isDisabled()).toBeFalse();
    });
  });
});
