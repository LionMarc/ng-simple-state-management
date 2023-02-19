import { State } from 'ngssm-store';

import { selectRemoteDataState } from './remote-data.state';

export const selectRemoteData = (state: State, remoteDataKey: string) => selectRemoteDataState(state)[remoteDataKey];
