import { Observable, delay, of } from 'rxjs';

import { NgssmDataLoading } from 'ngssm-data';
import { State } from 'ngssm-store';

export const playersKey = 'gssm-data-demo:players';

export interface Player {
  name: string;
}

const players: Player[] = [
  {
    name: 'captain'
  }
];

export const playersLoader: NgssmDataLoading<Player[], unknown> = (state: State): Observable<Player[]> => {
  return of(players).pipe(delay(5000));
};
