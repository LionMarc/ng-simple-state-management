import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Effect, State, Action, ActionDispatcher } from 'ngssm-store';
import { RemoteDataActionType } from '../actions';
import { NgssmCachesComponent } from '../components';

@Injectable()
export class CachesDisplayEffect implements Effect {
  private readonly matDialog = inject(MatDialog);

  private dialog: MatDialogRef<NgssmCachesComponent> | undefined;

  public readonly processedActions: string[] = [RemoteDataActionType.displayCaches, RemoteDataActionType.closeCachesComponent];

  public processAction(actiondispatcher: ActionDispatcher, state: State, action: Action): void {
    switch (action.type) {
      case RemoteDataActionType.displayCaches: {
        this.dialog = this.matDialog.open(NgssmCachesComponent, {
          disableClose: true
        });

        break;
      }

      case RemoteDataActionType.closeCachesComponent: {
        this.dialog?.close();
        this.dialog = undefined;

        break;
      }
    }
  }
}
