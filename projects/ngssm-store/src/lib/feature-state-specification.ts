export interface FeatureStateSpecification {
  readonly featureStateKey: string;
  readonly initialState: { [key: string]: any };
}
