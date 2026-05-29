import { computed, inject, Signal } from '@angular/core';
import { Store } from 'ngssm-store';

import { CachedItemStatus } from './model';
import { selectNgssmCachedItem } from './state';

export interface NgssmCachedItemSignal<T = unknown> {
  key: string;
  value: Signal<T>;
}

export type NgssmCachedItemSignalType = 'item' | 'status' | 'error';

export interface NgssmCachedItemSignalOptions<T = unknown> {
  type?: NgssmCachedItemSignalType;
  defaultValue?: T;
}

export const cachedItemToSignal = <T = unknown>(key: string, options?: NgssmCachedItemSignalOptions<T>): NgssmCachedItemSignal<T> => {
  const store = inject(Store);

  const usedOptions = options ?? { type: 'item' };
  if (!usedOptions.type) {
    usedOptions.type = 'item';
  }

  switch (usedOptions.type) {
    case 'status':
      return {
        key,
        value: computed(
          () => selectNgssmCachedItem(store.state(), key)?.status ?? options?.defaultValue ?? CachedItemStatus.notSet
        ) as Signal<T>
      };

    case 'error':
      return {
        key,
        value: computed(() => selectNgssmCachedItem(store.state(), key)?.error ?? options?.defaultValue) as Signal<T>
      };

    case 'item':
      return {
        key,
        value: computed(() => selectNgssmCachedItem<T>(store.state(), key)?.item ?? options?.defaultValue) as Signal<T>
      };
  }
};
