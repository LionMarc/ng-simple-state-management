import { computed, inject, Signal } from '@angular/core';
import { State } from './state';
import { Store } from './store';

export const createSignal = <T = unknown>(selector: (state: State) => T): Signal<T> => {
  const store = inject(Store);
  return computed(() => selector(store.state()));
};
