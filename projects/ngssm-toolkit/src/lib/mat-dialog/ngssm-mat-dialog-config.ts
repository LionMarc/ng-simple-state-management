import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialogConfig } from '@angular/material/dialog';

export interface NgssmMatDialogConfig<T = any, D = any> {
  openingAction: string;
  closingActions: string[];
  component: ComponentType<T>;
  matDialogConfig?: MatDialogConfig<D>;
}

export const NGSSM_MAT_DIALOG_CONFIG = new InjectionToken<NgssmMatDialogConfig>('NGSSM_MAT_DIALOG_CONFIG');

export const provideNgssmMatDialogConfigs = (...configs: NgssmMatDialogConfig[]): EnvironmentProviders => {
  return makeEnvironmentProviders(configs.map((config) => ({ provide: NGSSM_MAT_DIALOG_CONFIG, useValue: config, multi: true })));
};
