import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { provideEffects } from 'ngssm-store';

import { MatDialogOpeningEffect } from './mat-dialog-opening.effect';

export interface ProvideNgssmMatDialog {}

export const provideNgssmMatDialog = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideEffects(MatDialogOpeningEffect)]);
};
