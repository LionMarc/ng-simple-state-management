import { inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgssmDataSourceValueStatus, selectNgssmDataSourceValue, updateNgssmDataState } from 'ngssm-data';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

/**
 * Utility service for setting and updating data source values, status, parameters, and additional properties
 * in the StoreMock during tests. Provides methods for manipulating the test state of data sources.
 */
@Injectable()
export class NgssmDataSourceValueSetter {
  public readonly store = inject(Store) as unknown as StoreMock;

  /**
   * Sets the status of a data source in the StoreMock.
   * Throws an error if the data source is not found.
   * @param datasourceKey The key of the data source.
   * @param status The new status to set.
   * @returns The NgssmDataSourceValueSetter instance for chaining.
   */
  public setDataSourceStatus(datasourceKey: string, status: NgssmDataSourceValueStatus): NgssmDataSourceValueSetter {
    this.checkDataSource(datasourceKey);
    this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
      dataSourceValues: {
        [datasourceKey]: {
          status: { $set: status }
        }
      }
    });

    return this;
  }

  /**
   * Sets the value of a data source in the StoreMock.
   * Throws an error if the data source is not found.
   * @param datasourceKey The key of the data source.
   * @param value The value to set.
   * @returns The NgssmDataSourceValueSetter instance for chaining.
   */
  public setDataSourceValue<T>(datasourceKey: string, value?: T): NgssmDataSourceValueSetter {
    this.checkDataSource(datasourceKey);
    this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
      dataSourceValues: {
        [datasourceKey]: {
          value: { $set: value }
        }
      }
    });

    return this;
  }

  /**
   * Sets the parameter of a data source in the StoreMock.
   * Throws an error if the data source is not found.
   * @param datasourceKey The key of the data source.
   * @param value The parameter value to set.
   * @returns The NgssmDataSourceValueSetter instance for chaining.
   */
  public setDataSourceParameter<T>(datasourceKey: string, value?: T): NgssmDataSourceValueSetter {
    this.checkDataSource(datasourceKey);
    this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
      dataSourceValues: {
        [datasourceKey]: {
          parameter: { $set: value }
        }
      }
    });

    return this;
  }

  /**
   * Sets an additional property for a data source in the StoreMock.
   * Throws an error if the data source is not found.
   * @param datasourceKey The key of the data source.
   * @param additionalProperty The name of the additional property.
   * @param value The value to set for the additional property.
   * @param status The status to set for the additional property (defaults to loaded).
   * @returns The NgssmDataSourceValueSetter instance for chaining.
   */
  public setAdditionalProperty<T>(
    datasourceKey: string,
    additionalProperty: string,
    value?: T,
    status: NgssmDataSourceValueStatus = NgssmDataSourceValueStatus.loaded
  ): NgssmDataSourceValueSetter {
    this.checkDataSource(datasourceKey);
    this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
      dataSourceValues: {
        [datasourceKey]: {
          additionalProperties: {
            [additionalProperty]: {
              $set: {
                value,
                status
              }
            }
          }
        }
      }
    });

    return this;
  }

  /**
   * Checks if the specified data source is initialized in the StoreMock.
   * Throws an error if the data source is not found.
   * @param datasourceKey The key of the data source to check.
   */
  public checkDataSource(datasourceKey: string) {
    const dataSourceValue = selectNgssmDataSourceValue(this.store.stateValue, datasourceKey);
    if (!dataSourceValue) {
      throw new Error(`Data source '${datasourceKey}' is not initialized.`);
    }
  }
}

export const ngssmDataSourceValueSetter = () => TestBed.inject(NgssmDataSourceValueSetter);
