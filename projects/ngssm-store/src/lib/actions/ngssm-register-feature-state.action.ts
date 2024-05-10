import { Action } from '../action';
import { NgssmStoreActionType } from './ngssm-store-action-type';

export class NgssmRegisterFeatureStateAction implements Action {
  public readonly type: string = NgssmStoreActionType.registerFeatureState;

  constructor(
    public readonly featureStateKey: string,
    public readonly initialValue: object
  ) {}
}
