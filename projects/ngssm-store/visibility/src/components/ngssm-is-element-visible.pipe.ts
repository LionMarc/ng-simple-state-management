import { Pipe, PipeTransform } from '@angular/core';
import { State } from 'ngssm-store';
import { selectNgssmVisibilityState } from '../state';

@Pipe({
  name: 'ngssmIsElementVisible'
})
export class NgssmIsElementVisiblePipe implements PipeTransform {
  public transform(value: State, ...args: string[]): boolean {
    return selectNgssmVisibilityState(value).elements[args[0]] === true;
  }
}
