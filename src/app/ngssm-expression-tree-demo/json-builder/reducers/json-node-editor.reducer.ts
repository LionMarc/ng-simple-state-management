import { Injectable, Provider } from '@angular/core';

import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';

import { JsonBuilderActionType, NewPropertyAction } from '../actions';
import { getDefaultJsonNodeEditor, updateJsonBuilderState } from '../state';

@Injectable()
export class JsonNodeEditorReducer implements Reducer {
  public readonly processedActions: string[] = [JsonBuilderActionType.newProperty, JsonBuilderActionType.closeJsonNodeEditor];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case JsonBuilderActionType.newProperty: {
        const newPropertyAction = action as NewPropertyAction;
        return updateJsonBuilderState(state, {
          jsonNodeEditor: {
            treeId: { $set: newPropertyAction.treeId },
            nodeId: { $set: newPropertyAction.parentNodeId }
          }
        });
      }

      case JsonBuilderActionType.closeJsonNodeEditor: {
        return updateJsonBuilderState(state, {
          jsonNodeEditor: { $set: getDefaultJsonNodeEditor() }
        });
      }
    }

    return state;
  }
}

export const jsonNodeEditorReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: JsonNodeEditorReducer,
  multi: true
};
