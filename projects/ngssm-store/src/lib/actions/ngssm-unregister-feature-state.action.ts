import { Action } from '../action';
import { NgssmStoreActionType } from './ngssm-store-action-type';

export class NgssmUnregisterFeatureStateAction implements Action {
  public readonly type: string = NgssmStoreActionType.unregisterFeatureState;

  constructor(public readonly featureStateKey: string) {}
}
