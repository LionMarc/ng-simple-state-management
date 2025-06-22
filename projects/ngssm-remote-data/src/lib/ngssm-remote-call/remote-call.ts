import { HttpErrorResponse } from '@angular/common/http';

// Represents the possible statuses of a remote call.
export enum RemoteCallStatus {
  none = 'None', // No call has been made yet
  inProgress = 'In progress', // The remote call is currently in progress
  done = 'Done', // The remote call completed successfully
  ko = 'Ko' // The remote call failed
}

// Describes the state and result of a remote call, including error information if applicable.
export interface RemoteCall {
  status: RemoteCallStatus; // The current status of the remote call
  httpErrorResponse?: HttpErrorResponse; // Optional HTTP error response if the call failed
  message?: string; // Optional message describing the result or error
}

/**
 * Returns a default RemoteCall object with the specified status (defaults to 'none').
 * @param status The status to set for the remote call.
 * @returns A RemoteCall object with the given status.
 */
export const getDefaultRemoteCall = (status: RemoteCallStatus = RemoteCallStatus.none): RemoteCall => ({ status });
