import { HttpErrorResponse } from '@angular/common/http';

import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';
import { NgssmDataActionType } from './ngssm-data-action-type';
import { NgssmDataSourceValueStatus } from '../model';

export class NgssmSetDataSourceValueAction<TData = unknown> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly status: NgssmDataSourceValueStatus,
    public readonly value?: TData,
    public readonly httpErrorResponse?: HttpErrorResponse
  ) {
    super(NgssmDataActionType.setDataSourceValue, key);
  }
}
