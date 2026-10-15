import { computed, CreateComputedOptions, inject, Signal } from '@angular/core';
import { State } from './state';
import { Store } from './store';

/**
 * Creates a computed signal from the store state using the provided selector.
 * @param selector Selects a value from the current store state.
 * @param options Options passed to Angular's computed signal.
 */
export const createSignal = <T = unknown>(selector: (state: State) => T, options?: CreateComputedOptions<T>): Signal<T> => {
  const store = inject(Store);
  return computed(() => selector(store.state()), options);
};
