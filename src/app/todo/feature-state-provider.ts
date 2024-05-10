import { Injectable, Provider } from '@angular/core';
import { Logger } from 'ngssm-store';

@Injectable()
export class FeatureStateRegistrator {
  constructor(private logger: Logger) {
    console.log('CALLED - 1');
    this.logger.debug('CALLED');
  }
}

export const provideFeatureState = (featureStateKey: string, defaultValue: object): Provider => {
  console.log('CALLED');
  return {
    provide: FeatureStateRegistrator,
    multi: true,
    useFactory: (logger: Logger) => new FeatureStateRegistrator(logger),
    deps: [Logger]
  };
};
