import { inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgssmDataSourceValueStatus, updateNgssmDataState } from 'ngssm-data';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

@Injectable()
export class NgssmDataSourceValueSetter {
  public readonly store = inject(Store) as unknown as StoreMock;

  public setDataSourceStatus(datasourceKey: string, status: NgssmDataSourceValueStatus): NgssmDataSourceValueSetter {
    this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
      dataSourceValues: {
        [datasourceKey]: {
          status: { $set: status }
        }
      }
    });

    return this;
  }

  public setDataSourceValue<T>(datasourceKey: string, value?: T): NgssmDataSourceValueSetter {
    this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
      dataSourceValues: {
        [datasourceKey]: {
          value: { $set: value }
        }
      }
    });

    return this;
  }
}

export const ngssmDataSourceValueSetter = () => TestBed.inject(NgssmDataSourceValueSetter);
