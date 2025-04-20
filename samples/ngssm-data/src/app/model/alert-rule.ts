import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgssmDataLoading } from 'ngssm-data';

export const alertRulesKey = '@ngssm-data-demo:alert-rules';
export const alertRulesUrl = '/data/alert-rules.json';

export type AlertLevel = 'Info' | 'Warning' | 'Error';

export interface AlertRule {
  id: number;
  title: string;
  level: AlertLevel;
}

export const alertRulesLoader: NgssmDataLoading<AlertRule[]> = () => {
  return inject(HttpClient).get<AlertRule[]>(alertRulesUrl);
};
