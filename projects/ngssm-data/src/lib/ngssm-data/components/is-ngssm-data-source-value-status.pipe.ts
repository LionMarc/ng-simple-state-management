import { Pipe, PipeTransform } from '@angular/core';

import { State } from 'ngssm-store';

import { NgssmDataSourceValueStatus } from '../model';
import { selectNgssmDataSourceValue } from '../selectors';

@Pipe({
  name: 'isNgssmDataSourceValueStatus'
})
export class IsNgssmDataSourceValueStatusPipe implements PipeTransform {
  public transform(value: State, ...args: string[]): boolean {
    const key = args[0];
    const expectedStatuses = args.slice(1).map((a) => a as NgssmDataSourceValueStatus);
    const itemStatus = selectNgssmDataSourceValue(value, key).status;
    return expectedStatuses.includes(itemStatus);
  }
}
