# State and feature state

The state is nothing else than a dictionary used to associate a _feature key_ to a _feature state_ object.

```javascript title="State"
--8<-- "projects/ngssm-store/src/lib/state.ts"
```

!!! Note

    The state must be immutable but, to keep it simple, the state remains a simple javascript object. This is the responsibility of the coder to guarantee immutability of the state.

## Defining a feature state - Legacy

The legacy way of providing a feature state is to use the decorator _NgSsmFeatureState_.

```javascript
--8<-- "projects/ngssm-store/src/lib/store.ts:15:19"
```

A feature state can be generated with schematics. For example:

```node
ng g ngssm-schematics:feature-state testFeatureState
```

with the generated file

```javascript hl_lines="13 13"
import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';

export const selectTestFeatureStateState = (state: State): TestFeatureStateState =>
  state[TestFeatureStateStateSpecification.featureStateKey] as TestFeatureStateState;

export const updateTestFeatureStateState = (state: State, command: Spec<TestFeatureStateState, never>): State =>
  update(state, {
    [TestFeatureStateStateSpecification.featureStateKey]: command
  });

export interface TestFeatureStateState {}

@NgSsmFeatureState({
  featureStateKey: TestFeatureStateStateSpecification.featureStateKey,
  initialState: TestFeatureStateStateSpecification.initialState
})
export class TestFeatureStateStateSpecification {
  public static readonly featureStateKey = 'test-feature-state-state';
  public static readonly initialState: TestFeatureStateState = {};
}
```

## Registering a feature state

The new way to register a feature state is driven by the need to associate a feature state to a component and so, to remove that state when the component is destroyed.

Two actions are provided to register and unregister feature state:

```typescript
--8<-- "projects/ngssm-store/src/lib/actions/ngssm-register-feature-state.action.ts"
--8<-- "projects/ngssm-store/src/lib/actions/ngssm-unregister-feature-state.action.ts:3"
```

When using a global feature state, one can use the function **provideNgssmFeatureState** as follows

```typescript
export const appConfig: ApplicationConfig = {
  providers: [provideNgssmFeatureState('my-feature-state', { description: 'something' })]
};
```

When using a feature state with a component lifetime, one can use the directive **ProvideNgssmFeatureStateDirective** as follows

```typescript
--8<-- "projects/ngssm-store/src/lib/feature-state/provide-ngssm-feature-state-directive-test.component.ts"
```
