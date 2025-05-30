import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { NgssmConfirmationDialogConfig } from '../ngssm-confirmation-dialog-config';
import { NgssmConfirmationDialogComponent } from './ngssm-confirmation-dialog.component';

describe('NgssmConfirmationDialogComponent', () => {
  let component: NgssmConfirmationDialogComponent;
  let fixture: ComponentFixture<NgssmConfirmationDialogComponent>;
  let loader: HarnessLoader;
  const config: NgssmConfirmationDialogConfig = {
    message: 'Are you sure you want to delete the item?',
    cancelLabel: 'No',
    submitLabel: 'Yes, delete it',
    submitButtonColor: 'warn'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgssmConfirmationDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: config }],
      teardown: { destroyAfterEach: true }
    });

    fixture = TestBed.createComponent(NgssmConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '200px';
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should render the message`, () => {
    const element = fixture.debugElement.query(By.css('.message-container'));

    expect(element.nativeElement.innerHTML).toContain('Are you sure you want to delete the item?');
  });

  it(`should render the cancel button`, async () => {
    const element = await loader.getHarness(MatButtonHarness.with({ selector: '#cancelButton' }));

    const label = await element.getText();

    expect(label).toEqual('No');
  });

  it(`should render the submit button`, async () => {
    const element = await loader.getHarness(MatButtonHarness.with({ selector: '#submitButton' }));

    const label = await element.getText();

    expect(label).toEqual('Yes, delete it');
  });
});
