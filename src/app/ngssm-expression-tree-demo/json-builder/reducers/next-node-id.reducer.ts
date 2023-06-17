import { Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { JsonBuilderActionType } from '../actions';
import { updateJsonBuilderState } from '../state';

@Injectable()
export class NextNodeIdReducer implements Reducer {
  public readonly processedActions: string[] = [JsonBuilderActionType.incrementNextNodeId];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case JsonBuilderActionType.incrementNextNodeId: {
        return updateJsonBuilderState(state, {
          nextNodeId: { $apply: (v) => v + 1 }
        });
      }
    }
    return state;
  }
}
