import { InjectionToken } from '@angular/core';

export interface RemoteCallConfig {
  id: string;
  triggeredActionTypes: string[];
  resultActionTypes: string[];
}

export const NGSSM_REMOTE_CALL_CONFIG = new InjectionToken<RemoteCallConfig>('NGSSM_REMOTE_CALL_CONFIG');
