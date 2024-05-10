import { Injectable } from '@angular/core';

import update from 'immutability-helper';

import { Reducer } from '../reducer';
import { NgssmRegisterFeatureStateAction, NgssmStoreActionType, NgssmUnregisterFeatureStateAction } from '../actions';
import { State } from '../state';
import { Action } from '../action';

@Injectable()
export class FeatureStateReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmStoreActionType.registerFeatureState, NgssmStoreActionType.unregisterFeatureState];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmStoreActionType.registerFeatureState: {
        const registerFeatureStateAction = action as NgssmRegisterFeatureStateAction;
        return update(state, {
          [registerFeatureStateAction.featureStateKey]: { $set: registerFeatureStateAction.initialValue }
        });
      }

      case NgssmStoreActionType.unregisterFeatureState: {
        const unregisterFeatureStateAction = action as NgssmUnregisterFeatureStateAction;
        return update(state, {
          $unset: [unregisterFeatureStateAction.featureStateKey]
        });
      }
    }

    return state;
  }
}
