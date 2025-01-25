import { State } from 'ngssm-store';

import { selectRemoteDataState } from './remote-data.state';
import { RemoteData } from '../model';

export const selectRemoteData = <TData = unknown>(state: State, remoteDataKey: string): RemoteData<TData> | undefined =>
  selectRemoteDataState(state)[remoteDataKey] as RemoteData<TData>;
