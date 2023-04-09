import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';
import { JsonNodeEditor, getDefaultJsonNodeEditor } from './json-node-editor';

export const selectJsonBuilderState = (state: State): JsonBuilderState =>
  state[JsonBuilderStateSpecification.featureStateKey] as JsonBuilderState;

export const updateJsonBuilderState = (state: State, command: Spec<JsonBuilderState, never>): State =>
  update(state, {
    [JsonBuilderStateSpecification.featureStateKey]: command
  });

export interface JsonBuilderState {
  nextNodeId: number;
  jsonNodeEditor: JsonNodeEditor;
}

@NgSsmFeatureState({
  featureStateKey: JsonBuilderStateSpecification.featureStateKey,
  initialState: JsonBuilderStateSpecification.initialState
})
export class JsonBuilderStateSpecification {
  public static readonly featureStateKey = 'json-builder-state';
  public static readonly initialState: JsonBuilderState = {
    nextNodeId: 0,
    jsonNodeEditor: getDefaultJsonNodeEditor()
  };
}
