import { InjectionToken } from '@angular/core';

export interface NavigationLockingConfig {
  actionsLockingNavigation?: string[];
  actionsUnLockingNavigation?: string[];
}

export const NGSSM_NAVIGATION_LOCKING_CONFIG = new InjectionToken<NavigationLockingConfig>('NGSSM_NAVIGATION_LOCKING_CONFIG');
