import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { StoreMock } from 'ngssm-store/testing';

import { MatDialogOpeningEffect } from './mat-dialog-opening.effect';
import { provideNgssmMatDialogConfigs } from './ngssm-mat-dialog-config';

enum TestingActionType {
  openAction = '[TestingActionType] openAction',
  closeAction = '[TestingActionType] closeAction'
}

@Component({
  selector: 'ngssm-testing',
  standalone: true,
  imports: [CommonModule],
  template: ` nothing `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogDemoComponent {}

class MatDialogRefMock {
  public close(): void {
    // nothing to do here
  }
}

describe('MatDialogOpeningEffect', () => {
  let effect: MatDialogOpeningEffect;
  let matDialog: MatDialog;
  let dialog: MatDialogRefMock;
  let store: StoreMock;

  beforeEach(() => {
    store = new StoreMock({});
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        MatDialogOpeningEffect,
        provideNgssmMatDialogConfigs({
          openingAction: TestingActionType.openAction,
          closingAction: TestingActionType.closeAction,
          component: DialogDemoComponent,
          matDialogConfig: {
            disableClose: true,
            height: '400px',
            width: '60vw'
          }
        })
      ]
    });
    effect = TestBed.inject(MatDialogOpeningEffect);
    matDialog = TestBed.inject(MatDialog);
    dialog = new MatDialogRefMock();
    spyOn(matDialog, 'open').and.returnValue(dialog as any);
    spyOn(dialog, 'close');
  });

  [TestingActionType.openAction, TestingActionType.closeAction].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(effect.processedActions).toContain(actionType);
    });
  });

  it(`should open the dialog when calling the action type '${TestingActionType.openAction}'`, () => {
    effect.processAction(store as any, store.stateValue, { type: TestingActionType.openAction });

    expect(matDialog.open).toHaveBeenCalledWith(DialogDemoComponent, {
      disableClose: true,
      height: '400px',
      width: '60vw'
    });
  });

  it(`should close the dialog when calling the action type '${TestingActionType.closeAction}'`, () => {
    effect.processAction(store as any, store.stateValue, { type: TestingActionType.openAction });

    effect.processAction(store as any, store.stateValue, { type: TestingActionType.closeAction });

    expect(dialog.close).toHaveBeenCalled();
  });
});
