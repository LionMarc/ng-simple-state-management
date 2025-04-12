import { inject } from '@angular/core';

import { Store } from 'ngssm-store';

import { selectNavigationState } from '../state';

export const isNavigationLocked = (): boolean => {
  const state = inject(Store).state();
  return selectNavigationState(state).navigationLocked;
};

export const isNavigationUnLocked = (): boolean => {
  const state = inject(Store).state();
  return !selectNavigationState(state).navigationLocked;
};
