import { InjectionToken } from '@angular/core';

export interface RemoteCallConfig {
  id: string;
  triggeredActionType: string;
  resultActionType: string;
}

export const NGSSM_REMOTE_CALL_CONFIG = new InjectionToken<RemoteCallConfig>('NGSSM_REMOTE_CALL_CONFIG');
