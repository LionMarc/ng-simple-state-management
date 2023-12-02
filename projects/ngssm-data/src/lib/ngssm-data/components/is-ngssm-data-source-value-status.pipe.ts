import { Pipe, PipeTransform } from '@angular/core';

import { State } from 'ngssm-store';

import { NgssmDataSourceValueStatus } from '../model';
import { selectNgssmDataSourceValue } from '../state';

@Pipe({
  name: 'isNgssmDataSourceValueStatus',
  standalone: true
})
export class IsNgssmDataSourceValueStatusPipe implements PipeTransform {
  public transform(value: State, ...args: string[]): unknown {
    const key = args[0];
    const status = args[1] as NgssmDataSourceValueStatus;
    return selectNgssmDataSourceValue(value, key).status === status;
  }
}
