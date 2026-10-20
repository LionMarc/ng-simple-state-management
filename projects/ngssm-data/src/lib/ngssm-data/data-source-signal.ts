import { computed, inject, Signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from 'ngssm-store';

import { NgssmDataSourceValueStatus } from './model';
import { selectNgssmDataSourceValue } from './selectors';

export interface NgssmDataSourceSignal<T = unknown> {
  key: string;
  value: Signal<T>;
}

export interface NgssmDataSourceSignals<TData = unknown, TParameter = unknown> {
  key: Signal<string>;
  value: Signal<TData | undefined>;
  parameter: Signal<TParameter | undefined>;
  status: Signal<NgssmDataSourceValueStatus>;
  httpErrorResponse: Signal<HttpErrorResponse | undefined>;
}

export type NgssmDataSourceSignalType = 'value' | 'status' | 'parameter';

export interface NgssmDataSourceSignalOptions<T = unknown> {
  type?: NgssmDataSourceSignalType;
  defaultValue?: T;
}

export interface NgssmDataSourceSignalsOptions<TData = unknown, TParameter = unknown> {
  defaultValue?: TData;
  defaultParameter?: TParameter;
  defaultStatus?: NgssmDataSourceValueStatus;
}

export const dataSourceSignals = <TData = unknown, TParameter = unknown>(
  key: string | Signal<string>,
  options?: NgssmDataSourceSignalsOptions<TData, TParameter>
): NgssmDataSourceSignals<TData, TParameter> => {
  const store = inject(Store);
  const keySignal = computed(() => (typeof key === 'string' ? key : key()));
  const dataSourceValue = computed(() => selectNgssmDataSourceValue<TData, TParameter>(store.state(), keySignal()));

  return {
    key: keySignal,
    value: computed(() => dataSourceValue()?.value ?? options?.defaultValue),
    parameter: computed(() => dataSourceValue()?.parameter ?? options?.defaultParameter),
    status: computed(() => {
      const status = dataSourceValue().status;
      return status === NgssmDataSourceValueStatus.notRegistered ? (options?.defaultStatus ?? status) : status;
    }),
    httpErrorResponse: computed(() => dataSourceValue().httpErrorResponse)
  };
};

export const dataSourceToSignal = <T = unknown>(key: string, options?: NgssmDataSourceSignalOptions<T>): NgssmDataSourceSignal<T> => {
  const store = inject(Store);

  const usedOptions = options ?? { type: 'value' };
  if (!usedOptions.type) {
    usedOptions.type = 'value';
  }

  switch (usedOptions.type) {
    case 'status':
      return {
        key,
        value: computed(() => selectNgssmDataSourceValue(store.state(), key)?.status ?? options?.defaultValue) as Signal<T>
      };

    case 'value':
      return {
        key,
        value: computed(() => selectNgssmDataSourceValue<T>(store.state(), key)?.value ?? options?.defaultValue) as Signal<T>
      };

    case 'parameter':
      return {
        key,
        value: computed(() => selectNgssmDataSourceValue<T>(store.state(), key)?.parameter ?? options?.defaultValue) as Signal<T>
      };
  }
};
