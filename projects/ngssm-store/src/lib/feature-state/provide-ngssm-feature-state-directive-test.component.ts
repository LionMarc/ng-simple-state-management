import { Component } from '@angular/core';
import { ProvideNgssmFeatureStateDirective } from './provide-ngssm-feature-state.directive';
import { FeatureStateSpecification, NGSSM_COMPONENT_WITH_FEATURE_STATE } from './feature-state-specification';

@Component({
  selector: 'ngssm-provide-ngssm-feature-state-directive-test',
  imports: [],
  template: ` <p>provide-ngssm-feature-state-directive-test works!</p> `,
  styles: ``,
  hostDirectives: [ProvideNgssmFeatureStateDirective],
  providers: [
    {
      provide: NGSSM_COMPONENT_WITH_FEATURE_STATE,
      multi: false,
      useExisting: ProvideNgssmFeatureStateDirectiveTestComponent
    }
  ]
})
export class ProvideNgssmFeatureStateDirectiveTestComponent implements FeatureStateSpecification {
  featureStateKey = 'my-feature-state';

  initialState = {
    id: 'testing'
  };
}
