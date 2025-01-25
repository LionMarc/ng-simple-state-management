import { Provider } from '@angular/core';
import { FormControl} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class DefaultErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return !!(control && control.invalid);
  }
}

export const useDefaultErrorStateMatcher: Provider = { provide: ErrorStateMatcher, useClass: DefaultErrorStateMatcher };
