import { Observable, delay, of } from 'rxjs';

import { NgssmDataLoading } from 'ngssm-data';

export const teamsKey = 'ngssm-data-demo:teams';

export interface Team {
  name: string;
}

const teams: Team[] = [
  {
    name: 'my-team'
  },
  {
    name: 'best-team'
  }
];

export const teamsLoader: NgssmDataLoading<Team[], unknown> = (): Observable<Team[]> => {
  return of(teams).pipe(delay(2000));
};
