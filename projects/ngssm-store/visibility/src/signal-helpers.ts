import { Signal } from '@angular/core';

import { createSignal } from 'ngssm-store';

import { selectNgssmVisibilityState } from './state';

/**
 * Represents the visibility state of a specific element.
 * - key: The unique identifier for the element.
 * - visible: A signal that emits the visibility status (true if visible, false otherwise).
 */
export interface ElementVisibility {
  key: string;
  visible: Signal<boolean>;
}

// Creates a signal allowing to listen to changes in element visibility.
export const isElementVisible = (elementKey: string): ElementVisibility => ({
  key: elementKey,
  visible: createSignal((state) => selectNgssmVisibilityState(state).elements[elementKey] === true)
});
