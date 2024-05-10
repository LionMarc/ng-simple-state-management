import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideNgssmFeatureState } from 'ngssm-store';

export const provideNgssmFeatureStateDemo = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideNgssmFeatureState('ngssm-feature-state-demo', { description: 'feature state demo' })]);
};
