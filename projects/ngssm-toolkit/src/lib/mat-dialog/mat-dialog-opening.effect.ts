import { EnvironmentInjector, Inject, Injectable, Optional, runInInjectionContext } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Effect, State, Action, ActionDispatcher } from 'ngssm-store';

import { NGSSM_MAT_DIALOG_CONFIG, NgssmMatDialogConfig } from './ngssm-mat-dialog-config';

interface ExtendedConfig {
  config: NgssmMatDialogConfig;
  dialog?: MatDialogRef<unknown, unknown>;
}

@Injectable()
export class MatDialogOpeningEffect implements Effect {
  private readonly extendedConfigs: ExtendedConfig[];

  public readonly processedActions: string[] = [];

  constructor(
    @Inject(NGSSM_MAT_DIALOG_CONFIG) @Optional() private configs: NgssmMatDialogConfig[],
    private matDialog: MatDialog,
    private injector: EnvironmentInjector
  ) {
    const allActions = (this.configs ?? []).flatMap((c) => [c.openingAction, ...c.closingActions]);
    const actions = new Set<string>(allActions);
    this.processedActions.push(...actions);
    this.extendedConfigs = (this.configs ?? []).map((c) => ({
      config: c
    }));
  }

  public processAction(actionDispatcher: ActionDispatcher, state: State, action: Action): void {
    this.processActionAsClosingOne(action);
    this.processActionAsOpeningOne(state, action);
  }

  private processActionAsOpeningOne(state: State, action: Action): void {
    const extendedConfig = this.extendedConfigs.find((c) => c.config.openingAction === action.type);
    if (extendedConfig) {
      const beforeOpeningDialog = extendedConfig.config.beforeOpeningDialog;
      if (beforeOpeningDialog) {
        runInInjectionContext(this.injector, () => beforeOpeningDialog(state));
      }
      extendedConfig.dialog = this.matDialog.open(extendedConfig.config.component, extendedConfig.config.matDialogConfig);
    }
  }

  private processActionAsClosingOne(action: Action): void {
    const extendedConfigs = this.extendedConfigs.filter((c) => c.config.closingActions.includes(action.type));
    extendedConfigs.forEach((config) => {
      config.dialog?.close();
      config.dialog = undefined;
    });
  }
}
