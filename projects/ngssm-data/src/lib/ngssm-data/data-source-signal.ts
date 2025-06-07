import { computed, inject, Signal } from '@angular/core';
import { Store } from 'ngssm-store';

import { selectNgssmDataSourceValue } from './selectors';

export interface NgssmDataSourceSignal<T = unknown> {
  key: string;
  value: Signal<T>;
}

export type NgssmDataSourceSignalType = 'value' | 'status';

export interface NgssmDataSourceSignalOptions<T = unknown> {
  type?: NgssmDataSourceSignalType;
  defaultValue?: T;
}

export const dataSourceToSignal = <T = unknown>(key: string, options?: NgssmDataSourceSignalOptions<T>): NgssmDataSourceSignal<T> => {
  const store = inject(Store);

  const usedOptions = options ?? { type: 'value' };
  if (!usedOptions.type) {
    usedOptions.type = 'value';
  }

  switch (usedOptions.type) {
    case 'status':
      return {
        key,
        value: computed(() => selectNgssmDataSourceValue(store.state(), key)?.status ?? options?.defaultValue) as Signal<T>
      };

    case 'value':
      return {
        key,
        value: computed(() => selectNgssmDataSourceValue<T>(store.state(), key)?.value ?? options?.defaultValue) as Signal<T>
      };
  }
};
