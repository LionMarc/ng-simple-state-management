import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { NgssmNotificationErrorComponent } from './ngssm-notification-error/ngssm-notification-error.component';
import { NgssmNotificationSuccessComponent } from './ngssm-notification-success/ngssm-notification-success.component';
import { NgssmNotifierService } from './ngssm-notifier.service';

describe('NgssmNotifierService', () => {
  let service: NgssmNotifierService;
  let snackbar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MatSnackBarModule] });
    service = TestBed.inject(NgssmNotifierService);
    snackbar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should display a NgssmNotificationErrorComponent when displaying an error', () => {
    spyOn(snackbar, 'openFromComponent');

    service.notifyError('Error message');

    expect(snackbar.openFromComponent).toHaveBeenCalledWith(NgssmNotificationErrorComponent, {
      panelClass: 'ngssm-notification-panel',
      data: 'Error message'
    });
  });

  it('should display a NgssmNotificationSuccessComponent when displaying success', () => {
    spyOn(snackbar, 'openFromComponent');

    service.notifySuccess('Success message');

    expect(snackbar.openFromComponent).toHaveBeenCalledWith(NgssmNotificationSuccessComponent, {
      panelClass: 'ngssm-notification-panel',
      data: 'Success message'
    });
  });
});
