import { InjectionToken, Provider } from '@angular/core';

import { Action } from 'ngssm-store';

import { RemoteCall } from './remote-call';

/**
 * Represents an action that encapsulates the result of a remote call.
 *
 * This action is typically dispatched when a remote call completes,
 * carrying both the action type and the associated remote call data.
 *
 * @remarks
 * Implements the `Action` interface.
 *
 * @param type - The type of the action.
 * @param remoteCall - The remote call instance containing the result details.
 */
export class NgssmRemoteCallResultAction implements Action {
  constructor(
    public readonly type: string,
    public readonly remoteCall: RemoteCall
  ) {}
}

// Configuration for a remote call, including its identifier and associated action types.
export interface RemoteCallConfig {
  id: string; // Unique identifier for the remote call
  triggeredActionTypes: string[]; // Action types that trigger the remote call
  resultActionTypes: string[]; // Action derived from NgssmRemoteCallResultAction that will notify end of call
}

/**
 * Injection token for providing NGSSM remote call configuration.
 * Used to register and inject RemoteCallConfig objects in Angular's dependency injection system.
 */
export const NGSSM_REMOTE_CALL_CONFIG = new InjectionToken<RemoteCallConfig>('NGSSM_REMOTE_CALL_CONFIG');

/**
 * Provides the configuration for NGSSM remote calls as an Angular provider.
 *
 * @param config - The remote call configuration object to be provided.
 * @returns An Angular provider object that supplies the given configuration for NGSSM remote calls.
 *
 * @remarks
 * This function is intended to be used in Angular module providers to register
 * multiple remote call configurations using the `multi: true` option.
 */
export const provideNgssmRemoteCallConfig = (config: RemoteCallConfig): Provider => ({
  provide: NGSSM_REMOTE_CALL_CONFIG,
  useValue: config,
  multi: true
});
