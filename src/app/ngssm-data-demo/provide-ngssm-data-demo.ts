import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideNgssmDataSource } from 'ngssm-data';
import { teamsKey, teamsLoader } from './model';

export const provideNgssmDataDemo = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideNgssmDataSource(teamsKey, teamsLoader, 60)]);
};
