import { Router } from '@angular/router';
import { State } from 'ngssm-store';

export interface RoutingAction {
  navigate?(state: State, router: Router): void;
}
