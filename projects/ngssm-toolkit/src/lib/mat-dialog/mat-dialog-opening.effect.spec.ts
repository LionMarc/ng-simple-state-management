import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { StoreMock } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';

import { MatDialogOpeningEffect } from './mat-dialog-opening.effect';
import { provideNgssmMatDialogConfigs } from './ngssm-mat-dialog-config';

enum TestingActionType {
  openAction = '[TestingActionType] openAction',
  closeAction = '[TestingActionType] closeAction',
  edit = '[TestingActionType] edit',
  cancelEdition = '[TestingActionType] cancelEdition',
  submit = '[TestingActionType] submit',
  withfunction = '[TestingActionType] withfunction'
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

@Component({
  selector: 'ngssm-editor',
  standalone: true,
  imports: [CommonModule],
  template: ` nothing `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent {}

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
  let functionCalled = false;

  beforeEach(() => {
    store = new StoreMock({});
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        { provide: Store, useValue: store },
        MatDialogOpeningEffect,
        provideNgssmMatDialogConfigs(
          {
            openingAction: TestingActionType.openAction,
            closingActions: [TestingActionType.closeAction],
            component: DialogDemoComponent,
            matDialogConfig: {
              disableClose: true,
              height: '400px',
              width: '60vw'
            }
          },
          {
            openingAction: TestingActionType.edit,
            closingActions: [TestingActionType.cancelEdition, TestingActionType.submit],
            component: EditorComponent,
            matDialogConfig: {
              disableClose: true,
              height: '400px',
              width: '60vw'
            }
          },
          {
            openingAction: TestingActionType.withfunction,
            closingActions: [],
            component: EditorComponent,
            matDialogConfig: {
              disableClose: true,
              height: '400px',
              width: '60vw'
            },
            beforeOpeningDialog: () => {
              // To test inject in function
              const store = inject(Store);
              store.dispatchActionType('TESTING');
              functionCalled = true;
            }
          }
        )
      ]
    });
    effect = TestBed.inject(MatDialogOpeningEffect);
    matDialog = TestBed.inject(MatDialog);
    dialog = new MatDialogRefMock();
    spyOn(matDialog, 'open').and.returnValue(dialog as any);
    spyOn(dialog, 'close');
    functionCalled = false;
    spyOn(store, 'dispatchActionType');
  });

  [
    TestingActionType.openAction,
    TestingActionType.closeAction,
    TestingActionType.edit,
    TestingActionType.cancelEdition,
    TestingActionType.submit
  ].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(effect.processedActions).toContain(actionType);
    });
  });

  describe(`one action to close`, () => {
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

  describe(`multiple actions to close`, () => {
    it(`should open the editor when calling the action type '${TestingActionType.edit}'`, () => {
      effect.processAction(store as any, store.stateValue, { type: TestingActionType.edit });

      expect(matDialog.open).toHaveBeenCalledWith(EditorComponent, {
        disableClose: true,
        height: '400px',
        width: '60vw'
      });
    });

    [TestingActionType.cancelEdition, TestingActionType.submit].forEach((actionType) => {
      it(`should close the editor when calling the action type '${actionType}'`, () => {
        effect.processAction(store as any, store.stateValue, { type: TestingActionType.edit });

        effect.processAction(store as any, store.stateValue, { type: actionType });

        expect(dialog.close).toHaveBeenCalled();
      });
    });
  });

  describe(`with function to execute before opening dialog`, () => {
    it(`should open the dialog when calling the action type '${TestingActionType.withfunction}'`, () => {
      effect.processAction(store as any, store.stateValue, { type: TestingActionType.withfunction });

      expect(functionCalled).toBeTruthy();
      expect(store.dispatchActionType).toHaveBeenCalledWith('TESTING');
      expect(matDialog.open).toHaveBeenCalledWith(EditorComponent, {
        disableClose: true,
        height: '400px',
        width: '60vw'
      });
    });
  });
});
