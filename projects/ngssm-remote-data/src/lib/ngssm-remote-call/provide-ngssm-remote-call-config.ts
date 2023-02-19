import { Provider } from '@angular/core';
import { NGSSM_REMOTE_CALL_CONFIG, RemoteCallConfig } from './model';

export const provideNgssmRemoteCallConfig = (config: RemoteCallConfig): Provider => ({
  provide: NGSSM_REMOTE_CALL_CONFIG,
  useValue: config,
  multi: true
});
