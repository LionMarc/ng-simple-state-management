/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { NgssmConfirmationDialogService } from './ngssm-confirmation-dialog.service';
import { NgssmConfirmationDialogComponent } from './ngssm-confirmation-dialog/ngssm-confirmation-dialog.component';

class MatDialogRefMock {
  public subject = new Subject<void>();

  public afterClosed() {
    return this.subject;
  }
}

describe('NgssmConfirmationDialogService', () => {
  let service: NgssmConfirmationDialogService;
  let matDialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MatDialogModule] });
    service = TestBed.inject(NgssmConfirmationDialogService);
    matDialog = TestBed.inject(MatDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`should open the confirmation dialog when calling the method displayConfirmationDialog`, () => {
    const dialog = new MatDialogRefMock();
    spyOn(matDialog, 'open').and.returnValue(dialog as any);

    service.displayConfirmationDialog({
      message: 'Testing message',
      cancelLabel: 'No, thnaks',
      submitLabel: 'Ok, do it',
      submitButtonColor: 'primary'
    });

    expect(matDialog.open).toHaveBeenCalledWith(NgssmConfirmationDialogComponent, {
      disableClose: true,
      data: {
        message: 'Testing message',
        cancelLabel: 'No, thnaks',
        submitLabel: 'Ok, do it',
        submitButtonColor: 'primary'
      },
      minWidth: undefined,
      minHeight: undefined
    });
  });
});
