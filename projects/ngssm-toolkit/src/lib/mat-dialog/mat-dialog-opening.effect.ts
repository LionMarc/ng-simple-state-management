import { EnvironmentInjector, Inject, Injectable, Optional, runInInjectionContext } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Effect, Store, State, Action, Logger } from 'ngssm-store';

import { NGSSM_MAT_DIALOG_CONFIG, NgssmMatDialogConfig } from './ngssm-mat-dialog-config';

interface ExtendedConfig {
  config: NgssmMatDialogConfig;
  dialog?: MatDialogRef<any, any>;
}

@Injectable()
export class MatDialogOpeningEffect implements Effect {
  private readonly extendedConfigs: ExtendedConfig[];

  public readonly processedActions: string[] = [];

  constructor(
    @Inject(NGSSM_MAT_DIALOG_CONFIG) @Optional() private configs: NgssmMatDialogConfig[],
    private logger: Logger,
    private matDialog: MatDialog,
    private injector: EnvironmentInjector
  ) {
    this.processedActions.push(...(this.configs ?? []).flatMap((c) => [c.openingAction, ...c.closingActions]));
    this.extendedConfigs = (this.configs ?? []).map((c) => ({
      config: c
    }));
  }

  public processAction(_store: Store, state: State, action: Action): void {
    const extendedConfig = this.extendedConfigs.find(
      (c) => c.config.openingAction === action.type || c.config.closingActions.includes(action.type)
    );

    if (!extendedConfig) {
      this.logger.error(`Need to process action '${action.type}' with no associated config.`);
      return;
    }

    if (action.type === extendedConfig.config.openingAction) {
      const beforeOpeningDialog = extendedConfig.config.beforeOpeningDialog;
      if (beforeOpeningDialog) {
        runInInjectionContext(this.injector, () => beforeOpeningDialog(state));
      }
      extendedConfig.dialog = this.matDialog.open(extendedConfig.config.component, extendedConfig.config.matDialogConfig);
      return;
    }

    extendedConfig.dialog?.close();
    extendedConfig.dialog = undefined;
  }
}
