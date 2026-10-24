import { Action } from 'ngssm-store';

export enum NgssmAgGridActionType {
  setAgGridState = '[NgssmAgGridActionType] setAgGridState',
  setSelectedRows = '[NgssmAgGridActionType] setSelectedRows',
  clearSelectedRows = '[NgssmAgGridActionType] clearSelectedRows',
  saveColumnStatesOnDisk = '[NgssmAgGridActionType] saveColumnStatesOnDisk',
  restoreColumnStatesFromDisk = '[NgssmAgGridActionType] restoreColumnStatesFromDisk'
}

export class NgssmAgGridAction implements Action {
  constructor(
    public readonly type: string,
    public readonly gridId: string
  ) {}
}
