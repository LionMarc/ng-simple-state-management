import { Component } from '@angular/core';

import { FeatureStateSpecification, NGSSM_COMPONENT_WITH_FEATURE_STATE, ProvideNgssmFeatureStateDirective } from 'ngssm-store';

@Component({
  selector: 'ngssm-component-with-feature-state',
  imports: [],
  templateUrl: './component-with-feature-state.component.html',
  hostDirectives: [ProvideNgssmFeatureStateDirective],
  providers: [
    {
      provide: NGSSM_COMPONENT_WITH_FEATURE_STATE,
      multi: false,
      useExisting: ComponentWithFeatureStateComponent
    }
  ]
})
export class ComponentWithFeatureStateComponent implements FeatureStateSpecification {
  private static nextId = 1;

  featureStateKey = `my-component-${ComponentWithFeatureStateComponent.nextId++}`;
  initialState = {
    description: 'Feature state with the smae lifetime of the associated component'
  };
}
