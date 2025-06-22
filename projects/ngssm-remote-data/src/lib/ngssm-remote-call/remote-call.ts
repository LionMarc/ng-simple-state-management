import { HttpErrorResponse } from '@angular/common/http';

// Represents the possible statuses of a remote call.
export enum RemoteCallStatus {
  none = 'None', // No call has been made yet
  inProgress = 'In progress', // The remote call is currently in progress
  done = 'Done', // The remote call completed successfully
  ko = 'Ko' // The remote call failed
}

/**
 * Describes the state and result of a remote call, including error information if applicable.
 *
 * Note that the property error is only here to ensure compatibility with previous versions. It will be removed in a future release.
 * Only the processRemoteCallError helper sets this property.
 * The service RemoteCallResultProcessor which must be used instead of the helper does not set this property.
 */
export interface RemoteCall<TErrorType = unknown> {
  status: RemoteCallStatus; // The current status of the remote call
  httpErrorResponse?: HttpErrorResponse; // Optional HTTP error response if the call failed
  message?: string; // Optional message describing the result or error
  error?: TErrorType; // Error property of HttpErrorResponse => to avoid too many impacts on code using this.
}

/**
 * Returns a default RemoteCall object with the specified status (defaults to 'none').
 * @param status The status to set for the remote call.
 * @returns A RemoteCall object with the given status.
 */
export const getDefaultRemoteCall = (status: RemoteCallStatus = RemoteCallStatus.none): RemoteCall => ({ status });
