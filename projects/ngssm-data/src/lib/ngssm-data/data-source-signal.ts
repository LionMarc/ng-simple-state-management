import { computed, inject, Signal } from '@angular/core';
import { Store } from 'ngssm-store';
import { selectNgssmDataSourceValue } from './state';

export interface NgssmDataSourceSignal<T = unknown> {
  key: string;
  value: Signal<T>;
}

export type NgssmDataSourceSignalType = 'value' | 'status';

export interface NgssmDataSourceSignalOptions {
  type: NgssmDataSourceSignalType;
}

export const dataSourceToSignal = <T = unknown>(key: string, options?: NgssmDataSourceSignalOptions): NgssmDataSourceSignal<T> => {
  const store = inject(Store);

  const usedOptions = options ?? { type: 'value' };
  switch (usedOptions.type) {
    case 'status':
      return {
        key,
        value: computed(() => selectNgssmDataSourceValue(store.state(), key)?.status) as Signal<T>
      };

    case 'value':
      return {
        key,
        value: computed(() => selectNgssmDataSourceValue<T>(store.state(), key)?.value) as Signal<T>
      };
  }
};
