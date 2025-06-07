import { inject, Injectable, Provider } from '@angular/core';
import { Logger } from 'ngssm-store';

@Injectable()
export class FeatureStateRegistrator {
  private readonly logger = inject(Logger);

  constructor() {
    console.log('CALLED - 1');
    this.logger.debug('CALLED');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const provideFeatureState = (featureStateKey: string, defaultValue: object): Provider => {
  console.log('CALLED');
  return {
    provide: FeatureStateRegistrator,
    multi: true,
    useFactory: () => new FeatureStateRegistrator(),
    deps: [Logger]
  };
};
