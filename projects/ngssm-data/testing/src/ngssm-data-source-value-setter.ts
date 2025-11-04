import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgssmDataSourceValueStatus, selectNgssmDataSourceValue, updateNgssmDataState } from 'ngssm-data';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

/**
 * Utility service for setting and updating data source values, status, parameters, and additional properties
 * in the StoreMock during tests.
 *
 * Provides methods to:
 * - apply direct updates to a data source value (status, value, parameter),
 * - manage additional properties (set value/status and set per-property http errors),
 * - set/clear overall parameter validity (parameterIsValid) or partial validity entries
 *   (parameterPartialValidity map) for per-field validation,
 * - mark a data source value as outdated (valueOutdated flag) when parameters change,
 * - set a top-level httpErrorResponse on the data source value (setDataSourceError).
 *
 * All methods return the NgssmDataSourceValueSetter instance for fluent chaining.
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
   * Sets or clears the top-level HTTP error response for a data source in the StoreMock.
   *
   * This is useful in tests to simulate an error that occurred while loading the main data source value.
   * The method ensures the data source is initialized and updates the data source's httpErrorResponse
   * field with the provided HttpErrorResponse or clears it when undefined is passed.
   *
   * @param datasourceKey The key of the data source to update.
   * @param error Optional HttpErrorResponse to set; pass undefined to clear the error.
   * @returns The NgssmDataSourceValueSetter instance for chaining.
   */
  public setDataSourceError(datasourceKey: string, error?: HttpErrorResponse): NgssmDataSourceValueSetter {
    this.checkDataSource(datasourceKey);
    this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
      dataSourceValues: {
        [datasourceKey]: {
          httpErrorResponse: { $set: error }
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
   * Sets the HTTP error response for a specific additional property of a data source in the StoreMock.
   *
   * Use this in tests to simulate a failure when loading an additional property (e.g. row detail).
   * Ensures the data source is initialized and sets or clears the additional property's httpErrorResponse.
   *
   * @param datasourceKey The key of the data source that owns the additional property.
   * @param additionalProperty The name of the additional property to update.
   * @param error Optional HttpErrorResponse to set; pass undefined to clear the error.
   * @returns The NgssmDataSourceValueSetter instance for chaining.
   */
  public setAdditionalPropertyError(
    datasourceKey: string,
    additionalProperty: string,
    error?: HttpErrorResponse
  ): NgssmDataSourceValueSetter {
    this.checkDataSource(datasourceKey);
    this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
      dataSourceValues: {
        [datasourceKey]: {
          additionalProperties: {
            [additionalProperty]: {
              httpErrorResponse: { $set: error }
            }
          }
        }
      }
    });

    return this;
  }

  /**
   * Sets the validity of a data source parameter.
   *
   * If partialKey is provided, the method updates the parameterPartialValidity map for the
   * specified data source (creating the map if it does not exist) and sets the boolean validity
   * for that partial key. If partialKey is not provided, the method updates the overall
   * parameterIsValid boolean for the data source.
   *
   * This method returns the NgssmDataSourceValueSetter for chaining.
   *
   * @param dataSourceKey The key of the data source whose parameter validity should be updated.
   * @param isValid True when the (partial) parameter is valid, false otherwise.
   * @param partialKey Optional identifier of a parameter sub-field to set partial validity for.
   */
  public setParameterValidity(dataSourceKey: string, isValid: boolean, partialKey?: string): NgssmDataSourceValueSetter {
    // Ensure the data source is initialized before updating validity
    this.checkDataSource(dataSourceKey);

    if (partialKey) {
      if (selectNgssmDataSourceValue(this.store.stateValue, dataSourceKey)?.parameterPartialValidity) {
        this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
          dataSourceValues: {
            [dataSourceKey]: {
              parameterPartialValidity: {
                [partialKey]: { $set: isValid }
              }
            }
          }
        });
      } else {
        this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
          dataSourceValues: {
            [dataSourceKey]: {
              parameterPartialValidity: {
                $set: {
                  [partialKey]: isValid
                }
              }
            }
          }
        });
      }
    } else {
      this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
        dataSourceValues: {
          [dataSourceKey]: {
            parameterIsValid: {
              $set: isValid
            }
          }
        }
      });
    }

    return this;
  }

  /**
   * Clears parameter validity information for a data source.
   *
   * If partialKey is provided, removes the partial validity entry for that key (if present).
   * If partialKey is not provided, resets the overall parameterIsValid flag to undefined.
   *
   * Returns the NgssmDataSourceValueSetter instance to allow method chaining.
   *
   * @param dataSourceKey The key of the data source whose parameter validity should be cleared.
   * @param partialKey Optional identifier of a parameter sub-field to clear partial validity for.
   */
  public clearParameterValidity(dataSourceKey: string, partialKey?: string): NgssmDataSourceValueSetter {
    // Ensure the data source is initialized before clearing validity
    this.checkDataSource(dataSourceKey);

    if (partialKey) {
      if (selectNgssmDataSourceValue(this.store.stateValue, dataSourceKey)?.parameterPartialValidity) {
        this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
          dataSourceValues: {
            [dataSourceKey]: {
              parameterPartialValidity: { $unset: [partialKey] }
            }
          }
        });
      }
    } else {
      this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
        dataSourceValues: {
          [dataSourceKey]: {
            parameterIsValid: {
              $set: undefined
            }
          }
        }
      });
    }

    return this;
  }

  /**
   * Sets or clears the "valueOutdated" flag for a data source.
   *
   * The flag indicates that the current stored value is outdated relative to its parameter
   * (for example, the parameter has changed and the value should be reloaded).
   *
   * @param dataSourceKey The key of the data source to update.
   * @param outdated True to mark the value as outdated, false to mark it as up-to-date.
   * @returns The NgssmDataSourceValueSetter instance for chaining.
   */
  public setOutdatedValueFlag(dataSourceKey: string, outdated: boolean): NgssmDataSourceValueSetter {
    // Ensure the data source is initialized before updating the outdated flag
    this.checkDataSource(dataSourceKey);

    this.store.stateValue = updateNgssmDataState(this.store.stateValue, {
      dataSourceValues: {
        [dataSourceKey]: {
          valueOutdated: {
            $set: outdated
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
