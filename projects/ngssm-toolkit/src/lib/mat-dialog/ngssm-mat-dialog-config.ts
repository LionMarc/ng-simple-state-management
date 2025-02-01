import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialogConfig } from '@angular/material/dialog';

import { State } from 'ngssm-store';

export interface NgssmMatDialogConfig<T = unknown, D = unknown> {
  openingAction: string;
  closingActions: string[];
  component: ComponentType<T>;
  matDialogConfig?: MatDialogConfig<D>;
  beforeOpeningDialog?: (state: State) => void;
}

export const NGSSM_MAT_DIALOG_CONFIG = new InjectionToken<NgssmMatDialogConfig>('NGSSM_MAT_DIALOG_CONFIG');

export const provideNgssmMatDialogConfigs = (...configs: NgssmMatDialogConfig[]): EnvironmentProviders => {
  return makeEnvironmentProviders(configs.map((config) => ({ provide: NGSSM_MAT_DIALOG_CONFIG, useValue: config, multi: true })));
};
