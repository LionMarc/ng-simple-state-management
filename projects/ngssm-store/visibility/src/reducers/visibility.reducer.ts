import { Injectable } from '@angular/core';

import { Spec } from 'immutability-helper';

import { Reducer, State, Action } from 'ngssm-store';

import {
  DefineElementsGroupAction,
  HideElementAction,
  NgssmVisibilityActionType,
  ShowElementAction,
  ToggleElementVisibilityAction
} from '../actions';
import { selectNgssmVisibilityState, updateNgssmVisibilityState } from '../state';

@Injectable()
export class VisibilityReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmVisibilityActionType.toggleElementVisibility,
    NgssmVisibilityActionType.showElement,
    NgssmVisibilityActionType.hideElement,
    NgssmVisibilityActionType.defineElementsGroup
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmVisibilityActionType.toggleElementVisibility: {
        const toggleVisibilityAction = action as ToggleElementVisibilityAction;
        if (selectNgssmVisibilityState(state).elements[toggleVisibilityAction.elementKey] === true) {
          return updateNgssmVisibilityState(state, {
            elements: {
              [toggleVisibilityAction.elementKey]: { $set: false }
            }
          });
        }

        return this.setElementVisible(state, toggleVisibilityAction.elementKey);
      }

      case NgssmVisibilityActionType.showElement: {
        const showAction = action as ShowElementAction;
        return this.setElementVisible(state, showAction.elementKey);
      }

      case NgssmVisibilityActionType.hideElement: {
        const hideAction = action as HideElementAction;
        return updateNgssmVisibilityState(state, {
          elements: {
            [hideAction.elementKey]: { $set: false }
          }
        });
      }

      case NgssmVisibilityActionType.defineElementsGroup: {
        const defineElementsGroupAction = action as DefineElementsGroupAction;
        const keys = [...defineElementsGroupAction.elementKeys];
        keys.sort();
        if (this.groupExists(keys, selectNgssmVisibilityState(state).elementsGroups)) {
          break;
        }

        return updateNgssmVisibilityState(state, {
          elementsGroups: { $push: [keys] }
        });
      }
    }

    return state;
  }

  private groupExists(keys: string[], groups: string[][]): boolean {
    const index = groups.findIndex((group) => {
      return group.length === keys.length && group.findIndex((k, i) => k !== keys[i]) === -1;
    });
    return index !== -1;
  }

  private getElementsKeysGroupedWith(key: string, groups: string[][]): string[] {
    const keys = groups.filter((g) => g.includes(key)).flatMap((g) => g);
    const distinctKeys = new Set<string>(keys);
    distinctKeys.delete(key);
    return [...distinctKeys];
  }

  private setElementVisible(state: State, key: string): State {
    const elementsCommand: Spec<Record<string, boolean>, never> = {
      [key]: { $set: true }
    };

    const associatedElements = this.getElementsKeysGroupedWith(key, selectNgssmVisibilityState(state).elementsGroups);
    associatedElements.forEach((el) => {
      elementsCommand[el] = { $set: false };
    });

    return updateNgssmVisibilityState(state, {
      elements: elementsCommand
    });
  }
}
