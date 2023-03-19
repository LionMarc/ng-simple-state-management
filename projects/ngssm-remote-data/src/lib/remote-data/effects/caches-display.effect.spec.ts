import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { StoreMock } from 'ngssm-store';

import { RemoteDataActionType } from '../actions';
import { NgssmCachesComponent } from '../components';
import { CachesDisplayEffect } from './caches-display.effect';

class MatDialogRefMock {
  public close() {}
}

describe('CachesDisplayEffect', () => {
  let effect: CachesDisplayEffect;
  let store: StoreMock;
  let matDialog: MatDialog;
  let dialog: MatDialogRefMock;

  beforeEach(() => {
    store = new StoreMock({});
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [CachesDisplayEffect]
    });
    effect = TestBed.inject(CachesDisplayEffect);
    matDialog = TestBed.inject(MatDialog);
    dialog = new MatDialogRefMock();
    spyOn(matDialog, 'open').and.returnValue(dialog as any);
  });

  [RemoteDataActionType.displayCaches, RemoteDataActionType.closeCachesComponent].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(effect.processedActions).toContain(actionType);
    });
  });

  it(`should display the NgssmCachesComponent dialog when processing action of type '${RemoteDataActionType.displayCaches}'`, () => {
    effect.processAction(store as any, store.state$.getValue(), { type: RemoteDataActionType.displayCaches });

    expect(matDialog.open).toHaveBeenCalledWith(NgssmCachesComponent, {
      disableClose: true
    });
  });

  it(`should close the NgssmCachesComponent dialog when processing action of type '${RemoteDataActionType.closeCachesComponent}'`, () => {
    effect.processAction(store as any, store.state$.getValue(), { type: RemoteDataActionType.displayCaches });

    spyOn(dialog, 'close');

    effect.processAction(store as any, store.state$.getValue(), { type: RemoteDataActionType.closeCachesComponent });

    expect(dialog.close).toHaveBeenCalled();
  });
});
